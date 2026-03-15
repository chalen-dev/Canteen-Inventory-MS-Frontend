// components/pos/POSInterface.tsx
import { useState, useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../../services/api';
import { showToast, showConfirmation } from '../../utils/swalHelpers';
import { SearchHeader } from '../common/forms_search_filter/SearchHeader';
import { Pagination } from '../common/Pagination';
import { LoadingSpinner } from '../common/loading/LoadingSpinner';
import { useTheme } from '../../contexts/ThemeContext';
import type { InventoryLog } from '../inventory/inventoryTypes';

interface CartItem {
    inventoryId: number;
    menuItem: {
        name: string;
        price: number;
        code: string | null;
    };
    quantity: number;
    unitPrice: number;
}

export default function POSInterface() {
    const queryClient = useQueryClient();
    const { theme, toggleTheme } = useTheme();
    const [searchTerm, setSearchTerm] = useState('');
    const [cart, setCart] = useState<CartItem[]>([]);
    const [page, setPage] = useState(1);
    const perPage = 12;

    // Fetch all inventory logs (filter out expired and archived)
    const {
        data: inventoryLogs = [],
        isLoading: logsLoading,
    } = useQuery({
        queryKey: ['inventory-logs-available'],
        queryFn: async () => {
            const response = await api.get<InventoryLog[]>('/inventory-logs');
            // Filter out expired and archived; include out of stock
            return response.data.filter(log =>
                !log.is_archived &&
                log.inventory_status !== 'expired' &&
                (!log.expiry_date || new Date(log.expiry_date) >= new Date())
            );
        },
    });

    // Compute stock priority for sorting
    const getStockPriority = (log: InventoryLog): number => {
        const qty = log.quantity_in_stock;
        if (qty > 10) return 1; // in stock
        if (qty > 0) return 2;   // low stock
        return 3;                 // out of stock
    };

    // Filter and sort inventory logs
    const processedLogs = useMemo(() => {
        return inventoryLogs
            .filter(log => {
                const term = searchTerm.toLowerCase();
                return (
                    log.menu_item?.name.toLowerCase().includes(term) ||
                    log.menu_item?.code?.toLowerCase().includes(term) ||
                    log.menu_item?.category?.name?.toLowerCase().includes(term)
                );
            })
            .sort((a, b) => {
                // Sort by stock priority first, then by name
                const priorityA = getStockPriority(a);
                const priorityB = getStockPriority(b);
                if (priorityA !== priorityB) {
                    return priorityA - priorityB;
                }
                const nameA = a.menu_item?.name || '';
                const nameB = b.menu_item?.name || '';
                return nameA.localeCompare(nameB);
            });
    }, [inventoryLogs, searchTerm]);

    // Pagination
    const totalPages = Math.ceil(processedLogs.length / perPage);
    const paginatedLogs = processedLogs.slice((page - 1) * perPage, page * perPage);

    // Cart functions
    const addToCart = (log: InventoryLog) => {
        if (log.quantity_in_stock <= 0) {
            showToast('Item is out of stock', 'info');
            return;
        }
        const existing = cart.find(item => item.inventoryId === log.id);
        if (existing) {
            setCart(cart.map(item =>
                item.inventoryId === log.id
                    ? { ...item, quantity: item.quantity + 1 }
                    : item
            ));
        } else {
            setCart([...cart, {
                inventoryId: log.id,
                menuItem: {
                    name: log.menu_item!.name,
                    price: Number(log.menu_item!.price),
                    code: log.menu_item!.code,
                },
                quantity: 1,
                unitPrice: Number(log.menu_item!.price),
            }]);
        }
    };

    const updateQuantity = (inventoryId: number, newQuantity: number) => {
        if (newQuantity < 1) return;
        setCart(cart.map(item =>
            item.inventoryId === inventoryId
                ? { ...item, quantity: newQuantity }
                : item
        ));
    };

    const removeFromCart = (inventoryId: number) => {
        setCart(cart.filter(item => item.inventoryId !== inventoryId));
    };

    const totalAmount = cart.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0);

    // Checkout mutation
    const checkoutMutation = useMutation({
        mutationFn: async () => {
            const orderPayload = {
                order_status: 'pending',
                description: 'POS sale',
            };
            const orderRes = await api.post('/orders', orderPayload);
            const orderId = orderRes.data.id;

            const itemPromises = cart.map(item =>
                api.post('/order-items', {
                    order_id: orderId,
                    inventory_id: item.inventoryId,
                    quantity: item.quantity,
                    amount: item.unitPrice * item.quantity,
                })
            );
            await Promise.all(itemPromises);
            return orderId;
        },
        onSuccess: (orderId) => {
            queryClient.invalidateQueries({ queryKey: ['orders'] });
            queryClient.invalidateQueries({ queryKey: ['inventory-logs-available'] });
            setCart([]);
            showToast(`Order #${orderId} created successfully`, 'success');
        },
        onError: (error) => {
            showToast('Failed to complete order', 'error');
            console.error(error);
        },
    });

    const handleCheckout = async () => {
        if (cart.length === 0) {
            showToast('Cart is empty', 'info');
            return;
        }
        const confirmed = await showConfirmation(
            'Confirm Order',
            `Create order for ₱${totalAmount.toFixed(2)}?`,
            'question',
            'Yes, complete'
        );
        if (!confirmed) return;
        checkoutMutation.mutate();
    };

    if (logsLoading) return <LoadingSpinner />;

    return (
        <div className="h-screen flex flex-col bg-gray-100 dark:bg-gray-900">
            {/* Custom Header with back button, title, and theme toggle */}
            <header className="bg-white dark:bg-gray-800 shadow-md px-6 py-4 flex items-center justify-between">
                <div className="flex items-center">
                    <button
                        onClick={() => window.history.back()}
                        className="mr-4 p-2 text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white"
                    >
                        <i className="fas fa-arrow-left text-xl" />
                    </button>
                    <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Point of Sale</h1>
                </div>
                {/* Theme toggle button */}
                <button
                    onClick={toggleTheme}
                    className="relative w-12 h-6 bg-gray-200 dark:bg-gray-700 rounded-full transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 dark:focus:ring-offset-gray-800"
                    aria-label="Toggle theme"
                >
                    <span
                        className={`absolute top-1 left-1 w-4 h-4 rounded-full shadow-md transform transition-transform duration-300 flex items-center justify-center ${
                            theme === 'dark' ? 'translate-x-6' : ''
                        }`}
                    >
                        <span className="text-xs text-gray-600 dark:text-gray-300">
                            {theme === 'light' ? '☀️' : '🌙'}
                        </span>
                    </span>
                </button>
            </header>

            {/* Main content */}
            <div className="flex-1 flex overflow-hidden p-4 gap-4">
                {/* Left side: item grid */}
                <div className="flex-1 flex flex-col bg-white dark:bg-gray-800 rounded-lg shadow-md p-4">
                    <SearchHeader
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder="Search by name, code, or category..."
                        hideToggle
                        showAdvanced={false}
                        onToggleAdvanced={() => {}}
                        className="mb-4"
                    />
                    <div className="flex-1 overflow-y-auto">
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                            {paginatedLogs.map(log => {
                                const isOutOfStock = log.quantity_in_stock <= 0;
                                return (
                                    <button
                                        key={log.id}
                                        onClick={() => addToCart(log)}
                                        disabled={isOutOfStock}
                                        className={`bg-gray-50 dark:bg-gray-700 rounded-lg p-4 text-left hover:shadow-md transition-shadow border border-gray-200 dark:border-gray-600 ${
                                            isOutOfStock ? 'opacity-50 cursor-not-allowed' : ''
                                        }`}
                                    >
                                        <div className="font-medium text-gray-900 dark:text-white">
                                            {log.menu_item?.name}
                                        </div>
                                        <div className="text-sm text-gray-500 dark:text-gray-400">
                                            {log.menu_item?.code}
                                        </div>
                                        <div className="mt-2 text-lg font-bold text-primary">
                                            ₱{Number(log.menu_item?.price).toFixed(2)}
                                        </div>
                                        <div className="text-xs mt-1">
                                            {log.quantity_in_stock > 0 ? (
                                                log.quantity_in_stock <= 10 ? (
                                                    <span className="text-yellow-600 dark:text-yellow-400">Low Stock</span>
                                                ) : (
                                                    <span className="text-green-600 dark:text-green-400">In Stock</span>
                                                )
                                            ) : (
                                                <span className="text-red-600 dark:text-red-400">Out of Stock</span>
                                            )}
                                        </div>
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                    {totalPages > 1 && (
                        <div className="mt-4">
                            <Pagination
                                currentPage={page}
                                totalPages={totalPages}
                                onPageChange={setPage}
                            />
                        </div>
                    )}
                </div>

                {/* Right side: cart */}
                <div className="w-96 flex flex-col bg-white dark:bg-gray-800 rounded-lg shadow-md p-4">
                    <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">Cart</h2>
                    <div className="flex-1 overflow-y-auto space-y-2">
                        {cart.map(item => (
                            <div key={item.inventoryId} className="border border-gray-200 dark:border-gray-700 rounded-lg p-3">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <div className="font-medium text-gray-900 dark:text-white">
                                            {item.menuItem.name}
                                        </div>
                                        <div className="text-sm text-gray-500 dark:text-gray-400">
                                            ₱{item.unitPrice.toFixed(2)} each
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => removeFromCart(item.inventoryId)}
                                        className="text-red-500 hover:text-red-700"
                                    >
                                        <i className="fas fa-trash" />
                                    </button>
                                </div>
                                <div className="flex items-center justify-between mt-2">
                                    <div className="flex items-center gap-1">
                                        <button
                                            onClick={() => updateQuantity(item.inventoryId, item.quantity - 1)}
                                            disabled={item.quantity <= 1}
                                            className="w-6 h-6 bg-red-500 text-white rounded hover:bg-red-600 disabled:opacity-50"
                                        >
                                            -
                                        </button>
                                        <span className="w-8 text-center text-gray-900 dark:text-white">
                                            {item.quantity}
                                        </span>
                                        <button
                                            onClick={() => updateQuantity(item.inventoryId, item.quantity + 1)}
                                            className="w-6 h-6 bg-green-500 text-white rounded hover:bg-green-600"
                                        >
                                            +
                                        </button>
                                    </div>
                                    <span className="font-medium text-gray-900 dark:text-white">
                                        ₱{(item.unitPrice * item.quantity).toFixed(2)}
                                    </span>
                                </div>
                            </div>
                        ))}
                        {cart.length === 0 && (
                            <p className="text-center text-gray-500 dark:text-gray-400 py-8">
                                Cart is empty
                            </p>
                        )}
                    </div>
                    <div className="border-t border-gray-200 dark:border-gray-700 mt-4 pt-4">
                        <div className="flex justify-between text-lg font-bold text-gray-900 dark:text-white">
                            <span>Total:</span>
                            <span>₱{totalAmount.toFixed(2)}</span>
                        </div>
                        <button
                            onClick={handleCheckout}
                            disabled={checkoutMutation.isPending || cart.length === 0}
                            className="w-full mt-4 bg-primary text-white py-3 rounded-lg font-medium hover:bg-primary-dark disabled:opacity-50"
                        >
                            {checkoutMutation.isPending ? 'Processing...' : 'Checkout'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}