// pages/orders/OrdersList.tsx
import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import api from '../../services/api';
import { useHeaderTitle } from '../../contexts/HeaderTitleContext';
import { FetchingDetails } from '../common/loading/FetchingDetails';
import { Pagination } from '../common/Pagination';
import type {Order} from "./orderTypes.ts";
import {OrderCard} from "./partials/OrderCard.tsx";

export function OrdersList() {
    const { setTitle } = useHeaderTitle();

    const {
        data: orders = [],
        isLoading,
        error: queryError
    } = useQuery({
        queryKey: ['orders'],
        queryFn: async () => {
            const response = await api.get<Order[]>('/orders');
            return response.data;
        },
    });

    // Client‑side pagination (we can replace with server‑side later if needed)
    const [page, setPage] = useState(1);
    const perPage = 10;

    useEffect(() => {
        setTitle('Orders');
    }, [setTitle]);

    // Paginated items
    const totalPages = Math.ceil(orders.length / perPage);
    const paginatedOrders = orders.slice((page - 1) * perPage, page * perPage);

    const goToPage = (newPage: number) => setPage(newPage);

    // Placeholder handlers – will be replaced with real mutations later
    const handleDelete = (id: number) => {
        console.log('Delete order', id);
    };
    const handleEdit = (order: Order) => {
        console.log('Edit order', order);
    };
    const handleView = (id: number) => {
        console.log('View order', id);
    };

    if (isLoading) return <FetchingDetails />;
    if (queryError) return <div className="p-4 text-red-600 dark:text-red-400">Error: {(queryError as Error).message}</div>;

    return (
        <div className="orders-list-container">
            <div className="cards-grid" style={{ display: 'flex', flexWrap: 'wrap', gap: '0.1rem' }}>
                {paginatedOrders.map(order => (
                    <OrderCard
                        key={order.id}
                        order={order}
                        onDelete={handleDelete}
                        onEdit={handleEdit}
                        onView={handleView}
                    />
                ))}
                {orders.length === 0 && (
                    <div className="w-full text-center py-8 text-gray-500 dark:text-gray-400">
                        No orders found.
                    </div>
                )}
            </div>

            {totalPages > 1 && (
                <Pagination
                    currentPage={page}
                    totalPages={totalPages}
                    onPageChange={goToPage}
                    disabled={isLoading}
                />
            )}
        </div>
    );
}