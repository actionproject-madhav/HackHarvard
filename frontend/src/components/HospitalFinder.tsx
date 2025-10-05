import React, { useState, useEffect, useCallback } from 'react';
import '../styles/HospitalFinder.css';

interface HospitalFinderProps {
  userLocation: { lat: number; lng: number } | null;
  specialization?: string;
}

const HospitalFinder = ({ userLocation, specialization }: HospitalFinderProps) => {
  const [facilities, setFacilities] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedFacility, setSelectedFacility] = useState<any>(null);
  const [searchRadius, setSearchRadius] = useState(5000); // 5km default

  const fetchNearbyFacilities = useCallback(async () => {
    if (!userLocation) return;

    setLoading(true);
    try {
      const endpoint = specialization 
        ? 'places/specialized-facilities'
        : 'places/nearby-hospitals';

      const response = await fetch(
        `${process.env.REACT_APP_API_URL || 'api'}/${endpoint}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            latitude: userLocation.lat,
            longitude: userLocation.lng,
            radius: searchRadius,
            specialization: specialization,
            keyword: 'hospital'
          }),
        }
      );

      const data = await response.json();
      if (data.success) {
        setFacilities(data.facilities);
      }
    } catch (error) {
      console.error('Error fetching facilities:', error);
    } finally {
      setLoading(false);
    }
  }, [searchRadius, specialization, userLocation]);
  
  useEffect(() => {
    if (userLocation) {
      fetchNearbyFacilities();
    }
  }, [fetchNearbyFacilities, userLocation]);

  const getDirections = (facility: any) => {
    const url = `https://www.google.com/maps/dir/?api=1&origin=${userLocation?.lat},${userLocation?.lng}&destination=${facility.location.lat},${facility.location.lng}&destination_place_id=${facility.place_id}`;
    window.open(url, '_blank');
  };

  const callFacility = (facility: any) => {
    // In a real app, this would fetch phone number from place details
    alert(`Calling ${facility.name}...\n\nIn production, this would dial the facility's phone number.`);
  };

  if (loading) {
    return (
      <div className="hospital-finder-loading">
        <div className="spinner"></div>
        <p>Finding nearby medical facilities...</p>
      </div>
    );
  }

  if (!userLocation) {
    return (
      <div className="hospital-finder-error">
        <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
        <h3>Location Access Required</h3>
        <p>Please enable location services to find nearby medical facilities.</p>
      </div>
    );
  }

  return (
    <div className="hospital-finder">
      <div className="hospital-finder-header">
        <h2>Nearby Medical Facilities</h2>
        <div className="radius-selector">
          <label>Search Radius:</label>
          <select 
            value={searchRadius} 
            onChange={(e) => setSearchRadius(parseInt(e.target.value))}
            className="radius-select"
          >
            <option value={2000}>2 km</option>
            <option value={5000}>5 km</option>
            <option value={10000}>10 km</option>
            <option value={20000}>20 km</option>
          </select>
        </div>
      </div>

      {facilities.length === 0 ? (
        <div className="no-facilities">
          <p>No medical facilities found within {searchRadius / 1000}km.</p>
          <button onClick={() => setSearchRadius(searchRadius * 2)} className="btn btn-primary">
            Expand Search
          </button>
        </div>
      ) : (
        <div className="facilities-grid">
          {facilities.map((facility, idx) => (
            <div 
              key={facility.place_id || idx} 
              className={`facility-card ${selectedFacility?.place_id === facility.place_id ? 'selected' : ''}`}
              onClick={() => setSelectedFacility(facility)}
            >
              <div className="facility-header">
                <div className="facility-icon">
                  <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                </div>
                <div className="facility-info">
                  <h3>{facility.name}</h3>
                  <p className="facility-address">{facility.address}</p>
                </div>
              </div>

              <div className="facility-details">
                <div className="facility-stat">
                  <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  </svg>
                  <span>{facility.distance} km away</span>
                </div>

                {facility.rating && (
                  <div className="facility-stat">
                    <svg fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                    </svg>
                    <span>{facility.rating} ({facility.user_ratings_total || 0} reviews)</span>
                  </div>
                )}

                {facility.open_now !== undefined && (
                  <div className={`facility-status ${facility.open_now ? 'open' : 'closed'}`}>
                    {facility.open_now ? '🟢 Open Now' : '🔴 Closed'}
                  </div>
                )}
              </div>

              <div className="facility-actions">
                <button 
                  className="btn btn-primary btn-sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    getDirections(facility);
                  }}
                >
                  <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                  </svg>
                  Directions
                </button>
                <button 
                  className="btn btn-ghost btn-sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    callFacility(facility);
                  }}
                >
                  <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  Call
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {selectedFacility && (
        <div className="facility-detail-modal" onClick={() => setSelectedFacility(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setSelectedFacility(null)}>×</button>
            <h2>{selectedFacility.name}</h2>
            <p className="modal-address">{selectedFacility.address}</p>
            
            <div className="modal-stats">
              <div className="modal-stat">
                <strong>Distance:</strong> {selectedFacility.distance} km
              </div>
              {selectedFacility.rating && (
                <div className="modal-stat">
                  <strong>Rating:</strong> ⭐ {selectedFacility.rating}
                </div>
              )}
            </div>

            <div className="modal-actions">
              <button 
                className="btn btn-primary"
                onClick={() => getDirections(selectedFacility)}
              >
                Get Directions
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HospitalFinder;
