import React, { createContext, useContext, useState, useCallback } from 'react';
import { Snackbar, Alert } from '@mui/material';
import useLocalStorage from '../hooks/useLocalStorage';

// Создаем контекст
const AppContext = createContext();

// Провайдер приложения
export function AppProvider({ children }) {
    const [themeMode, setThemeMode] = useLocalStorage('themeMode', 'light');
    const [snackbar, setSnackbar] = useState({
        open: false,
        message: '',
        severity: 'success', // 'success', 'error', 'warning', 'info'
    });

    // Функция для показа уведомлений
    const showSnackbar = useCallback((message, severity = 'success') => {
        setSnackbar({
            open: true,
            message,
            severity,
        });
    }, []);

    // Функция для скрытия уведомлений
    const hideSnackbar = useCallback(() => {
        setSnackbar(prev => ({ ...prev, open: false }));
    }, []);

    // Функция переключения темы
    const toggleTheme = useCallback(() => {
        setThemeMode(prev => prev === 'light' ? 'dark' : 'light');
    }, [setThemeMode]);

    const value = {
        themeMode,
        toggleTheme,
        showSnackbar,
        hideSnackbar,
    };

    return (
        <AppContext.Provider value={value}>
            {children}
            {/* Глобальный Snackbar */}
            <Snackbar
                open={snackbar.open}
                autoHideDuration={4000}
                onClose={hideSnackbar}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
            >
                <Alert
                    onClose={hideSnackbar}
                    severity={snackbar.severity}
                    variant="filled"
                    sx={{ width: '100%' }}
                >
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </AppContext.Provider>
    );
}

// Хук для использования контекста
export function useApp() {
    const context = useContext(AppContext);
    if (!context) {
        throw new Error('useApp must be used within an AppProvider');
    }
    return context;
}

// Экспортируем контекст для использования в классовых компонентах
export default AppContext;