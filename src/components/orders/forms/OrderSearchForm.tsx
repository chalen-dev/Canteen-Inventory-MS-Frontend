// components/orders/forms/OrderSearchForm.tsx
import { useState } from 'react';
import {
    type OrderStatus,
    ORDER_STATUS_OPTIONS,
} from '../orderTypes';
import { SearchHeader } from '../../common/forms_search_filter/SearchHeader';
import { FilterButton } from '../../common/forms_search_filter/FilterButton';
import { ResetButton } from '../../common/forms_search_filter/ResetButton';

interface OrderSearchFormProps {
    searchTerm: string;
    onSearchChange: (term: string) => void;
    selectedStatuses: Set<OrderStatus>;
    onStatusToggle: (status: OrderStatus) => void;
    sortBy: 'created_at' | 'total_amount' | 'customer_name' | 'status';
    sortOrder: 'asc' | 'desc';
    onSortChange: (by: 'created_at' | 'total_amount' | 'customer_name' | 'status', order: 'asc' | 'desc') => void;
    onReset: () => void;
}

export function OrderSearchForm({
                                    searchTerm,
                                    onSearchChange,
                                    selectedStatuses,
                                    onStatusToggle,
                                    sortBy,
                                    sortOrder,
                                    onSortChange,
                                    onReset,
                                }: OrderSearchFormProps) {
    const [showAdvanced, setShowAdvanced] = useState(false);

    const handleSort = (field: 'created_at' | 'total_amount' | 'customer_name' | 'status') => {
        const newOrder = sortBy === field && sortOrder === 'asc' ? 'desc' : 'asc';
        onSortChange(field, newOrder);
    };

    return (
        <div className="p-4 space-y-4">
            <SearchHeader
                value={searchTerm}
                onChange={(e) => onSearchChange(e.target.value)}
                placeholder="Search by customer name or description..."
                showAdvanced={showAdvanced}
                onToggleAdvanced={() => setShowAdvanced(!showAdvanced)}
            />

            {showAdvanced && (
                <>
                    {/* Status filter */}
                    <div>
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300 block mb-2">
                            Filter by status:
                        </span>
                        <div className="flex flex-wrap gap-2">
                            {ORDER_STATUS_OPTIONS.map(option => (
                                <FilterButton
                                    key={option.value}
                                    isSelected={selectedStatuses.has(option.value)}
                                    onClick={() => onStatusToggle(option.value)}
                                >
                                    {option.label}
                                </FilterButton>
                            ))}
                        </div>
                    </div>

                    {/* Sort controls */}
                    <div>
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300 block mb-2">
                            Sort by:
                        </span>
                        <div className="flex flex-wrap gap-2">
                            <FilterButton
                                isSelected={sortBy === 'created_at'}
                                onClick={() => handleSort('created_at')}
                            >
                                Date {sortBy === 'created_at' && (sortOrder === 'asc' ? '↑' : '↓')}
                            </FilterButton>
                            <FilterButton
                                isSelected={sortBy === 'total_amount'}
                                onClick={() => handleSort('total_amount')}
                            >
                                Amount {sortBy === 'total_amount' && (sortOrder === 'asc' ? '↑' : '↓')}
                            </FilterButton>
                            <FilterButton
                                isSelected={sortBy === 'customer_name'}
                                onClick={() => handleSort('customer_name')}
                            >
                                Customer {sortBy === 'customer_name' && (sortOrder === 'asc' ? '↑' : '↓')}
                            </FilterButton>
                            <FilterButton
                                isSelected={sortBy === 'status'}
                                onClick={() => handleSort('status')}
                            >
                                Status {sortBy === 'status' && (sortOrder === 'asc' ? '↑' : '↓')}
                            </FilterButton>
                        </div>
                    </div>

                    <ResetButton onClick={onReset} />
                </>
            )}
        </div>
    );
}