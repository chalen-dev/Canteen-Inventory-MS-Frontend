import type { OrderItem } from "../orderTypes";

interface OrderItemsTableProps {
    items: OrderItem[];
}

export function OrderItemsTable({ items }: OrderItemsTableProps) {
    if (!items || items.length === 0) {
        return (
            <div className="text-center py-4 text-gray-500 dark:text-gray-400">
                No items in this order.
            </div>
        );
    }

    return (
        <div className="mt-3 border-t border-gray-200 dark:border-gray-700 pt-3">
            <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Order Items</h4>
            <div className="overflow-x-auto">
                <table className="min-w-full text-sm">
                    <thead className="bg-gray-50 dark:bg-gray-700/50">
                    <tr>
                        <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">ID</th>
                        <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Inv ID</th>
                        <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Item</th>
                        <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Category</th>
                        <th className="px-3 py-2 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Qty</th>
                        <th className="px-3 py-2 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Unit Price</th>
                        <th className="px-3 py-2 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Amount</th>
                    </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                    {items.map((item) => {
                        const menuItem = item.inventory_log?.menu_item;
                        const menuItemName = menuItem?.name || 'Unknown Item';
                        const categoryName = menuItem?.category?.name || '—';
                        const unitPrice = item.amount / item.quantity;
                        return (
                            <tr key={item.id}>
                                <td className="px-3 py-2 text-gray-500 dark:text-gray-400 font-mono">
                                    #{item.id}
                                </td>
                                <td className="px-3 py-2 text-gray-500 dark:text-gray-400 font-mono">
                                    {item.inventory_id}
                                </td>
                                <td className="px-3 py-2 text-gray-900 dark:text-gray-100">
                                    {menuItemName}
                                </td>
                                <td className="px-3 py-2 text-gray-600 dark:text-gray-400">
                                    {categoryName}
                                </td>
                                <td className="px-3 py-2 text-right text-gray-600 dark:text-gray-400">
                                    {item.quantity}
                                </td>
                                <td className="px-3 py-2 text-right text-gray-600 dark:text-gray-400">
                                    ₱{unitPrice.toFixed(2)}
                                </td>
                                <td className="px-3 py-2 text-right font-medium text-gray-900 dark:text-gray-100">
                                    ₱{Number(item.amount).toFixed(2)}
                                </td>
                            </tr>
                        );
                    })}
                    </tbody>
                </table>
            </div>
        </div>
    );
}