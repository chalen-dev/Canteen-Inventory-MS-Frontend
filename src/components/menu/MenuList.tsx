//MENULIST.TSX

import { useState, useEffect } from 'react';
import api from '../../services/api';
import axios from 'axios';
import {useHeaderTitle} from "../../contexts/HeaderTitleContext.tsx";
import {MenuItemCard} from "./MenuItemCard.tsx";
import type {MenuItem} from "./menuItem.ts";
import {FetchingDetails} from "../common/loading/FetchingDetails.tsx";
import {MenuForm} from "./MenuForm.tsx"; // needed for type guard

export function MenuList() {
    const { setTitle } = useHeaderTitle();

    const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        setTitle('Menu List');
    }, [setTitle]);

    useEffect(() => {
        fetchMenuItems();
    }, []);

    const fetchMenuItems = async () => {
        try {
            setLoading(true);
            const response = await api.get<MenuItem[]>('/menu-items');
            setMenuItems(response.data);
        } catch (err) {
            // err is unknown – extract a readable message
            if (axios.isAxiosError(err)) {
                setError(err.response?.data?.message || err.message || 'Failed to fetch menu items');
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
        if (!window.confirm('Are you sure you want to delete this item?')) return;

        try {
            await api.delete(`/menu-items/${id}`);
            setMenuItems(prev => prev.filter(item => item.id !== id));
        } catch (err) {
            let message = 'Delete failed';
            if (axios.isAxiosError(err)) {
                message = err.response?.data?.message || err.message;
            } else if (err instanceof Error) {
                message = err.message;
            }
            alert(message);
        }
    };

    if (loading) {
        return (
            <FetchingDetails />
        );
    }
    if (error) return <div>Error: {error}</div>;

    return (
        <div className="menu-list-container">
            <MenuForm />
            <div className="cards-grid" style={{ display: 'flex', flexWrap: 'wrap', gap: '0.1rem' }}>
                {menuItems.map(item => (
                    <MenuItemCard key={item.id} item={item} onDelete={handleDelete} />
                ))}
            </div>
        </div>
    );
}