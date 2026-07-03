import { useState, useEffect } from 'react';
import api from './api';

function Users() {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState('');
  const [error, setError] = useState('');

  const fetchUsers = async () => {
    try {
      const response = await api.get('/users', { params: search ? { search } : {} });
      setUsers(response.data);
    } catch (err) {
      console.error('Eroare la incarcarea userilor:', err);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [search]);

  const handleConnect = async (userId) => {
    setError('');
    try {
      await api.post(`/connections/${userId}`);
      fetchUsers();
    } catch (err) {
      setError(err.response?.data?.errors?.recipient?.[0] || 'A aparut o eroare, incearca din nou.');
    }
  };

  const handleAccept = async (connectionId) => {
    try {
      await api.put(`/connections/${connectionId}/accept`);
      fetchUsers();
    } catch (err) {
      console.error('Eroare la acceptarea conexiunii:', err);
    }
  };

  const handleDecline = async (connectionId) => {
    try {
      await api.put(`/connections/${connectionId}/decline`);
      fetchUsers();
    } catch (err) {
      console.error('Eroare la refuzarea conexiunii:', err);
    }
  };

  const handleInvite = async (userId) => {
    setError('');
    try {
      await api.post(`/shares/${userId}`);
      alert('Invitatie trimisa! Poate sa iti vada planurile timp de 10 minute de la prima deschidere.');
    } catch (err) {
      setError(err.response?.data?.errors?.viewer?.[0] || 'A aparut o eroare, incearca din nou.');
    }
  };

  const renderAction = (user) => {
    if (user.connection_status === 'accepted') {
      return (
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span className="activity-badge">Conectat</span>
            <button onClick={() => handleInvite(user.id)} style={{ padding: '6px 12px', background: '#007BFF', color: 'white', border: 'none', cursor: 'pointer' }}>
              Invita sa-mi vada planurile
            </button>
          </div>
      );
    }

    if (user.connection_status === 'pending' && user.connection_direction === 'sent') {
      return <span className="activity-badge">Cerere trimisa</span>;
    }

    if (user.connection_status === 'pending' && user.connection_direction === 'received') {
      return (
          <div style={{ display: 'flex', gap: '8px' }}>
            <button onClick={() => handleAccept(user.connection_id)} style={{ padding: '6px 12px', background: '#28A745', color: 'white', border: 'none', cursor: 'pointer' }}>
              Accepta
            </button>
            <button onClick={() => handleDecline(user.connection_id)} style={{ padding: '6px 12px', background: '#DC3545', color: 'white', border: 'none', cursor: 'pointer' }}>
              Refuza
            </button>
          </div>
      );
    }

    return (
        <button onClick={() => handleConnect(user.id)} style={{ padding: '6px 12px', background: '#007BFF', color: 'white', border: 'none', cursor: 'pointer' }}>
          Conecteaza-te
        </button>
    );
  };

  return (
      <div>
        <h2>Useri</h2>
        <input
            type="text"
            placeholder="Cauta dupa nume sau email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ padding: '8px', fontSize: '16px', width: '100%', boxSizing: 'border-box', marginBottom: '20px' }}
        />

        {error && <p style={{ color: '#DC3545' }}>{error}</p>}

        {users.length === 0 ? (
            <p>Niciun user gasit.</p>
        ) : (
            <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {users.map((u) => (
                  <li key={u.id} className="activity-item" style={{ alignItems: 'center' }}>
                    <div style={{ textAlign: 'left' }}>
                      <strong>{u.name}</strong>
                      <p style={{ margin: '2px 0 0 0', fontSize: '13px', color: '#666' }}>{u.email}</p>
                    </div>
                    {renderAction(u)}
                  </li>
              ))}
            </ul>
        )}
      </div>
  );
}

export default Users;
