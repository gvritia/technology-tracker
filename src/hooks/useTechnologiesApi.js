import { useState, useEffect, useCallback } from 'react';
import useLocalStorage from './useLocalStorage';

const initialTechnologies = [
    {
        id: 1,
        title: 'React Components',
        description: 'Изучение базовых компонентов и их жизненного цикла',
        status: 'completed',
        notes: '',
        category: 'frontend'
    },
    {
        id: 2,
        title: 'JSX Syntax',
        description: 'Освоение синтаксиса JSX и его особенностей',
        status: 'in-progress',
        notes: '',
        category: 'frontend'
    },
    {
        id: 3,
        title: 'State Management',
        description: 'Работа с состоянием компонентов и подъем состояния',
        status: 'not-started',
        notes: '',
        category: 'frontend'
    },
    {
        id: 4,
        title: 'React Hooks',
        description: 'Изучение основных хуков: useState, useEffect, useContext',
        status: 'not-started',
        notes: '',
        category: 'frontend'
    },
    {
        id: 5,
        title: 'React Router',
        description: 'Настройка маршрутизации в React приложениях',
        status: 'in-progress',
        notes: '',
        category: 'frontend'
    },
    {
        id: 6,
        title: 'Node.js Basics',
        description: 'Основы серверного JavaScript',
        status: 'not-started',
        notes: '',
        category: 'backend'
    }
];

function useTechnologiesApi() {
    const [technologies, setTechnologies] = useLocalStorage('technologies', initialTechnologies);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [apiData, setApiData] = useState([]);

    // Загрузка технологий из API (имитация)
    const fetchTechnologiesFromApi = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);

            // Имитация API запроса
            await new Promise(resolve => setTimeout(resolve, 1000));

            // Мок данные - в реальном приложении замените на реальный API
            const mockApiTechnologies = [
                {
                    id: 100,
                    title: 'React',
                    description: 'Библиотека для создания пользовательских интерфейсов',
                    category: 'frontend',
                    difficulty: 'beginner',
                    resources: ['https://react.dev', 'https://ru.reactjs.org']
                },
                {
                    id: 101,
                    title: 'Node.js',
                    description: 'Среда выполнения JavaScript на сервере',
                    category: 'backend',
                    difficulty: 'intermediate',
                    resources: ['https://nodejs.org', 'https://nodejs.org/ru/docs/']
                },
                {
                    id: 102,
                    title: 'TypeScript',
                    description: 'Типизированное надмножество JavaScript',
                    category: 'language',
                    difficulty: 'intermediate',
                    resources: ['https://www.typescriptlang.org']
                }
            ];

            setApiData(mockApiTechnologies);
            return mockApiTechnologies;

        } catch (err) {
            setError('Не удалось загрузить технологии из API');
            console.error('Ошибка загрузки из API:', err);
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    // Импорт технологий из API в локальное хранилище
    const importFromApi = useCallback(async (techData) => {
        try {
            setLoading(true);

            const newTech = {
                id: Date.now(),
                ...techData,
                status: 'not-started',
                notes: '',
                createdAt: new Date().toISOString()
            };

            setTechnologies(prev => [...prev, newTech]);
            return newTech;

        } catch (err) {
            setError('Не удалось импортировать технологию');
            throw err;
        } finally {
            setLoading(false);
        }
    }, [setTechnologies]);

    // Импорт всей дорожной карты
    const importRoadmap = useCallback(async (roadmapUrl) => {
        try {
            setLoading(true);
            setError(null);

            // Имитация загрузки дорожной карты из API
            await new Promise(resolve => setTimeout(resolve, 1500));

            // Мок данные дорожной карты
            const roadmapData = {
                technologies: [
                    {
                        title: 'JavaScript Fundamentals',
                        description: 'Основы JavaScript: переменные, функции, циклы',
                        category: 'frontend',
                        difficulty: 'beginner',
                        resources: ['https://learn.javascript.ru', 'https://developer.mozilla.org/en-US/docs/Web/JavaScript']
                    },
                    {
                        title: 'DOM Manipulation',
                        description: 'Работа с Document Object Model',
                        category: 'frontend',
                        difficulty: 'beginner',
                        resources: ['https://developer.mozilla.org/en-US/docs/Web/API/Document_Object_Model']
                    }
                ]
            };

            // Добавляем каждую технологию из дорожной карты
            const importedTechs = [];
            for (const tech of roadmapData.technologies) {
                const newTech = await importFromApi(tech);
                importedTechs.push(newTech);
            }

            return importedTechs;

        } catch (err) {
            setError(`Ошибка импорта: ${err.message}`);
            throw err;
        } finally {
            setLoading(false);
        }
    }, [importFromApi]);

    // Существующие методы из useTechnologies
    const updateStatus = useCallback((techId, newStatus) => {
        setTechnologies(prev =>
            prev.map(tech =>
                tech.id === techId ? { ...tech, status: newStatus } : tech
            )
        );
    }, [setTechnologies]);

    const updateNotes = useCallback((techId, newNotes) => {
        setTechnologies(prev =>
            prev.map(tech =>
                tech.id === techId ? { ...tech, notes: newNotes } : tech
            )
        );
    }, [setTechnologies]);

    // В методе addTechnology добавьте поддержку новых полей:
    const addTechnology = useCallback((technology) => {
        const newTechnology = {
            id: Date.now(),
            ...technology,
            status: 'not-started',
            notes: '',
            createdAt: new Date().toISOString(),
            // Добавляем новые поля по умолчанию если они не переданы
            difficulty: technology.difficulty || 'beginner',
            deadline: technology.deadline || '',
            resources: technology.resources || []
        };
        setTechnologies(prev => [...prev, newTechnology]);
    }, [setTechnologies]);

    const deleteTechnology = useCallback((id) => {
        setTechnologies(prev => prev.filter(tech => tech.id !== id));
    }, [setTechnologies]);

    const calculateProgress = useCallback(() => {
        if (!technologies || technologies.length === 0) return 0;
        const completed = technologies.filter(tech => tech.status === 'completed').length;
        return Math.round((completed / technologies.length) * 100);
    }, [technologies]);

    // Загружаем данные из API при монтировании
    useEffect(() => {
        fetchTechnologiesFromApi();
    }, [fetchTechnologiesFromApi]);

    return {
        // Данные
        technologies: technologies || [],
        apiData: apiData || [],
        loading,
        error,

        // Действия с локальными данными
        setTechnologies,
        updateStatus,
        updateNotes,
        addTechnology,
        deleteTechnology,
        progress: calculateProgress(),

        // Действия с API
        fetchTechnologiesFromApi,
        importFromApi,
        importRoadmap,
        refetch: fetchTechnologiesFromApi
    };
}

export default useTechnologiesApi;