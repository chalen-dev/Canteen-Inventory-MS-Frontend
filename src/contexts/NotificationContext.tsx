// contexts/NotificationContext.tsx
import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import { useAuth } from './AuthContext';

export interface Notification {
    id: string | number;
    title: string;
    message: string;
    read: boolean;
    createdAt: string;
    link?: string;
}

interface NotificationContextType {
    notifications: Notification[];
    unreadCount: number;
    markAsRead: (id: string | number) => void;
    markAllAsRead: () => void;
    addNotification: (notification: Omit<Notification, 'id' | 'read' | 'createdAt'>) => void;
    fetchNotifications: () => Promise<void>;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const NotificationProvider = ({ children }: { children: ReactNode }) => {
    const { user } = useAuth();
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [unreadCount, setUnreadCount] = useState(0);

    // Update unread count whenever notifications change
    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setUnreadCount(notifications.filter(n => !n.read).length);
    }, [notifications]);

    // Mock fetching – replace with real API call
    const fetchNotifications = async () => {
        if (!user) return;
        // Simulate API call
        const mock: Notification[] = [
            { id: 1, title: 'Order Confirmed', message: 'Your order #123 has been confirmed.', read: false, createdAt: new Date().toISOString() },
            { id: 2, title: 'Order Ready', message: 'Your order #124 is ready for pickup.', read: true, createdAt: new Date().toISOString() },
        ];
        setNotifications(mock);
    };

    // Load notifications on login
    useEffect(() => {
        if (user) {
            // eslint-disable-next-line react-hooks/set-state-in-effect
            fetchNotifications();
        } else {
            setNotifications([]);
        }
    }, [user]);

    const markAsRead = (id: string | number) => {
        setNotifications(prev =>
            prev.map(n => (n.id === id ? { ...n, read: true } : n))
        );
    };

    const markAllAsRead = () => {
        setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    };

    const addNotification = (notification: Omit<Notification, 'id' | 'read' | 'createdAt'>) => {
        const newNotification: Notification = {
            id: Date.now(),
            read: false,
            createdAt: new Date().toISOString(),
            ...notification,
        };
        setNotifications(prev => [newNotification, ...prev]);
    };

    return (
        <NotificationContext.Provider value={{
            notifications,
            unreadCount,
            markAsRead,
            markAllAsRead,
            addNotification,
            fetchNotifications,
        }}>
            {children}
        </NotificationContext.Provider>
    );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useNotifications = () => {
    const context = useContext(NotificationContext);
    if (!context) {
        throw new Error('useNotifications must be used within NotificationProvider');
    }
    return context;
};