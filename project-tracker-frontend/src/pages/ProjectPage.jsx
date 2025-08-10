import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../services/api';
import TaskItem from '../components/TaskItem';

const ProjectPage = () => {
  const { projectId } = useParams();
  const [project, setProject] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProjectData = async () => {
      try {
        setLoading(true);
        setError('');

        const [projectResponse, tasksResponse] = await Promise.all([
          api.get(`/projects/${projectId}`),
          api.get(`/${projectId}/tasks`)
        ]);

        setProject(projectResponse.data);
        setTasks(tasksResponse.data);
      } catch (err) {
        console.error('Ошибка загрузки:', err);
        setError(err.response?.data?.detail || 'Не удалось загрузить данные');
      } finally {
        setLoading(false);
      }
    };

    fetchProjectData();
  }, [projectId]);

  const handleCreateTask = async (e) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;

    try {
      const response = await api.post(`/${projectId}/tasks`, {
        title: newTaskTitle.trim(),
        status: 'todo'
      });

      setTasks([response.data, ...tasks]);
      setNewTaskTitle('');
    } catch (err) {
      console.error('Ошибка создания задачи:', err);
      alert(err.response?.data?.detail || 'Не удалось создать задачу');
    }
  };

  const handleTaskUpdate = async (taskId, newStatus) => {
    try {
      const response = await api.put(`/tasks/${taskId}`, { status: newStatus });
      setTasks(tasks.map(task =>
        task.id === taskId ? response.data : task
      ));
    } catch (err) {
      console.error('Ошибка обновления:', err);
      alert('Не удалось обновить статус');
    }
  };

  if (loading) return <div className="loading">Загрузка проекта...</div>;
  if (error) return <div className="error">{error}</div>;
  if (!project) return <div>Проект не найден</div>;

  return (
    <div className="project-page">
      <Link to="/projects" className="back-link">← Все проекты</Link>

      <div className="project-header">
        <h1>{project.name}</h1>
        <p className="project-description">{project.description || 'Нет описания'}</p>
      </div>

      <form onSubmit={handleCreateTask} className="task-form">
        <input
          type="text"
          value={newTaskTitle}
          onChange={(e) => setNewTaskTitle(e.target.value)}
          placeholder="Новая задача"
          required
        />
        <button type="submit" disabled={!newTaskTitle.trim()}>
          Добавить задачу
        </button>
      </form>

      <div className="tasks-container">
        <h2>Задачи ({tasks.length})</h2>

        {tasks.length === 0 ? (
          <p className="no-tasks">Нет задач в этом проекте</p>
        ) : (
          <div className="tasks-list">
            {tasks.map(task => (
              <TaskItem
                key={task.id}
                task={task}
                onStatusChange={handleTaskUpdate}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProjectPage;