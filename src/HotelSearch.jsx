import { useState } from 'react';
import api from './api';

function HotelSearch() {
  const [query, setQuery] = useState('');
  const [checkin, setCheckin] = useState('');
  const [checkout, setCheckout] = useState('');
  const [hotels, setHotels] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!query || !checkin || !checkout) return;

    setLoading(true);
    setError('');

    try {
      const response = await api.get('/hotels/search', { params: { query, checkin, checkout } });
      setHotels(response.data);
    } catch (err) {
      console.error('Eroare la cautarea cazarilor:', err);
      setError('Cautarea a esuat, incearca din nou.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ marginTop: '40px' }}>
      <h2>Cauta cazari disponibile</h2>
      <form onSubmit={handleSearch} style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '15px' }}>
        <input
          type="text"
          placeholder="Destinatie (ex: Paris, Roma...)"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          style={{ padding: '8px', fontSize: '16px' }}
        />
        <div style={{ display: 'flex', gap: '10px' }}>
          <input
            type="date"
            value={checkin}
            onChange={(e) => setCheckin(e.target.value)}
            style={{ padding: '8px', flex: 1 }}
          />
          <input
            type="date"
            value={checkout}
            onChange={(e) => setCheckout(e.target.value)}
            style={{ padding: '8px', flex: 1 }}
          />
        </div>
        <button type="submit" style={{ padding: '8px 16px', background: '#007BFF', color: 'white', border: 'none', cursor: 'pointer' }}>
          Cauta
        </button>
      </form>

      {loading && <p>Se cauta...</p>}
      {error && <p style={{ color: '#DC3545' }}>{error}</p>}

      {hotels.length > 0 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {hotels.map((hotel, index) => (
            <div key={index} className="activity-item" style={{ alignItems: 'center' }}>
              {hotel.poza && (
                <img src={hotel.poza} alt={hotel.nume} style={{ width: '60px', height: '60px', objectFit: 'cover', borderRadius: '6px', marginRight: '10px' }} />
              )}
              <div style={{ textAlign: 'left', flex: 1 }}>
                <strong>{hotel.nume}</strong>
                {!!hotel.rating && <p style={{ margin: '2px 0 0 0', fontSize: '13px', color: '#666' }}>Rating: {hotel.rating}</p>}
              </div>
              {hotel.pret && (
                <div style={{ fontWeight: 'bold', color: '#28A745' }}>
                  {Math.round(hotel.pret)} {hotel.moneda}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default HotelSearch;
