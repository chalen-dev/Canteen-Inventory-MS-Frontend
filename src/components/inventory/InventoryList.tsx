// InventoryList.tsx
import { useState, useEffect } from 'react';
import api from '../../services/api';
import axios from 'axios';
import { useHeaderTitle } from "../../contexts/HeaderTitleContext.tsx";
import { InventoryCard } from "./partials/InventoryCard";
import { FetchingDetails } from "../common/loading/FetchingDetails";
import { showToast } from '../../utils/swalHelpers';
import type { InventoryLog } from "./inventoryTypes.ts";

export function InventoryList() {
    const { setTitle } = useHeaderTitle();

    const [inventoryLogs, setInventoryLogs] = useState<InventoryLog[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        setTitle('Inventory List');
    }, [setTitle]);

    useEffect(() => {
        fetchInventoryLogs();
    }, []);

    const fetchInventoryLogs = async () => {
        try {
            setLoading(true);
            const response = await api.get<InventoryLog[]>('/inventory-logs');
            setInventoryLogs(response.data);
        } catch (err) {
            if (axios.isAxiosError(err)) {
                setError(err.response?.data?.message || err.message || 'Failed to fetch inventory logs');
            } else if (err instanceof Error) {
                setError(err.message);
            } else {
                setError('An unknown error occurred');
            }
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: number) => {
        showToast(`Delete log ${id} – not implemented yet`, 'info');
    };

    const handleEdit = (log: InventoryLog) => {
        showToast(`Edit log ${log.id} – not implemented yet`, 'info');
    };

    const handleView = (id: number) => {
        showToast(`View log ${id} – not implemented yet`, 'info');
    };

    if (loading && inventoryLogs.length === 0) {
        return <FetchingDetails />;
    }

    if (error) {
        return <div className="p-4 text-red-600 dark:text-red-400">Error: {error}</div>;
    }

    return (
        <div className="inventory-list-container">
            {/* Header row (only shown when there are items) */}
            {inventoryLogs.length > 0 && (
                <div className="flex items-center w-full p-4 mb-2 border rounded-lg bg-gray-50 dark:bg-gray-700 text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                    <div className="w-16">ID</div>
                    <div className="flex-1">Item</div>
                    <div className="w-20 text-center">Qty</div>
                    <div className="w-28 text-center">Acquired</div>
                    <div className="w-28 text-center">Expires</div>
                    <div className="w-24 text-center">Status</div>
                    <div className="w-32 text-right">Actions</div>
                </div>
            )}

            {/* Inventory logs grid */}
            <div className="cards-grid" style={{ display: 'flex', flexWrap: 'wrap', gap: '0.1rem' }}>
                {inventoryLogs.map(log => (
                    <InventoryCard
                        key={log.id}
                        log={log}
                        onDelete={handleDelete}
                        onEdit={handleEdit}
                        onView={handleView}
                    />
                ))}
                {inventoryLogs.length === 0 && !loading && (
                    <div className="w-full text-center py-8 text-gray-500 dark:text-gray-400">
                        No inventory records found.
                    </div>
                )}
            </div>
        </div>
    );
}