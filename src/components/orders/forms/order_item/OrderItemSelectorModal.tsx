// components/orders/forms/order_item/OrderItemSelectorModal.tsx
import { useState, useEffect, useMemo } from 'react';
import type { AvailabilityFilter, InventoryLog, SortField, SortOrder } from "../../../inventory/inventoryTypes.ts";
import { SearchHeader } from "../../../common/forms_search_filter/SearchHeader.tsx";
import { FilterSidebar } from "./FilterSidebar.tsx";
import { ItemTable } from "./ItemTable.tsx";
import { Pagination } from "../../../common/Pagination.tsx";
import { CancelButton } from "../../../common/forms_main/CancelButton.tsx";
import { ActionButton } from "../../../common/forms_action/ActionButton.tsx";

interface OrderItemSelectorModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSelect: (items: { inventoryId: number; quantity: number }[]) => void;
    existingSelections: { inventoryId: number; quantity: number }[];
    inventoryLogs: InventoryLog[];
}

export function OrderItemSelectorModal({
                                           isOpen,
                                           onClose,
                                           onSelect,
                                           existingSelections,
                                           inventoryLogs
                                       }: OrderItemSelectorModalProps) {
    // Filter and sort state
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedStatuses, setSelectedStatuses] = useState<Set<string>>(new Set());
    const [availabilityFilter, setAvailabilityFilter] = useState<AvailabilityFilter>('available');
    const [selectedCategoryIds, setSelectedCategoryIds] = useState<Set<number>>(new Set());
    const [sortBy, setSortBy] = useState<SortField>('name');
    const [sortOrder, setSortOrder] = useState<SortOrder>('asc');
    const [page, setPage] = useState(1);
    const perPage = 10;

    // Selection state – initialize when modal opens
    const [selectedItems, setSelectedItems] = useState<Map<number, number>>(() => {
        const map = new Map();
        existingSelections.forEach(({ inventoryId, quantity }) => {
            map.set(inventoryId, quantity);
        });
        return map;
    });

    // Sync with existingSelections only when modal opens, not during interaction
    useEffect(() => {
        // eslint-disable-next-line react-hooks/exhaustive-deps
        if (isOpen) {
            const map = new Map();
            existingSelections.forEach(({ inventoryId, quantity }) => {
                map.set(inventoryId, quantity);
            });
            // eslint-disable-next-line react-hooks/set-state-in-effect
            setSelectedItems(map);
        }
    }, [isOpen]);

    // Reset page when filters change
    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setPage(1);
    }, [searchTerm, selectedStatuses, availabilityFilter, selectedCategoryIds, sortBy, sortOrder]);

    const availableLogs = useMemo(
        () => inventoryLogs.filter(log => !log.is_archived),
        [inventoryLogs]
    );

    const categories = useMemo(() => {
        const categoryMap = new Map<number, { id: number; name: string }>();
        availableLogs.forEach(log => {
            const cat = log.menu_item?.category;
            if (cat && !categoryMap.has(cat.id)) {
                categoryMap.set(cat.id, { id: cat.id, name: cat.name });
            }
        });
        return Array.from(categoryMap.values()).sort((a, b) => a.name.localeCompare(b.name));
    }, [availableLogs]);

    const filteredLogs = useMemo(() => {
        return availableLogs.filter(log => {
            const term = searchTerm.toLowerCase();
            const matchesSearch =
                !searchTerm ||
                log.menu_item?.name.toLowerCase().includes(term) ||
                log.menu_item?.code?.toLowerCase().includes(term) ||
                log.menu_item?.category?.name?.toLowerCase().includes(term) ||
                log.inventory_status?.toLowerCase().includes(term);

            const matchesStatus =
                selectedStatuses.size === 0 ||
                (log.inventory_status && selectedStatuses.has(log.inventory_status));

            const matchesAvailability =
                availabilityFilter === 'all' ||
                (availabilityFilter === 'available' && log.is_available && log.quantity_in_stock > 0) ||
                (availabilityFilter === 'unavailable' && (!log.is_available || log.quantity_in_stock === 0));

            const matchesCategory =
                selectedCategoryIds.size === 0 ||
                (log.menu_item?.category?.id && selectedCategoryIds.has(log.menu_item.category.id));

            return matchesSearch && matchesStatus && matchesAvailability && matchesCategory;
        });
    }, [availableLogs, searchTerm, selectedStatuses, availabilityFilter, selectedCategoryIds]);

    const sortedLogs = useMemo(() => {
        return [...filteredLogs].sort((a, b) => {
            let aVal: string | number = '';
            let bVal: string | number = '';

            switch (sortBy) {
                case 'name':
                    aVal = a.menu_item?.name || '';
                    bVal = b.menu_item?.name || '';
                    break;
                case 'quantity':
                    aVal = a.quantity_in_stock;
                    bVal = b.quantity_in_stock;
                    break;
                case 'date_acquired':
                    aVal = a.date_acquired ? new Date(a.date_acquired).getTime() : 0;
                    bVal = b.date_acquired ? new Date(b.date_acquired).getTime() : 0;
                    break;
                case 'expiry_date':
                    aVal = a.expiry_date ? new Date(a.expiry_date).getTime() : 0;
                    bVal = b.expiry_date ? new Date(b.expiry_date).getTime() : 0;
                    break;
            }

            if (typeof aVal === 'string' && typeof bVal === 'string') {
                return sortOrder === 'asc' ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
            } else {
                const aNum = aVal as number;
                const bNum = bVal as number;
                return sortOrder === 'asc' ? aNum - bNum : bNum - aNum;
            }
        });
    }, [filteredLogs, sortBy, sortOrder]);

    const totalPages = Math.ceil(sortedLogs.length / perPage);
    const paginatedLogs = sortedLogs.slice((page - 1) * perPage, page * perPage);

    const handleCheckboxChange = (logId: number, checked: boolean) => {
        setSelectedItems(prev => {
            const newMap = new Map(prev);
            if (checked) newMap.set(logId, 1);
            else newMap.delete(logId);
            return newMap;
        });
    };

    const handleAdd = () => {
        const items = Array.from(selectedItems.entries()).map(([inventoryId, quantity]) => ({
            inventoryId,
            quantity
        }));
        onSelect(items);
        onClose();
    };

    const handleStatusToggle = (status: string) => {
        setSelectedStatuses(prev => {
            const newSet = new Set(prev);
            if (newSet.has(status)) newSet.delete(status);
            else newSet.add(status);
            return newSet;
        });
    };

    const handleCategoryToggle = (categoryId: number) => {
        setSelectedCategoryIds(prev => {
            const newSet = new Set(prev);
            if (newSet.has(categoryId)) newSet.delete(categoryId);
            else newSet.add(categoryId);
            return newSet;
        });
    };

    const handleSortChange = (field: SortField) => {
        if (sortBy === field) {
            setSortOrder(prev => (prev === 'asc' ? 'desc' : 'asc'));
        } else {
            setSortBy(field);
            setSortOrder('asc');
        }
    };

    const handleResetFilters = () => {
        setSearchTerm('');
        setSelectedStatuses(new Set());
        setAvailabilityFilter('all');
        setSelectedCategoryIds(new Set());
        setSortBy('name');
        setSortOrder('asc');
        setPage(1);
    };

    const isAvailable = (log: InventoryLog) => {
        const expired = log.inventory_status === 'expired' || (log.expiry_date && new Date(log.expiry_date) < new Date());
        return log.is_available && log.quantity_in_stock > 0 && !expired;
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm" onClick={onClose}>
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-7xl h-[90vh] overflow-hidden flex flex-col" onClick={(e) => e.stopPropagation()}>
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Select Inventory Items</h2>
                    <button onClick={onClose} className="p-1.5 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {/* Two-column layout */}
                <div className="flex flex-1 overflow-hidden">
                    {/* Left column: FilterSidebar (fixed width) */}
                    <div className="w-80">
                        <FilterSidebar
                            selectedStatuses={selectedStatuses}
                            onStatusToggle={handleStatusToggle}
                            availabilityFilter={availabilityFilter}
                            onAvailabilityChange={setAvailabilityFilter}
                            categories={categories}
                            selectedCategoryIds={selectedCategoryIds}
                            onCategoryToggle={handleCategoryToggle}
                            sortBy={sortBy}
                            sortOrder={sortOrder}
                            onSortChange={handleSortChange}
                            onReset={handleResetFilters}
                        />
                    </div>

                    {/* Right column: search, table, pagination */}
                    <div className="flex-1 flex flex-col overflow-hidden">
                        {/* Search bar (no toggle button) */}
                        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                            <SearchHeader
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                placeholder="Search by name, code, category, or status..."
                                hideToggle={true}
                                showAdvanced={false}
                                onToggleAdvanced={() => {}}
                            />
                        </div>

                        {/* Table area (scrollable) */}
                        <div className="flex-1 overflow-y-auto">
                            <ItemTable
                                logs={paginatedLogs}
                                selectedItems={selectedItems}
                                onCheckboxChange={handleCheckboxChange}
                                isAvailable={isAvailable}
                            />
                        </div>

                        {/* Pagination (if needed) */}
                        {totalPages > 1 && (
                            <div className="border-t border-gray-200 dark:border-gray-700 py-2 px-4">
                                <Pagination
                                    currentPage={page}
                                    totalPages={totalPages}
                                    onPageChange={setPage}
                                />
                            </div>
                        )}
                    </div>
                </div>

                {/* Footer */}
                <div className="flex justify-end gap-4 px-6 py-4 border-t border-gray-200 dark:border-gray-700">
                    <CancelButton onClick={onClose} label="Cancel" />
                    <ActionButton
                        variant="blue"
                        onClick={handleAdd}
                        disabled={selectedItems.size === 0}
                        icon="plus"
                        count={selectedItems.size}
                    >
                        Add Selected
                    </ActionButton>
                </div>
            </div>
        </div>
    );
}