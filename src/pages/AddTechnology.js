import { useNavigate } from 'react-router-dom';
import TechnologyForm from '../components/TechnologyForm';
import './AddTechnology.css';

function AddTechnology({ onAddTechnology }) {
    const navigate = useNavigate();

    const handleSave = (technologyData) => {
        onAddTechnology(technologyData);
        navigate('/technologies');
    };

    const handleCancel = () => {
        navigate('/technologies');
    };

    return (
        <div className="page">
            <div className="page-header">
                <h1>Добавить технологию</h1>
                <p>Заполните форму для добавления новой технологии в ваш трекер</p>
            </div>

            <TechnologyForm
                onSave={handleSave}
                onCancel={handleCancel}
            />
        </div>
    );
}

export default AddTechnology;