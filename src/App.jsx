import { useState, useEffect } from 'react';
import api from './api';
import TripCard from './TripCard';
import HotelSearch from './HotelSearch';
import './App.css';

function App() {
  const [trips, setTrips] = useState([]);
  const [destination, setDestination] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [search, setSearch] = useState('');

  const fetchTrips = async () => {
    try {
      const response = await api.get('/trips');
      setTrips(response.data);
    } catch (error) {
      console.error("Eroare la incarcarea calatoriilor:", error);
    }
  };

  useEffect(() => {
    fetchTrips();
  }, []);

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

  return (
      <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif', maxWidth: '600px', margin: '0 auto' }}>
        <h1>Planificator de Calatorii</h1>

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

        <input
            type="text"
            placeholder="Cauta o destinatie..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ padding: '8px', fontSize: '16px', width: '100%', boxSizing: 'border-box', marginBottom: '20px' }}
        />

        <h2>Vacantele mele:</h2>
        {filteredTrips.length === 0 ? (
            <p>{trips.length === 0 ? 'Nu ai adaugat nicio calatorie inca.' : 'Nicio calatorie nu corespunde cautarii.'}</p>
        ) : (
            <ul style={{ listStyle: 'none', padding: 0 }}>
              {filteredTrips.map((trip) => (
                  <TripCard key={trip.id} trip={trip} onRefresh={fetchTrips} />
              ))}
            </ul>
        )}

        <HotelSearch />
      </div>
  );
}

export default App;