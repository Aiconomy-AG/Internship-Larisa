import { useState } from 'react';
import api from './api';

function Auth({ onLogin }) {
  const [mode, setMode] = useState('login');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirmation, setPasswordConfirmation] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = mode === 'login'
          ? await api.post('/login', { email, password })
          : await api.post('/register', {
            name,
            email,
            password,
            password_confirmation: passwordConfirmation,
          });

      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      onLogin(response.data.user);
    } catch (err) {
      const message = err.response?.data?.message
          || Object.values(err.response?.data?.errors || {})[0]?.[0]
          || 'A aparut o eroare, incearca din nou.';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
      <div style={{ maxWidth: '360px', margin: '80px auto', padding: '20px', fontFamily: 'Arial, sans-serif' }}>
        <h1 style={{ textAlign: 'center', fontSize: '32px' }}>Planificator de Calatorii</h1>
        <h2 style={{ textAlign: 'center' }}>{mode === 'login' ? 'Autentificare' : 'Creeaza cont'}</h2>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {mode === 'signup' && (
              <input
                  type="text"
                  placeholder="Nume"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  style={{ padding: '8px', fontSize: '16px' }}
              />
          )}
          <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={{ padding: '8px', fontSize: '16px' }}
          />
          <input
              type="password"
              placeholder="Parola"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{ padding: '8px', fontSize: '16px' }}
          />
          {mode === 'signup' && (
              <input
                  type="password"
                  placeholder="Confirma parola"
                  value={passwordConfirmation}
                  onChange={(e) => setPasswordConfirmation(e.target.value)}
                  style={{ padding: '8px', fontSize: '16px' }}
              />
          )}

          {error && <p style={{ color: '#DC3545' }}>{error}</p>}

          <button type="submit" disabled={loading} style={{ padding: '10px', background: '#007BFF', color: 'white', border: 'none', cursor: 'pointer', fontSize: '16px' }}>
            {loading ? 'Se incarca...' : mode === 'login' ? 'Intra in cont' : 'Creeaza cont'}
          </button>
        </form>

        <p style={{ textAlign: 'center', marginTop: '16px' }}>
          {mode === 'login' ? 'Nu ai cont?' : 'Ai deja cont?'}{' '}
          <button
              type="button"
              onClick={() => { setMode(mode === 'login' ? 'signup' : 'login'); setError(''); }}
              style={{ background: 'none', border: 'none', color: '#007BFF', cursor: 'pointer', fontSize: '16px', padding: 0 }}
          >
            {mode === 'login' ? 'Creeaza unul' : 'Autentifica-te'}
          </button>
        </p>
      </div>
  );
}

export default Auth;
