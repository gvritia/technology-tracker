import { Link } from 'react-router-dom';
import { useState } from 'react';
import './TechnologyList.css';

function TechnologyList({ technologies, updateStatus }) {
    const [activeFilter, setActiveFilter] = useState('all');
    const [searchQuery, setSearchQuery] = useState('');

    // Фильтрация технологий
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

    const filteredTechnologies = filteredByStatus.filter(tech =>
        tech.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tech.description.toLowerCase().includes(searchQuery.toLowerCase())
    );

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
                <Link to="/add-technology" className="btn btn-primary">
                    + Добавить технологию
                </Link>
            </div>

            <div className="search-box">
                <input
                    type="text"
                    placeholder="Поиск технологий..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
                <span>Найдено: {filteredTechnologies.length}</span>
            </div>

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

            <div className="technologies-grid">
                {filteredTechnologies.map(tech => (
                    <div key={tech.id} className="technology-item">
                        <h3>{tech.title}</h3>
                        <p>{tech.description}</p>
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

            {filteredTechnologies.length === 0 && (
                <div className="empty-state">
                    <p>Технологий не найдено.</p>
                    <Link to="/add-technology" className="btn btn-primary">
                        Добавить первую технологию
                    </Link>
                </div>
            )}
        </div>
    );
}

export default TechnologyList;