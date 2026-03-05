import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { Text } from "../../components/input/Text";
import "./Login.css";
import {Header} from "../../components/partials/Header.tsx";

export function Login() {
    const navigate = useNavigate();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    return (
        <>
            <Header />
            <h1>Login</h1>
            <Text
                name="username"
                value={username}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setUsername(e.target.value)}
                label="Username"
            />
            <Text
                name="password"
                value={password}
                onChange={(e: React.ChangeEvent<HTMLInputElement>)=> setPassword(e.target.value)}
                label="Password"
            />
            <button onClick={() => navigate('/dashboard')}>Sign In</button>
        </>
    );
}