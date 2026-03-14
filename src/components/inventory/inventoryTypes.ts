import type { Category } from "../menu/menuTypes.ts";

export interface MenuItem {
    id: number;
    name: string;
    code: string | null;
    price: number;
    category_id: number;
    photo_path: string | null;
    description: string | null;
    image_url: string | null;
    category?: Category;
}

export interface InventoryLog {
    id: number;
    item_id: number;
    quantity_in_stock: number;
    date_acquired: string | null;
    expiry_date: string | null;
    is_available: boolean;
    is_archived: boolean;
    inventory_status: string | null;
    description: string | null;
    created_at?: string;
    updated_at?: string;
    menu_item?: MenuItem;
}

export const InventoryStatus = {
    IN_STOCK: 'in_stock',
    LOW_STOCK: 'low_stock',
    OUT_OF_STOCK: 'out_of_stock',
    EXPIRED: 'expired',
} as const;

export type InventoryStatus = typeof InventoryStatus[keyof typeof InventoryStatus];

// ========== Shared types for filters and search ==========

export type SortField = 'name' | 'quantity' | 'date_acquired' | 'expiry_date';
export type SortOrder = 'asc' | 'desc';
export type AvailabilityFilter = 'all' | 'available' | 'unavailable';
export type ArchiveFilter = 'unarchived' | 'archived' | 'all';

export const STATUS_OPTIONS = [
    { value: 'in_stock', label: 'In Stock' },
    { value: 'low_stock', label: 'Low Stock' },
    { value: 'out_of_stock', label: 'Out of Stock' },
    { value: 'expired', label: 'Expired' },
] as const;