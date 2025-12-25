import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom'; // Assuming we might add router later, but for now App.jsx handles view switching manually. 
// Actually, App.jsx uses manual state routing ('daily', 'monthly', etc.). 
// We should probably just render this as a "View" or overlay.
// Let's make it a component we can render in the main layout.

const Login = ({ onLoginSuccess }) => {
    const { loginWithGoogle } = useAuth();
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleLogin = async () => {
        try {
            setError('');
            setLoading(true);
            await loginWithGoogle();
            if (onLoginSuccess) onLoginSuccess();
        } catch (err) {
            console.error("Login failed", err);
            setError('Failed to sign in. Check your formatting or connection.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{
            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
            height: '100%', padding: '20px', textAlign: 'center', color: '#374151'
        }}>
            <div style={{
                background: 'white', padding: '40px', borderRadius: '16px',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
                maxWidth: '400px', width: '100%'
            }}>
                <h1 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '8px', color: '#111827' }}>Welcome Back</h1>
                <p style={{ color: '#6b7280', marginBottom: '32px' }}>Sign in to sync your tasks across devices.</p>

                {error && <div style={{ color: '#ef4444', marginBottom: '16px', fontSize: '14px' }}>{error}</div>}

                <button
                    onClick={handleLogin}
                    disabled={loading}
                    style={{
                        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px',
                        width: '100%', padding: '12px', background: '#4285F4', color: 'white',
                        border: 'none', borderRadius: '8px', fontSize: '16px', fontWeight: '500',
                        cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.7 : 1
                    }}
                >
                    <svg width="18" height="18" viewBox="0 0 18 18">
                        <path fill="currentColor" d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.874 2.684-6.615z"></path>
                        <path fill="currentColor" d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.715H.957v2.332A8.997 8.997 0 0 0 9 18z"></path>
                        <path fill="currentColor" d="M3.964 10.71A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 0 0 0 9c0 1.452.448 2.797 1.237 3.917l2.727-2.208z"></path>
                        <path fill="currentColor" d="M9 3.58c1.321 0 2.508.455 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.958L3.964 7.272C4.672 5.141 6.656 3.58 9 3.58z"></path>
                    </svg>
                    {loading ? 'Signing in...' : 'Sign in with Google'}
                </button>

                <p style={{ marginTop: '24px', fontSize: '12px', color: '#9ca3af' }}>
                    Don't have an account? No problem, one will be created automatically.
                </p>
            </div>
        </div>
    );
};

export default Login;
