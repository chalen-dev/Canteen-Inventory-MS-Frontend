import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import axios from 'axios';
import { Text } from '../common/input/Text';
import {Select} from "../common/input/Select.tsx";
import {Number} from "../common/input/Number.tsx";

interface Category {
    id: number;
    name: string;
}

export function MenuForm({ onItemAdded }: { onItemAdded?: () => void }) {
    const [name, setName] = useState('');
    const [price, setPrice] = useState('');
    const [categoryId, setCategoryId] = useState('');
    const [categories, setCategories] = useState<Category[]>([]);
    const [submitting, setSubmitting] = useState(false);

    // Field‑specific error messages
    const [errors, setErrors] = useState({
        name: '',
        price: '',
        category: ''
    });

    // Fetch categories on mount
    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await api.get<Category[]>('/categories');
                setCategories(response.data);
            } catch (err) {
                console.error('Failed to load categories', err);
            }
        };
        fetchCategories();
    }, []);

    // Helper to clear a field's error when user types
    const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setName(e.target.value);
        if (errors.name) setErrors(prev => ({ ...prev, name: '' }));
    };

    const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setPrice(e.target.value);
        if (errors.price) setErrors(prev => ({ ...prev, price: '' }));
    };

    const handleSubmit = async (e: React.SyntheticEvent) => {
        e.preventDefault();

        // Validate fields
        const newErrors = {
            name: name.trim() ? '' : 'Name is required',
            price: price.trim() ? '' : 'Price is required',
            category: categoryId ? '' : 'Category is required'
        };
        setErrors(newErrors);

        // If any error, stop submission
        if (newErrors.name || newErrors.price || newErrors.category) return;

        setSubmitting(true);

        try {
            await api.post('/menu-items', {
                name,
                price: parseFloat(price),
                category_id: parseInt(categoryId)
            });
            // Reset form
            setName('');
            setPrice('');
            setCategoryId('');
            setErrors({ name: '', price: '', category: '' });
            if (onItemAdded) onItemAdded();
        } catch (err) {
            let message = 'Failed to add menu item';
            if (axios.isAxiosError(err)) {
                message = err.response?.data?.message || err.message;
            } else if (err instanceof Error) {
                message = err.message;
            }
            alert(message); // or display in a toast
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 mb-6">
            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-3">Menu Items</h3>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {/* Name field */}
                <Text
                    name="name"
                    label="Name"
                    value={name}
                    onChange={handleNameChange}
                    error={errors.name}
                    required
                    className="mb-0"
                />

                {/* Price field */}
                <Number
                    label="Price"
                    name="price"
                    value={price}
                    onChange={handlePriceChange}
                    min={0}
                    step="0.01"
                    error={errors.price}
                    className="mb-0"
                />

                {/* Category */}
                <Select
                    label="Category"
                    name="categoryId"
                    value={categoryId}
                    onChange={(e) => {
                        setCategoryId(e.target.value);
                        if (errors.category) setErrors(prev => ({ ...prev, category: '' }));
                    }}
                    options={categories.map(cat => ({ value: cat.id, label: cat.name }))}
                    error={errors.category}
                    className="mb-0"
                />

                {/* Submit button */}
                <div className="flex items-end">
                    <button
                        type="submit"
                        disabled={submitting}
                        className="w-full px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                        {submitting ? 'Adding...' : 'Add Item'}
                    </button>
                </div>
            </div>
        </form>
    );
}