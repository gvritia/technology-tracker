import { Link } from 'react-router-dom';
import { useState } from 'react';
import TechnologySearch from '../components/TechnologySearch';
import RoadmapImporter from '../components/RoadmapImporter';
import Modal from '../components/Modal';
import './TechnologyList.css';
import DataExporter from '../pages/DataExporter';
import DataImporter from '../pages/DataImporter';
import BulkStatusEditor from '../components/BulkStatusEditor';

function TechnologyList({ technologies, updateStatus, onImportTechnology, loading, error }) {
    const [activeFilter, setActiveFilter] = useState('all');
    const [searchResults, setSearchResults] = useState([]);
    const [isSearchActive, setIsSearchActive] = useState(false);
    const [isImportModalOpen, setIsImportModalOpen] = useState(false);
    const [activeTab, setActiveTab] = useState('list'); // 'list', 'bulk-edit', 'import-export'

    // Данные для отображения: либо результаты поиска, либо отфильтрованные технологии
    const displayTechnologies = isSearchActive ? searchResults : technologies;

    // Фильтрация технологий по статусу
    const filteredByStatus = displayTechnologies.filter(tech => {
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

    // Дополнительная фильтрация по поиску (для локального поиска)
    const filteredTechnologies = filteredByStatus.filter(tech =>
        tech.title.toLowerCase().includes((isSearchActive ? '' : '').toLowerCase()) ||
        tech.description.toLowerCase().includes((isSearchActive ? '' : '').toLowerCase())
    );

    // Обработчик поиска из API
    const handleSearch = (results) => {
        setSearchResults(results);
        setIsSearchActive(results.length > 0);
    };

    // Обработчик импорта технологии
    const handleImport = async (techData) => {
        await onImportTechnology(techData);
        setIsImportModalOpen(false);
    };

    // Обработчик массового импорта данных
    const handleBulkImport = (importedTechnologies) => {
        importedTechnologies.forEach(tech => {
            onImportTechnology(tech);
        });
    };

    const getStatusText = (status) => {
        switch (status) {
            case 'completed': return 'Изучено';
            case 'in-progress': return 'В процессе';
            case 'not-started': return 'Не начато';
            default: return status;
        }
    };

    return (
        <div className="page">
            <div className="page-header">
                <Link to="/" className="back-link">← Назад на главную</Link>
                <h1>Все технологии</h1>
                <div className="header-actions">
                    <button
                        onClick={() => setIsImportModalOpen(true)}
                        className="btn btn-secondary"
                    >
                        📥 Импорт из API
                    </button>
                    <Link to="/add-technology" className="btn btn-primary">
                        + Добавить технологию
                    </Link>
                </div>
            </div>

            {/* Табы для переключения между режимами */}
            <div className="technology-tabs">
                <button
                    className={`tab-button ${activeTab === 'list' ? 'active' : ''}`}
                    onClick={() => setActiveTab('list')}
                >
                    📋 Список технологий
                </button>
                <button
                    className={`tab-button ${activeTab === 'bulk-edit' ? 'active' : ''}`}
                    onClick={() => setActiveTab('bulk-edit')}
                >
                    ⚡ Массовое редактирование
                </button>
                <button
                    className={`tab-button ${activeTab === 'import-export' ? 'active' : ''}`}
                    onClick={() => setActiveTab('import-export')}
                >
                    📁 Импорт/Экспорт
                </button>
            </div>

            {/* Режим: Список технологий */}
            {activeTab === 'list' && (
                <>
                    {/* Компонент поиска с debounce */}
                    <TechnologySearch
                        onSearch={handleSearch}
                        placeholder="Поиск технологий в базе знаний..."
                    />

                    {/* Статус загрузки и ошибки */}
                    {loading && (
                        <div className="loading-state">
                            <div className="spinner"></div>
                            <p>Загрузка данных...</p>
                        </div>
                    )}

                    {error && (
                        <div className="error-state">
                            <p>⚠️ {error}</p>
                        </div>
                    )}

                    <div className="filter-tabs">
                        <h3>Фильтр по статусу</h3>
                        <div className="filter-tabs__container">
                            <button
                                className={`filter-tabs__tab ${activeFilter === 'all' ? 'filter-tabs__tab--active' : ''}`}
                                onClick={() => setActiveFilter('all')}
                            >
                                Все ({technologies.length})
                            </button>
                            <button
                                className={`filter-tabs__tab ${activeFilter === 'not-started' ? 'filter-tabs__tab--active' : ''}`}
                                onClick={() => setActiveFilter('not-started')}
                            >
                                Не начаты ({technologies.filter(t => t.status === 'not-started').length})
                            </button>
                            <button
                                className={`filter-tabs__tab ${activeFilter === 'in-progress' ? 'filter-tabs__tab--active' : ''}`}
                                onClick={() => setActiveFilter('in-progress')}
                            >
                                В процессе ({technologies.filter(t => t.status === 'in-progress').length})
                            </button>
                            <button
                                className={`filter-tabs__tab ${activeFilter === 'completed' ? 'filter-tabs__tab--active' : ''}`}
                                onClick={() => setActiveFilter('completed')}
                            >
                                Выполнены ({technologies.filter(t => t.status === 'completed').length})
                            </button>
                        </div>
                    </div>

                    {/* Информация о поиске */}
                    {isSearchActive && (
                        <div className="search-info">
                            <p>
                                🔍 Найдено технологий: <strong>{searchResults.length}</strong>
                                <button
                                    onClick={() => {
                                        setSearchResults([]);
                                        setIsSearchActive(false);
                                    }}
                                    className="clear-search-btn"
                                >
                                    Очистить поиск
                                </button>
                            </p>
                        </div>
                    )}

                    <div className="technologies-grid">
                        {filteredTechnologies.map(tech => (
                            <div key={tech.id} className="technology-item">
                                <h3>{tech.title}</h3>
                                <p>{tech.description}</p>

                                {/* Дополнительная информация из API */}
                                {tech.difficulty && (
                                    <div className="tech-meta">
                                        <span className={`difficulty difficulty-${tech.difficulty}`}>
                                            Сложность: {tech.difficulty === 'beginner' ? 'Начальная' :
                                            tech.difficulty === 'intermediate' ? 'Средняя' : 'Продвинутая'}
                                        </span>
                                    </div>
                                )}

                                {tech.resources && tech.resources.length > 0 && (
                                    <div className="tech-resources">
                                        <strong>Ресурсы:</strong>
                                        <ul>
                                            {tech.resources.slice(0, 2).map((resource, index) => (
                                                <li key={index}>
                                                    <a href={resource} target="_blank" rel="noopener noreferrer">
                                                        {new URL(resource).hostname}
                                                    </a>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                )}

                                <div className="technology-meta">
                                    <span className={`status status-${tech.status}`}>
                                        {getStatusText(tech.status)}
                                    </span>
                                    <Link to={`/technology/${tech.id}`} className="btn-link">
                                        Подробнее →
                                    </Link>
                                </div>
                            </div>
                        ))}
                    </div>

                    {filteredTechnologies.length === 0 && !loading && (
                        <div className="empty-state">
                            {isSearchActive ? (
                                <>
                                    <p>По вашему запросу ничего не найдено.</p>
                                    <button
                                        onClick={() => {
                                            setSearchResults([]);
                                            setIsSearchActive(false);
                                        }}
                                        className="btn btn-primary"
                                    >
                                        Показать все технологии
                                    </button>
                                </>
                            ) : (
                                <>
                                    <p>Технологий не найдено.</p>
                                    <Link to="/add-technology" className="btn btn-primary">
                                        Добавить первую технологию
                                    </Link>
                                </>
                            )}
                        </div>
                    )}
                </>
            )}

            {/* Режим: Массовое редактирование */}
            {activeTab === 'bulk-edit' && (
                <BulkStatusEditor
                    technologies={technologies}
                    onStatusUpdate={updateStatus}
                />
            )}

            {/* Режим: Импорт/Экспорт */}
            {activeTab === 'import-export' && (
                <div className="import-export-section">
                    <DataImporter onImport={handleBulkImport} />
                    <DataExporter technologies={technologies} />
                </div>
            )}

            {/* Модальное окно импорта из API */}
            <Modal
                isOpen={isImportModalOpen}
                onClose={() => setIsImportModalOpen(false)}
                title="Импорт технологий из API"
            >
                <RoadmapImporter onImport={handleImport} />
            </Modal>
        </div>
    );
}

export default TechnologyList;