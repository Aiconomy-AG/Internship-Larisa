import { useState, useEffect } from 'react';
import api from './api';
import Auth from './Auth';
import TripCard from './TripCard';
import HotelSearch from './HotelSearch';
import Users from './Users';
import SharedWithMe from './SharedWithMe';
import './App.css';

function App() {
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem('user');
    return stored ? JSON.parse(stored) : null;
  });
  const [page, setPage] = useState('trips');
  const [trips, setTrips] = useState([]);
  const [destination, setDestination] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [search, setSearch] = useState('');

  const handleLogout = async () => {
    try {
      await api.post('/logout');
    } catch (error) {
      console.error("Eroare la delogare:", error);
    }
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    setTrips([]);
  };

  const fetchTrips = async () => {
    try {
      const response = await api.get('/trips');
      setTrips(response.data);
    } catch (error) {
      console.error("Eroare la incarcarea calatoriilor:", error);
    }
  };

  useEffect(() => {
    if (user) {
      fetchTrips();
    }
  }, [user]);

  const filteredTrips = trips.filter((trip) =>
      trip.numit_destinatie.toLowerCase().includes(search.toLowerCase())
  );

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!destination) return;

    try {
      await api.post('/trips', {
        numit_destinatie: destination,
        data_inceput: startDate || null,
        data_sfarsit: endDate || null
      });

      setDestination('');
      setStartDate('');
      setEndDate('');
      fetchTrips();
    } catch (error) {
      console.error("Eroare la salvarea calatoriei:", error);
    }
  };

  if (!user) {
    return <Auth onLogin={setUser} />;
  }

  return (
      <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif', textAlign: 'left' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h1>Planificator de Calatorii</h1>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span>{user.name}</span>
            <button onClick={handleLogout} style={{ padding: '8px 16px', background: '#6c757d', color: 'white', border: 'none', cursor: 'pointer' }}>
              Delogare
            </button>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '8px', borderBottom: '1px solid var(--border)', marginBottom: '20px' }}>
          <button
              onClick={() => setPage('trips')}
              style={{ padding: '10px 16px', background: 'none', border: 'none', cursor: 'pointer', fontSize: '16px', borderBottom: page === 'trips' ? '2px solid #007BFF' : '2px solid transparent', fontWeight: page === 'trips' ? 'bold' : 'normal' }}
          >
            Calatorii
          </button>
          <button
              onClick={() => setPage('users')}
              style={{ padding: '10px 16px', background: 'none', border: 'none', cursor: 'pointer', fontSize: '16px', borderBottom: page === 'users' ? '2px solid #007BFF' : '2px solid transparent', fontWeight: page === 'users' ? 'bold' : 'normal' }}
          >
            Useri
          </button>
          <button
              onClick={() => setPage('shared')}
              style={{ padding: '10px 16px', background: 'none', border: 'none', cursor: 'pointer', fontSize: '16px', borderBottom: page === 'shared' ? '2px solid #007BFF' : '2px solid transparent', fontWeight: page === 'shared' ? 'bold' : 'normal' }}
          >
            Partajat cu mine
          </button>
        </div>

        {page === 'users' && <Users />}
        {page === 'shared' && <SharedWithMe />}

        {page === 'trips' && (
        <div style={{ display: 'flex', gap: '32px', alignItems: 'flex-start', flexWrap: 'wrap' }}>
          <div style={{ flex: '1 1 340px', minWidth: '300px' }}>
            <h2>Adauga o calatorie</h2>
            <form onSubmit={handleSubmit} style={{ marginBottom: '30px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <input
                  type="text"
                  placeholder="Destinatie (ex: Grecia, Roma...)"
                  value={destination}
                  onChange={(e) => setDestination(e.target.value)}
                  style={{ padding: '8px', fontSize: '16px' }}
              />
              <div style={{ display: 'flex', gap: '10px' }}>
                <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    style={{ padding: '8px', flex: 1 }}
                />
                <input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    style={{ padding: '8px', flex: 1 }}
                />
              </div>
              <button type="submit" style={{ padding: '10px', background: '#007BFF', color: 'white', border: 'none', cursor: 'pointer', fontSize: '16px' }}>
                Adauga Calatorie
              </button>
            </form>

            <HotelSearch />
          </div>

          <div style={{ flex: '1 1 380px', minWidth: '300px' }}>
            <h2>Vacantele mele</h2>
            <input
                type="text"
                placeholder="Cauta o destinatie..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                style={{ padding: '8px', fontSize: '16px', width: '100%', boxSizing: 'border-box', marginBottom: '20px' }}
            />

            {filteredTrips.length === 0 ? (
                <p>{trips.length === 0 ? 'Nu ai adaugat nicio calatorie inca.' : 'Nicio calatorie nu corespunde cautarii.'}</p>
            ) : (
                <ul style={{ listStyle: 'none', padding: 0 }}>
                  {filteredTrips.map((trip) => (
                      <TripCard key={trip.id} trip={trip} onRefresh={fetchTrips} />
                  ))}
                </ul>
            )}
          </div>
        </div>
        )}
      </div>
  );
}

export default App;