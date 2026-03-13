// inventoryTypes.ts

export interface Category {
    id: number;
    name: string;
    description?: string | null;
}

export interface MenuItem {
    id: number;
    name: string;
    code: string | null;
    price: number;
    category_id: number;
    photo_path: string | null;
    description: string | null;
    image_url: string | null;          // accessor from model
    category?: Category;                // when loaded
}

export interface InventoryLog {
    id: number;
    item_id: number;                    // foreign key to menu item
    quantity_in_stock: number;
    date_acquired: string | null;       // API returns dates as strings (ISO format)
    expiry_date: string | null;
    is_available: boolean;
    inventory_status: string | null;     // e.g., 'expired', 'low_stock', etc.
    description: string | null;
    created_at?: string;
    updated_at?: string;
    // eager loaded relation
    menu_item?: MenuItem;                // when loaded via with('menuItem')
}