import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import ProjectForm from '../components/ProjectForm';

const ProjectsPage = () => {
  const [projects, setProjects] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await api.get('/projects');
        setProjects(response.data);
      } catch (error) {
        console.error('Ошибка загрузки проектов:', error);
        setError('Не удалось загрузить проекты');
      } finally {
        setIsLoading(false);
      }
    };

    fetchProjects();
  }, []);

  const handleProjectCreated = (newProject) => {
    setProjects([newProject, ...projects]);
  };

  if (isLoading) {
    return <div className="loading">Загрузка проектов...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  return (
    <div className="projects-page">
      <h1>Мои проекты</h1>

      <ProjectForm onProjectCreated={handleProjectCreated} />

      <div className="projects-list">
        {projects.length === 0 ? (
          <p className="empty-message">У вас пока нет проектов. Создайте первый!</p>
        ) : (
          <div className="project-grid">
            {projects.map(project => (
              <Link
                to={`/projects/${project.id}`}
                key={project.id}
                className="project-card"
              >
                <h3>{project.name}</h3>
                <p>{project.description || 'Без описания'}</p>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProjectsPage;