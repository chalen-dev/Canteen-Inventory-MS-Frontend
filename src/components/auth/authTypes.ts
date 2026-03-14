
export interface User {
    id: number;
    name: string;
    email: string;
    role: 'admin' | 'cashier' | 'customer';

}

export interface LoginCredentials {
    name: string;
    password: string;
}

export interface LoginResponse {
    access_token: string;
    token_type: string;

}