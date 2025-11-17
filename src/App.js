import React, { useState, useEffect } from 'react';
import './App.css';
import TechnologyCard from './components/TechnologyCard';
import ProgressHeader from './components/ProgressHeader';
import QuickActions from './components/QuickActions';
import FilterTabs from './components/FilterTabs';
import TechnologyNotes from './components/TechnologyNotes';

function App() {
    // Начальное состояние технологий
    const initialTechnologies = [
        {
            id: 1,
            title: 'React Components',
            description: 'Изучение базовых компонентов и их жизненного цикла',
            status: 'completed',
            notes: ''
        },
        {
            id: 2,
            title: 'JSX Syntax',
            description: 'Освоение синтаксиса JSX и его особенностей',
            status: 'in-progress',
            notes: ''
        },
        {
            id: 3,
            title: 'State Management',
            description: 'Работа с состоянием компонентов и подъем состояния',
            status: 'not-started',
            notes: ''
        },
        {
            id: 4,
            title: 'React Hooks',
            description: 'Изучение основных хуков: useState, useEffect, useContext',
            status: 'not-started',
            notes: ''
        },
        {
            id: 5,
            title: 'React Router',
            description: 'Настройка маршрутизации в React приложениях',
            status: 'in-progress',
            notes: ''
        }
    ];

    const [technologies, setTechnologies] = useState(initialTechnologies);
    const [activeFilter, setActiveFilter] = useState('all');
    const [searchQuery, setSearchQuery] = useState('');
    const [isLoaded, setIsLoaded] = useState(false); // Флаг загрузки

    // Загрузка из localStorage при первом рендере
    useEffect(() => {
        const saved = localStorage.getItem('techTrackerData');
        console.log('Загрузка из localStorage:', saved);

        if (saved) {
            try {
                const parsedData = JSON.parse(saved);
                setTechnologies(parsedData);
                console.log('Данные загружены из localStorage:', parsedData);
            } catch (error) {
                console.error('Ошибка загрузки из localStorage:', error);
                // Если ошибка парсинга, используем начальные данные
                setTechnologies(initialTechnologies);
            }
        } else {
            console.log('Нет сохраненных данных в localStorage, используем начальные');
            setTechnologies(initialTechnologies);
        }
        setIsLoaded(true);
    }, []); // Пустой массив зависимостей - только при монтировании

    // Автосохранение в localStorage при изменении technologies
    useEffect(() => {
        if (isLoaded) { // Сохраняем только после загрузки
            localStorage.setItem('techTrackerData', JSON.stringify(technologies));
            console.log('Данные сохранены в localStorage:', technologies);
        }
    }, [technologies, isLoaded]);

    // Функция изменения статуса технологии
    const updateTechnologyStatus = (id) => {
        setTechnologies(prevTech => prevTech.map(tech => {
            if (tech.id === id) {
                const statusOrder = ['not-started', 'in-progress', 'completed'];
                const currentIndex = statusOrder.indexOf(tech.status);
                const nextIndex = (currentIndex + 1) % statusOrder.length;
                return { ...tech, status: statusOrder[nextIndex] };
            }
            return tech;
        }));
    };

    // Функция обновления заметок
    const updateTechnologyNotes = (techId, newNotes) => {
        console.log('Обновление заметок:', techId, newNotes);
        setTechnologies(prevTech =>
            prevTech.map(tech =>
                tech.id === techId ? { ...tech, notes: newNotes } : tech
            )
        );
    };

    // Функции быстрых действий
    const markAllAsCompleted = () => {
        setTechnologies(prevTech => prevTech.map(tech => ({
            ...tech,
            status: 'completed'
        })));
    };

    const resetAllStatuses = () => {
        setTechnologies(prevTech => prevTech.map(tech => ({
            ...tech,
            status: 'not-started'
        })));
    };

    const randomNextTechnology = () => {
        const notStartedTech = technologies.filter(tech => tech.status === 'not-started');
        if (notStartedTech.length > 0) {
            const randomTech = notStartedTech[Math.floor(Math.random() * notStartedTech.length)];
            updateTechnologyStatus(randomTech.id);
        } else {
            alert('Все технологии уже начаты или завершены!');
        }
    };

    // Фильтрация технологий по статусу
    const filteredByStatus = technologies.filter(tech => {
        switch (activeFilter) {
            case 'not-started':
                return tech.status === 'not-started';
            case 'in-progress':
                return tech.status === 'in-progress';
            case 'completed':
                return tech.status === 'completed';
            default:
                return true;
        }
    });

    // Фильтрация по поисковому запросу
    const filteredTechnologies = filteredByStatus.filter(tech =>
        tech.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tech.description.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="App">
            <header className="App-header">
                <h1>Трекер изучения технологий</h1>
                <ProgressHeader technologies={technologies} />
            </header>
            <main className="App-main">
                <QuickActions
                    onMarkAllCompleted={markAllAsCompleted}
                    onResetAll={resetAllStatuses}
                    onRandomNext={randomNextTechnology}
                />

                {/* Поле поиска */}
                <div className="search-box">
                    <input
                        type="text"
                        placeholder="Поиск технологий..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                    <span>Найдено: {filteredTechnologies.length}</span>
                </div>

                <FilterTabs
                    activeFilter={activeFilter}
                    onFilterChange={setActiveFilter}
                    technologies={technologies}
                />

                {isLoaded ? (
                    <div className="technologies-grid">
                        {filteredTechnologies.map(tech => (
                            <div key={tech.id} className="technology-item">
                                <TechnologyCard
                                    id={tech.id}
                                    title={tech.title}
                                    description={tech.description}
                                    status={tech.status}
                                    onStatusChange={updateTechnologyStatus}
                                />
                                <TechnologyNotes
                                    notes={tech.notes}
                                    onNotesChange={updateTechnologyNotes}
                                    techId={tech.id}
                                />
                            </div>
                        ))}
                    </div>
                ) : (
                    <div>Загрузка...</div>
                )}
            </main>
        </div>
    );
}

export default App;