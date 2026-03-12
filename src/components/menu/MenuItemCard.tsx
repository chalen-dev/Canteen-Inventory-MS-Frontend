//MENUITEMCARD.TSX

import type {MenuItem} from "./menuItem.ts";

interface MenuItemCardProps {
    item: MenuItem;
    onDelete: (id: number) => void;
}

export function MenuItemCard({ item, onDelete }: MenuItemCardProps) {
    return (
        <div className="flex items-center w-full p-4 border rounded-lg shadow-sm hover:shadow-md transition-shadow bg-white dark:bg-gray-800">
            {/* ID column */}
            <div className="w-16 text-gray-500 dark:text-gray-400 font-mono">
                #{item.id}
            </div>

            {/* Name column */}
            <div className="flex-1 font-medium text-gray-900 dark:text-gray-100">
                {item.name}
            </div>

            {/* Category column */}
            <div className="w-32 text-gray-600 dark:text-gray-300">
                {item.category?.name || 'Uncategorized'}
            </div>

            {/* Price column */}
            <div className="w-24 text-gray-900 dark:text-gray-100 font-semibold">
                ₱{Number(item.price).toFixed(2)}
            </div>

            {/* Actions column */}
            <div className="w-32 flex gap-2 justify-end">
                <button
                    onClick={() => alert(`Edit item ${item.id}`)}
                    className="px-3 py-1 text-sm bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
                >
                    Edit
                </button>
                <button
                    onClick={() => onDelete(item.id)}
                    className="px-3 py-1 text-sm bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
                >
                    Delete
                </button>
            </div>
        </div>
    );
}