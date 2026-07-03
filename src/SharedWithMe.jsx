import { useState, useEffect } from 'react';
import api from './api';

const TIP_LABELS = {
  obiectiv: 'Obiectiv turistic',
  gastronomie: 'Gastronomie',
  altele: 'Altele',
};

function SharedWithMe() {
  const [shares, setShares] = useState([]);
  const [selectedOwnerId, setSelectedOwnerId] = useState(null);
  const [sharedData, setSharedData] = useState(null);
  const [error, setError] = useState('');

  const fetchShares = async () => {
    try {
      const response = await api.get('/shares/received');
      setShares(response.data);
    } catch (err) {
      console.error('Eroare la incarcarea invitatiilor:', err);
    }
  };

  useEffect(() => {
    fetchShares();
  }, []);

  const openShare = async (ownerId) => {
    setError('');
    setSharedData(null);
    setSelectedOwnerId(ownerId);

    try {
      const response = await api.get(`/shares/${ownerId}/trips`);
      setSharedData(response.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Nu ai (mai) acces la aceste planuri.');
      fetchShares();
    }
  };

  if (selectedOwnerId) {
    return (
        <div>
          <button onClick={() => setSelectedOwnerId(null)} style={{ padding: '6px 12px', background: '#6c757d', color: 'white', border: 'none', cursor: 'pointer', marginBottom: '20px' }}>
            Inapoi la lista
          </button>

          {error && <p style={{ color: '#DC3545' }}>{error}</p>}

          {sharedData && (
              <>
                <h2>Planurile lui {sharedData.owner.name}</h2>
                <p style={{ fontSize: '13px', color: '#666', marginBottom: '20px' }}>
                  Acces valabil pana la {new Date(sharedData.expires_at).toLocaleTimeString()}
                </p>

                {sharedData.trips.length === 0 ? (
                    <p>Nicio calatorie planificata.</p>
                ) : (
                    <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '15px' }}>
                      {sharedData.trips.map((trip) => (
                          <li key={trip.id} style={{ padding: '15px', border: '1px solid #ddd', borderRadius: '8px', background: '#f3f4f6' }}>
                            <strong style={{ fontSize: '18px' }}>{trip.numit_destinatie}</strong>
                            {trip.data_inceput && <p style={{ margin: '5px 0 0 0', fontSize: '14px', color: '#666' }}>{trip.data_inceput} - {trip.data_sfarsit || '???'}</p>}

                            {trip.activities.length === 0 ? (
                                <p style={{ fontSize: '14px', color: '#999', marginTop: '10px' }}>Nicio activitate planificata.</p>
                            ) : (
                                <ul className="activity-list" style={{ marginTop: '10px' }}>
                                  {trip.activities.map((activity) => (
                                      <li key={activity.id} className={`activity-item${activity.bifat ? ' done' : ''}`}>
                                        <div className="activity-main">
                                          <div>
                                            <span className="activity-time">{activity.ora ? activity.ora.slice(0, 5) : 'Oricand'}</span>
                                            <span className={`activity-title${activity.bifat ? ' done' : ''}`}>{activity.titlu_activitate}</span>
                                            <span className="activity-badge">{TIP_LABELS[activity.tip] || TIP_LABELS.altele}</span>
                                          </div>
                                          {activity.descriere && <p className="activity-desc">{activity.descriere}</p>}
                                        </div>
                                      </li>
                                  ))}
                                </ul>
                            )}
                          </li>
                      ))}
                    </ul>
                )}
              </>
          )}
        </div>
    );
  }

  return (
      <div>
        <h2>Partajat cu mine</h2>

        {shares.length === 0 ? (
            <p>Niciun user nu ti-a trimis inca planurile lui.</p>
        ) : (
            <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {shares.map((share) => (
                  <li key={share.id} className="activity-item" style={{ alignItems: 'center' }}>
                    <div style={{ textAlign: 'left' }}>
                      <strong>{share.owner.name}</strong>
                      <p style={{ margin: '2px 0 0 0', fontSize: '13px', color: '#666' }}>
                        {share.first_accessed_at ? 'Deschis deja' : 'Nedeschis inca - 10 minute de la prima deschidere'}
                      </p>
                    </div>
                    <button onClick={() => openShare(share.owner.id)} style={{ padding: '6px 12px', background: '#007BFF', color: 'white', border: 'none', cursor: 'pointer' }}>
                      Vezi planurile
                    </button>
                  </li>
              ))}
            </ul>
        )}
      </div>
  );
}

export default SharedWithMe;
