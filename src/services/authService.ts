import api from './api';
import type {LoginCredentials, LoginResponse, User} from '../components/auth/authTypes.ts';

export const login = async (credentials: LoginCredentials): Promise<LoginResponse> => {
    const response = await api.post<LoginResponse>('/login', credentials);
    return response.data;
};

export const getCurrentUser = async (): Promise<User> => {
    const response = await api.get<User>('/user');
    return response.data;
};

export const logout = async (): Promise<void> => {
    await api.post('/logout');
};