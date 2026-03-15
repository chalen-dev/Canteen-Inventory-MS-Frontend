// contexts/CartContext.tsx
import { createContext, useContext, useState, type ReactNode } from 'react';

export interface CartItem {
    menuItemId: number;
    name: string;
    price: number;
    quantity: number;
    notes?: string;
}

interface CartContextType {
    items: CartItem[];
    addItem: (item: Omit<CartItem, 'quantity'> & { quantity?: number }) => void;
    updateQuantity: (menuItemId: number, quantity: number) => void;
    removeItem: (menuItemId: number) => void;
    clearCart: () => void;
    totalItems: number;
    totalAmount: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
    const [items, setItems] = useState<CartItem[]>([]);

    const addItem = (item: Omit<CartItem, 'quantity'> & { quantity?: number }) => {
        setItems(prev => {
            const existing = prev.find(i => i.menuItemId === item.menuItemId);
            if (existing) {
                return prev.map(i =>
                    i.menuItemId === item.menuItemId
                        ? { ...i, quantity: i.quantity + (item.quantity || 1) }
                        : i
                );
            }
            return [...prev, { ...item, quantity: item.quantity || 1 }];
        });
    };

    const updateQuantity = (menuItemId: number, quantity: number) => {
        if (quantity <= 0) {
            removeItem(menuItemId);
            return;
        }
        setItems(prev =>
            prev.map(item =>
                item.menuItemId === menuItemId ? { ...item, quantity } : item
            )
        );
    };

    const removeItem = (menuItemId: number) => {
        setItems(prev => prev.filter(item => item.menuItemId !== menuItemId));
    };

    const clearCart = () => setItems([]);

    const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
    const totalAmount = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

    return (
        <CartContext.Provider value={{ items, addItem, updateQuantity, removeItem, clearCart, totalItems, totalAmount }}>
            {children}
        </CartContext.Provider>
    );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useCart() {
    const context = useContext(CartContext);
    if (!context) throw new Error('useCart must be used within CartProvider');
    return context;
}