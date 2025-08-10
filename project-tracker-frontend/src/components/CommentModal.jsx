import { useState, useEffect } from 'react';
import api from '../services/api';

const CommentModal = ({ taskId, onClose }) => {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchComments = async () => {
      try {
        setLoading(true);
        const response = await api.get(`/${taskId}/comments`);
        setComments(response.data);
      } catch (err) {
        setError('Не удалось загрузить комментарии');
        console.error('Ошибка загрузки:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchComments();
  }, [taskId]);

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    try {
      const response = await api.post(`/${taskId}/comments`, {
        text: newComment.trim()
      });

      setComments([response.data, ...comments]);
      setNewComment('');
    } catch (err) {
      console.error('Ошибка добавления:', err);
    }
  };

  return (
    <div className="comment-modal">
      <div className="modal-header">
        <h3>Комментарии</h3>
        <button onClick={onClose} className="close-btn">×</button>
      </div>

      {error && <div className="error-message">{error}</div>}

      <div className="comments-list">
        {loading ? (
          <p>Загрузка...</p>
        ) : comments.length === 0 ? (
          <p>Нет комментариев</p>
        ) : (
          comments.map(comment => (
            <div key={comment.id} className="comment">
              <p>{comment.text}</p>
              <small>
                {new Date(comment.created_at).toLocaleString()}
              </small>
            </div>
          ))
        )}
      </div>

      <form onSubmit={handleAddComment} className="comment-form">
        <textarea
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="Ваш комментарий..."
          rows={3}
          required
        />
        <button type="submit" disabled={!newComment.trim() || loading}>
          {loading ? 'Отправка...' : 'Отправить'}
        </button>
      </form>
    </div>
  );
};

export default CommentModal;