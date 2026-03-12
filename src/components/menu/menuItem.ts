export interface MenuItem {
    id: number;
    name: string;
    price: string | number;
    category?: {
        id: number;
        name: string;
    } | null;
}