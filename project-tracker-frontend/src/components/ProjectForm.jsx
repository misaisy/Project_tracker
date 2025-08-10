import { useState } from 'react';
import api from '../services/api';

const ProjectForm = ({ onProjectCreated }) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Название проекта обязательно');
      return;
    }

    try {
      setIsSubmitting(true);
      setError('');

      const response = await api.post('/projects', {
        name: name.trim(),
        description: description.trim()
      });

      onProjectCreated(response.data);
      setName('');
      setDescription('');
    } catch (err) {
      console.error('Ошибка создания проекта:', err);
      setError(err.response?.data?.detail || 'Не удалось создать проект');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="project-form">
      {error && <div className="error-message">{error}</div>}

      <div className="form-group">
        <label>Название проекта*</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Введите название"
          required
        />
      </div>

      <div className="form-group">
        <label>Описание</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Добавьте описание"
          rows={3}
        />
      </div>

      <button
        type="submit"
        disabled={!name.trim() || isSubmitting}
        className="submit-btn"
      >
        {isSubmitting ? 'Создание...' : 'Создать проект'}
      </button>
    </form>
  );
};

export default ProjectForm;