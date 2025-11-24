import { useEffect } from 'react';
import { useApp } from '../contexts/AppContext';

// Хук для применения темы к body элементу
export function useThemeEffect() {
    const { themeMode } = useApp();

    useEffect(() => {
        // Устанавливаем data-theme атрибут для body
        document.body.setAttribute('data-theme', themeMode);

        // Также устанавливаем класс для совместимости со старыми стилями
        document.body.className = `theme-${themeMode}`;

        // Обновляем meta theme-color для мобильных браузеров
        const metaThemeColor = document.querySelector('meta[name="theme-color"]');
        if (metaThemeColor) {
            metaThemeColor.setAttribute('content', themeMode === 'dark' ? '#121212' : '#1976d2');
        }
    }, [themeMode]);
}

export default useThemeEffect;