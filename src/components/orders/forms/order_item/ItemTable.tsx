import type { InventoryLog } from "../../../inventory/inventoryTypes.ts";

interface ItemTableProps {
    logs: InventoryLog[];
    selectedItems: Map<number, number>;
    onCheckboxChange: (id: number, checked: boolean) => void;
    onQuantityChange: (id: number, quantity: number) => void;
    isAvailable: (log: InventoryLog) => boolean;
}

export function ItemTable({
                              logs,
                              selectedItems,
                              onCheckboxChange,
                              onQuantityChange,
                              isAvailable
                          }: ItemTableProps) {
    const isExpired = (log: InventoryLog) => {
        return log.inventory_status === 'expired' || (log.expiry_date && new Date(log.expiry_date) < new Date());
    };

    const getStatusBadge = (log: InventoryLog) => {
        if (isExpired(log)) {
            return <span className="px-2 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300">Expired</span>;
        }
        if (!log.is_available) {
            return <span className="px-2 py-1 text-xs font-semibold rounded-full bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300">Unavailable</span>;
        }
        if (log.quantity_in_stock === 0) {
            return <span className="px-2 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300">Out of Stock</span>;
        }
        if (log.quantity_in_stock < 10) {
            return <span className="px-2 py-1 text-xs font-semibold rounded-full bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300">Low Stock</span>;
        }
        return <span className="px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300">In Stock</span>;
    };

    // Toggle selection for a log (used by cell clicks)
    const handleToggleSelect = (log: InventoryLog) => {
        if (!isAvailable(log)) return;
        const checked = !selectedItems.has(log.id);
        onCheckboxChange(log.id, checked);
    };

    return (
        <table className="min-w-full text-sm">
            <thead className="bg-gray-100 dark:bg-gray-700 sticky top-0 z-10 shadow-sm">
            <tr>
                <th className="px-3 py-2 w-10"></th>
                <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Item</th>
                <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Category</th>
                <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Status</th>
                <th className="px-3 py-2 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Price</th>
                <th className="px-3 py-2 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Stock</th>
                <th className="px-3 py-2 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Qty</th>
            </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
            {logs.map(log => {
                const disabled = !isAvailable(log);
                const selected = selectedItems.has(log.id);
                const currentQty = selected ? selectedItems.get(log.id)! : 1;
                return (
                    <tr
                        key={log.id}
                        className={`${disabled ? 'opacity-50' : ''} ${selected ? 'bg-blue-50 dark:bg-blue-900/20' : ''}`}
                    >
                        {/* Checkbox cell - clickable, but checkbox handles its own change */}
                        <td
                            className="px-3 py-2 cursor-pointer"
                            onClick={() => !disabled && handleToggleSelect(log)}
                        >
                            <input
                                type="checkbox"
                                checked={selected}
                                onChange={(e) => onCheckboxChange(log.id, e.target.checked)}
                                onClick={(e) => e.stopPropagation()}
                                disabled={disabled}
                                className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary disabled:opacity-50 pointer-events-none" // pointer-events-none so click on cell passes to td
                            />
                        </td>
                        {/* Item cell */}
                        <td
                            className="px-3 py-2 text-gray-900 dark:text-gray-100 cursor-pointer"
                            onClick={() => !disabled && handleToggleSelect(log)}
                        >
                            {log.menu_item?.name || 'Unknown'} ({log.menu_item?.code})
                        </td>
                        {/* Category cell */}
                        <td
                            className="px-3 py-2 text-gray-600 dark:text-gray-400 cursor-pointer"
                            onClick={() => !disabled && handleToggleSelect(log)}
                        >
                            {log.menu_item?.category?.name || '—'}
                        </td>
                        {/* Status cell */}
                        <td
                            className="px-3 py-2 cursor-pointer"
                            onClick={() => !disabled && handleToggleSelect(log)}
                        >
                            {getStatusBadge(log)}
                        </td>
                        {/* Price cell */}
                        <td
                            className="px-3 py-2 text-right text-gray-900 dark:text-gray-100 cursor-pointer"
                            onClick={() => !disabled && handleToggleSelect(log)}
                        >
                            ₱{Number(log.menu_item?.price || 0).toFixed(2)}
                        </td>
                        {/* Stock cell */}
                        <td
                            className="px-3 py-2 text-right text-gray-600 dark:text-gray-400 cursor-pointer"
                            onClick={() => !disabled && handleToggleSelect(log)}
                        >
                            {log.quantity_in_stock}
                        </td>
                        {/* Quantity cell - NOT clickable for selection */}
                        <td className="px-3 py-2 text-right quantity-controls" onClick={(e) => e.stopPropagation()}>
                            <div className="flex items-center justify-end gap-1">
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        if (selected && !disabled) {
                                            onQuantityChange(log.id, currentQty - 1);
                                        }
                                    }}
                                    disabled={!selected || disabled || currentQty <= 1}
                                    className="w-6 h-6 flex items-center justify-center bg-red-500 hover:bg-red-600 dark:bg-red-600 dark:hover:bg-red-700 text-white rounded text-sm font-bold disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    -
                                </button>
                                <span className="w-8 text-center text-sm font-medium text-gray-900 dark:text-gray-100">
                                        {selected ? currentQty : 1}
                                    </span>
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        if (selected && !disabled) {
                                            onQuantityChange(log.id, currentQty + 1);
                                        }
                                    }}
                                    disabled={!selected || disabled || currentQty >= log.quantity_in_stock}
                                    className="w-6 h-6 flex items-center justify-center bg-green-500 hover:bg-green-600 dark:bg-green-600 dark:hover:bg-green-700 text-white rounded text-sm font-bold disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    +
                                </button>
                            </div>
                        </td>
                    </tr>
                );
            })}
            </tbody>
        </table>
    );
}