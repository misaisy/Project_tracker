import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

const RegisterPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/auth/register', { email, password });
      alert('Регистрация успешна! Теперь войдите в систему');
      navigate('/login');
    } catch (error) {
      setError(error.response?.data?.detail || 'Ошибка регистрации');
    }
  };

  return (
    <div className="auth-page">
      <h1>Регистрация</h1>
      {error && <div className="error">{error}</div>}
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          required
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Пароль (мин. 6 символов)"
          minLength={6}
          required
        />
        <button type="submit">Зарегистрироваться</button>
      </form>
      <p>
        Уже есть аккаунт? <a href="/login">Войдите</a>
      </p>
    </div>
  );
};

export default RegisterPage;