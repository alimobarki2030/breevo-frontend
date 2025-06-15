import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Register = () => {
  const navigate = useNavigate();
  const [full_name, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const formData = new FormData();
    formData.append("full_name", full_name);
    formData.append("email", email);
    formData.append("password", password);

    try {
      const response = await fetch('https://breevo-backend.onrender.com/auth/register', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const data = await response.json();
        setError(data.detail || 'فشل التسجيل');
        return;
      }

      const data = await response.json();
      localStorage.setItem('access_token', data.token);
      navigate('/analytics');
    } catch (err) {
      console.error('Registration error:', err);
      setError('حدث خطأ أثناء التسجيل');
    }
  };

  return (
    <div className="register-container">
      <h2>تسجيل حساب جديد</h2>
      {error && <p className="error-message">{error}</p>}
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="الاسم الكامل"
          value={full_name}
          onChange={(e) => setFullName(e.target.value)}
          required
        />
        <input
          type="email"
          placeholder="البريد الإلكتروني"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="كلمة المرور"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit">تسجيل</button>
      </form>
    </div>
  );
};

export default Register;
