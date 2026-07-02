import { useState } from 'react';
import api from './api';

const TIP_LABELS = {
  obiectiv: '🏛️ Obiectiv turistic',
  gastronomie: '🍽️ Gastronomie',
  altele: '📌 Altele',
};

function sortActivities(activities) {
  return [...activities].sort((a, b) => {
    if (!a.ora && !b.ora) return 0;
    if (!a.ora) return 1;
    if (!b.ora) return -1;
    return a.ora.localeCompare(b.ora);
  });
}

function TripCard({ trip, onRefresh }) {
  const [isEditingTrip, setIsEditingTrip] = useState(false);
  const [editDestination, setEditDestination] = useState(trip.numit_destinatie);
  const [editStart, setEditStart] = useState(trip.data_inceput || '');
  const [editEnd, setEditEnd] = useState(trip.data_sfarsit || '');

  const [newTitle, setNewTitle] = useState('');
  const [newTip, setNewTip] = useState('altele');
  const [newDescriere, setNewDescriere] = useState('');
  const [newOra, setNewOra] = useState('');

  const [editingActivityId, setEditingActivityId] = useState(null);
  const [editActivity, setEditActivity] = useState({});

  const handleDeleteTrip = async () => {
    try {
      await api.delete(`/trips/${trip.id}`);
      onRefresh();
    } catch (error) {
      console.error('Eroare la stergerea calatoriei:', error);
    }
  };

  const handleSaveTrip = async () => {
    try {
      await api.put(`/trips/${trip.id}`, {
        numit_destinatie: editDestination,
        data_inceput: editStart || null,
        data_sfarsit: editEnd || null,
      });
      setIsEditingTrip(false);
      onRefresh();
    } catch (error) {
      console.error('Eroare la editarea calatoriei:', error);
    }
  };

  const handleAddActivity = async (e) => {
    e.preventDefault();
    if (!newTitle) return;

    try {
      await api.post(`/trips/${trip.id}/activities`, {
        titlu_activitate: newTitle,
        tip: newTip,
        descriere: newDescriere || null,
        ora: newOra || null,
      });
      setNewTitle('');
      setNewTip('altele');
      setNewDescriere('');
      setNewOra('');
      onRefresh();
    } catch (error) {
      console.error('Eroare la adaugarea activitatii:', error);
    }
  };

  const handleToggleBifat = async (activity) => {
    try {
      await api.put(`/activities/${activity.id}`, {
        bifat: !activity.bifat,
      });
      onRefresh();
    } catch (error) {
      console.error('Eroare la bifarea activitatii:', error);
    }
  };

  const startEditActivity = (activity) => {
    setEditingActivityId(activity.id);
    setEditActivity({
      titlu_activitate: activity.titlu_activitate,
      tip: activity.tip || 'altele',
      descriere: activity.descriere || '',
      ora: activity.ora ? activity.ora.slice(0, 5) : '',
    });
  };

  const handleSaveActivity = async (activityId) => {
    try {
      await api.put(`/activities/${activityId}`, {
        titlu_activitate: editActivity.titlu_activitate,
        tip: editActivity.tip,
        descriere: editActivity.descriere || null,
        ora: editActivity.ora || null,
      });
      setEditingActivityId(null);
      onRefresh();
    } catch (error) {
      console.error('Eroare la editarea activitatii:', error);
    }
  };

  const handleDeleteActivity = async (activityId) => {
    try {
      await api.delete(`/activities/${activityId}`);
      onRefresh();
    } catch (error) {
      console.error('Eroare la stergerea activitatii:', error);
    }
  };

  const activities = sortActivities(trip.activities || []);

  return (
    <li style={{ padding: '15px', border: '1px solid #ddd', marginBottom: '15px', borderRadius: '5px' }}>
      {isEditingTrip ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '10px' }}>
          <input
            type="text"
            value={editDestination}
            onChange={(e) => setEditDestination(e.target.value)}
            style={{ padding: '8px', fontSize: '16px' }}
          />
          <div style={{ display: 'flex', gap: '10px' }}>
            <input type="date" value={editStart} onChange={(e) => setEditStart(e.target.value)} style={{ padding: '8px', flex: 1 }} />
            <input type="date" value={editEnd} onChange={(e) => setEditEnd(e.target.value)} style={{ padding: '8px', flex: 1 }} />
          </div>
          <div style={{ display: 'flex', gap: '10px' }}>
            <button onClick={handleSaveTrip} style={{ padding: '8px', background: '#28A745', color: 'white', border: 'none', cursor: 'pointer', flex: 1 }}>
              Salveaza
            </button>
            <button onClick={() => setIsEditingTrip(false)} style={{ padding: '8px', background: '#6c757d', color: 'white', border: 'none', cursor: 'pointer', flex: 1 }}>
              Anuleaza
            </button>
          </div>
        </div>
      ) : (
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
          <div>
            <strong style={{ fontSize: '18px' }}>{trip.numit_destinatie}</strong>
            {trip.data_inceput && <p style={{ margin: '5px 0 0 0', fontSize: '14px', color: '#666' }}>📅 {trip.data_inceput} - {trip.data_sfarsit || '???'}</p>}
          </div>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button onClick={() => setIsEditingTrip(true)} style={{ background: '#007BFF', color: 'white', border: 'none', padding: '5px 10px', cursor: 'pointer' }}>
              Editeaza
            </button>
            <button onClick={handleDeleteTrip} style={{ background: '#DC3545', color: 'white', border: 'none', padding: '5px 10px', cursor: 'pointer' }}>
              Sterge
            </button>
          </div>
        </div>
      )}

      <div style={{ borderTop: '1px solid #eee', paddingTop: '10px' }}>
        {activities.length === 0 ? (
          <p style={{ fontSize: '14px', color: '#999' }}>Nicio activitate planificata inca.</p>
        ) : (
          <ul className="activity-list">
            {activities.map((activity) => (
              <li
                key={activity.id}
                className={`activity-item activity-item--${activity.tip || 'altele'}${activity.bifat ? ' done' : ''}`}
              >
                {editingActivityId === activity.id ? (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', width: '100%' }}>
                    <input
                      type="text"
                      value={editActivity.titlu_activitate}
                      onChange={(e) => setEditActivity({ ...editActivity, titlu_activitate: e.target.value })}
                      style={{ padding: '6px' }}
                    />
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <select
                        value={editActivity.tip}
                        onChange={(e) => setEditActivity({ ...editActivity, tip: e.target.value })}
                        style={{ padding: '6px', flex: 1 }}
                      >
                        <option value="obiectiv">🏛️ Obiectiv turistic</option>
                        <option value="gastronomie">🍽️ Gastronomie</option>
                        <option value="altele">📌 Altele</option>
                      </select>
                      <input
                        type="time"
                        value={editActivity.ora}
                        onChange={(e) => setEditActivity({ ...editActivity, ora: e.target.value })}
                        style={{ padding: '6px' }}
                      />
                    </div>
                    <textarea
                      placeholder="Detalii (adresa, recomandari, rezervare...)"
                      value={editActivity.descriere}
                      onChange={(e) => setEditActivity({ ...editActivity, descriere: e.target.value })}
                      style={{ padding: '6px', fontFamily: 'inherit' }}
                    />
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button onClick={() => handleSaveActivity(activity.id)} style={{ padding: '6px', background: '#28A745', color: 'white', border: 'none', cursor: 'pointer', flex: 1 }}>
                        Salveaza
                      </button>
                      <button onClick={() => setEditingActivityId(null)} style={{ padding: '6px', background: '#6c757d', color: 'white', border: 'none', cursor: 'pointer', flex: 1 }}>
                        Anuleaza
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="activity-main">
                      <input
                        type="checkbox"
                        className="activity-checkbox"
                        checked={!!activity.bifat}
                        onChange={() => handleToggleBifat(activity)}
                      />
                      <div>
                        <div>
                          <span className="activity-time">{activity.ora ? `⏰ ${activity.ora.slice(0, 5)}` : '🕒 Oricand'}</span>
                          <span className={`activity-title${activity.bifat ? ' done' : ''}`}>{activity.titlu_activitate}</span>
                          <span className={`activity-badge activity-badge--${activity.tip || 'altele'}`}>{TIP_LABELS[activity.tip] || TIP_LABELS.altele}</span>
                        </div>
                        {activity.descriere && <p className="activity-desc">{activity.descriere}</p>}
                      </div>
                    </div>
                    <div className="activity-actions">
                      <button onClick={() => startEditActivity(activity)}>✏️</button>
                      <button onClick={() => handleDeleteActivity(activity.id)}>🗑️</button>
                    </div>
                  </>
                )}
              </li>
            ))}
          </ul>
        )}

        <form onSubmit={handleAddActivity} style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginTop: '10px' }}>
          <input
            type="text"
            placeholder="Ce vrei sa faci? (ex: Vizita Colosseum, Cina la...)"
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            style={{ padding: '6px' }}
          />
          <div style={{ display: 'flex', gap: '8px' }}>
            <select value={newTip} onChange={(e) => setNewTip(e.target.value)} style={{ padding: '6px', flex: 1 }}>
              <option value="obiectiv">🏛️ Obiectiv turistic</option>
              <option value="gastronomie">🍽️ Gastronomie</option>
              <option value="altele">📌 Altele</option>
            </select>
            <input type="time" value={newOra} onChange={(e) => setNewOra(e.target.value)} style={{ padding: '6px' }} title="Lasa gol pentru program flexibil" />
          </div>
          <textarea
            placeholder="Detalii (adresa, recomandari, rezervare...) - optional"
            value={newDescriere}
            onChange={(e) => setNewDescriere(e.target.value)}
            style={{ padding: '6px', fontFamily: 'inherit' }}
          />
          <button type="submit" style={{ padding: '8px', background: '#007BFF', color: 'white', border: 'none', cursor: 'pointer' }}>
            + Adauga in plan
          </button>
        </form>
      </div>
    </li>
  );
}

export default TripCard;