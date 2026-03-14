import {
    type AvailabilityFilter,
    type SortField,
    type SortOrder,
    STATUS_OPTIONS
} from "../../../inventory/inventoryTypes.ts";
import { ResetButton } from "../../../common/forms_search_filter/ResetButton.tsx";
import { FilterButton } from "../../../common/forms_search_filter/FilterButton.tsx";

interface FilterSidebarProps {
    selectedStatuses: Set<string>;
    onStatusToggle: (status: string) => void;
    availabilityFilter: AvailabilityFilter;
    onAvailabilityChange: (filter: AvailabilityFilter) => void;
    categories: { id: number; name: string }[];
    selectedCategoryIds: Set<number>;
    onCategoryToggle: (id: number) => void;
    sortBy: SortField;
    sortOrder: SortOrder;
    onSortChange: (field: SortField) => void;
    onReset: () => void;
}

export function FilterSidebar({
                                  selectedStatuses,
                                  onStatusToggle,
                                  availabilityFilter,
                                  onAvailabilityChange,
                                  categories,
                                  selectedCategoryIds,
                                  onCategoryToggle,
                                  sortBy,
                                  sortOrder,
                                  onSortChange,
                                  onReset
                              }: FilterSidebarProps) {
    return (
        <div className="h-full flex flex-col bg-gray-50 dark:bg-gray-800/50 border-r border-gray-200 dark:border-gray-700">
            {/* Fixed Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
                <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">Filters</h3>
                <ResetButton onClick={onReset} className="px-2 py-1 text-xs" />
            </div>

            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto p-4 space-y-6">
                {/* Status filter */}
                <div>
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300 block mb-2">Status:</span>
                    <div className="flex flex-wrap gap-1">
                        {STATUS_OPTIONS.map(status => (
                            <FilterButton
                                key={status.value}
                                isSelected={selectedStatuses.has(status.value)}
                                onClick={() => onStatusToggle(status.value)}
                                className="text-xs px-2 py-1"
                            >
                                {status.label}
                            </FilterButton>
                        ))}
                    </div>
                </div>

                {/* Availability filter */}
                <div>
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300 block mb-2">Availability:</span>
                    <div className="flex gap-1">
                        {(['all', 'available', 'unavailable'] as AvailabilityFilter[]).map(filter => (
                            <FilterButton
                                key={filter}
                                isSelected={availabilityFilter === filter}
                                onClick={() => onAvailabilityChange(filter)}
                                className="text-xs px-2 py-1"
                            >
                                {filter === 'all' ? 'All' : filter === 'available' ? 'Available' : 'Unavailable'}
                            </FilterButton>
                        ))}
                    </div>
                </div>

                {/* Category filter */}
                {categories.length > 0 && (
                    <div>
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300 block mb-2">Category:</span>
                        <div className="flex flex-wrap gap-1">
                            {categories.map(cat => (
                                <FilterButton
                                    key={cat.id}
                                    isSelected={selectedCategoryIds.has(cat.id)}
                                    onClick={() => onCategoryToggle(cat.id)}
                                    className="text-xs px-2 py-1"
                                >
                                    {selectedCategoryIds.has(cat.id) && <i className="fas fa-check text-xs mr-1" />}
                                    {cat.name}
                                </FilterButton>
                            ))}
                        </div>
                    </div>
                )}

                {/* Sort controls */}
                <div>
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300 block mb-2">Sort by:</span>
                    <div className="flex flex-wrap gap-1">
                        <FilterButton
                            isSelected={sortBy === 'name'}
                            onClick={() => onSortChange('name')}
                            className="text-xs px-2 py-1"
                        >
                            Name {sortBy === 'name' && (sortOrder === 'asc' ? '↑' : '↓')}
                        </FilterButton>
                        <FilterButton
                            isSelected={sortBy === 'quantity'}
                            onClick={() => onSortChange('quantity')}
                            className="text-xs px-2 py-1"
                        >
                            Stock {sortBy === 'quantity' && (sortOrder === 'asc' ? '↑' : '↓')}
                        </FilterButton>
                        <FilterButton
                            isSelected={sortBy === 'date_acquired'}
                            onClick={() => onSortChange('date_acquired')}
                            className="text-xs px-2 py-1"
                        >
                            Acquired {sortBy === 'date_acquired' && (sortOrder === 'asc' ? '↑' : '↓')}
                        </FilterButton>
                        <FilterButton
                            isSelected={sortBy === 'expiry_date'}
                            onClick={() => onSortChange('expiry_date')}
                            className="text-xs px-2 py-1"
                        >
                            Expiry {sortBy === 'expiry_date' && (sortOrder === 'asc' ? '↑' : '↓')}
                        </FilterButton>
                    </div>
                </div>
            </div>
        </div>
    );
}