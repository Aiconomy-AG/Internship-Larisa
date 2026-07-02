import { useState, useEffect } from 'react';
import api from './api';
import TripCard from './TripCard';

function App() {
  const [trips, setTrips] = useState([]);
  const [destination, setDestination] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const fetchTrips = async () => {
    try {
      const response = await api.get('/trips');
      setTrips(response.data);
    } catch (error) {
      console.error("Eroare la incarcarea calatoriilor:", error);
    }
  };

  //incarcam calatoriile din backend cand se deschide pagina
  useEffect(() => {
    fetchTrips();
  }, []);

  //trimit calatorie noua in baza de date
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
        <h1>✈️ Planificator de Calatorii</h1>

        {/* Formular Adaugare */}
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

        {/* lista calatorii */}
        <h2>Vacanțele mele:</h2>
        {trips.length === 0 ? <p>Nu ai adaugat nicio calatorie inca.</p> : (
            <ul style={{ listStyle: 'none', padding: 0 }}>
              {trips.map((trip) => (
                  <TripCard key={trip.id} trip={trip} onRefresh={fetchTrips} />
              ))}
            </ul>
        )}
      </div>
  );
}

export default App;