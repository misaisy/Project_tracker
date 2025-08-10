import { useState } from 'react';
import api from '../services/api';
import CommentModal from './CommentModal';

const TaskItem = ({ task, onUpdate}) => {
  const [status, setStatus] = useState(task.status);
  const [showComments, setShowComments] = useState(false);

  const handleStatusChange = async (e) => {
    const newStatus = e.target.value;
    try {
      const updated = await api.put(`/tasks/${task.id}`, {
        status: newStatus
      });
      onUpdate(updated.data);
      setStatus(newStatus);
    } catch (err) {
      console.error('Update error:', err);
      alert(`Ошибка обновления: ${err.message}`);
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Удалить задачу?')) {
      try {
        await api.delete(`/tasks/${task.id}`);
      } catch (err) {
        console.error('Delete error:', err);
        alert('Не удалось удалить задачу');
      }
    }
  };

  return (
    <div className="task-item">
      <div className="task-header">
        <h3>{task.title}</h3>
        <span className={`status ${status}`}>
          {status === 'todo' && 'К выполнению'}
          {status === 'in_progress' && 'В работе'}
          {status === 'done' && 'Завершена'}
        </span>
      </div>

      <div className="task-actions">
        <select value={status} onChange={handleStatusChange}>
          <option value="todo">К выполнению</option>
          <option value="in_progress">В работе</option>
          <option value="done">Завершена</option>
        </select>

        <button onClick={() => setShowComments(!showComments)}>
          {showComments ? 'Скрыть комментарии' : 'Комментарии'}
        </button>

        <button onClick={handleDelete} className="delete">
          Удалить
        </button>
      </div>

      {showComments && (
        <CommentModal
          taskId={task.id}
          onClose={() => setShowComments(false)}
        />
      )}
    </div>
  );
};

export default TaskItem;