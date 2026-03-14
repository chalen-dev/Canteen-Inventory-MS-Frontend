import type {InventoryLog} from "./inventoryTypes.ts";

export function getEffectiveStatus(log: InventoryLog): string {
    // Expired takes precedence (based on expiry date)
    if (log.expiry_date && new Date(log.expiry_date) < new Date()) {
        return 'expired';
    }
    // Out of stock
    if (log.quantity_in_stock <= 0) {
        return 'out_of_stock';
    }
    // Low stock (≤ 10)
    if (log.quantity_in_stock <= 10) {
        return 'low_stock';
    }
    return 'in_stock';
}