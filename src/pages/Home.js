import { Link } from 'react-router-dom';
import ProgressBar from '../components/ProgressBar';
import QuickActions from '../components/QuickActions';
import './Home.css';

function Home({ technologies, progress, updateStatus }) {
    const markAllAsCompleted = () => {
        technologies.forEach(tech => {
            if (tech.status !== 'completed') {
                updateStatus(tech.id, 'completed');
            }
        });
    };

    const resetAllStatuses = () => {
        technologies.forEach(tech => {
            updateStatus(tech.id, 'not-started');
        });
    };

    const randomNextTechnology = () => {
        const notStartedTech = technologies.filter(tech => tech.status === 'not-started');
        if (notStartedTech.length > 0) {
            const randomTech = notStartedTech[Math.floor(Math.random() * notStartedTech.length)];
            updateStatus(randomTech.id, 'in-progress');
        } else {
            alert('Все технологии уже начаты или завершены!');
        }
    };

    const recentTechnologies = technologies.slice(0, 3);

    const getStatusText = (status) => {
        switch (status) {
            case 'completed': return 'Изучено';
            case 'in-progress': return 'В процессе';
            case 'not-started': return 'Не начато';
            default: return status;
        }
    };

    return (
        <div className="home-page">
            <header className="home-header">
                <h1>Трекер изучения технологий</h1>
                <ProgressBar
                    progress={progress}
                    label="Общий прогресс"
                    color="#4CAF50"
                    animated={true}
                    height={20}
                />
            </header>

            <QuickActions
                onMarkAllCompleted={markAllAsCompleted}
                onResetAll={resetAllStatuses}
                onRandomNext={randomNextTechnology}
                technologies={technologies}
            />

            <div className="home-sections">
                <section className="recent-technologies">
                    <h2>Недавние технологии</h2>
                    <div className="technologies-grid">
                        {recentTechnologies.map(tech => (
                            <div key={tech.id} className="technology-item">
                                <h3>{tech.title}</h3>
                                <p>{tech.description}</p>
                                <span className={`status status-${tech.status}`}>
                                    {getStatusText(tech.status)}
                                </span>
                                <Link to={`/technology/${tech.id}`} className="btn-link">
                                    Подробнее →
                                </Link>
                            </div>
                        ))}
                    </div>
                    <Link to="/technologies" className="btn btn-primary">
                        Смотреть все технологии
                    </Link>
                </section>

                <section className="quick-stats">
                    <h2>Быстрая статистика</h2>
                    <div className="stats-grid">
                        <div className="stat-item">
                            <span className="stat-value">{technologies.length}</span>
                            <span className="stat-label">Всего технологий</span>
                        </div>
                        <div className="stat-item">
                            <span className="stat-value">
                                {technologies.filter(t => t.status === 'completed').length}
                            </span>
                            <span className="stat-label">Изучено</span>
                        </div>
                        <div className="stat-item">
                            <span className="stat-value">
                                {technologies.filter(t => t.status === 'in-progress').length}
                            </span>
                            <span className="stat-label">В процессе</span>
                        </div>
                    </div>
                    <Link to="/statistics" className="btn btn-secondary">
                        Подробная статистика
                    </Link>
                </section>
            </div>
        </div>
    );
}

export default Home;