import { useEffect, useState } from 'react';
import { faLocationDot, faMap, faRefresh } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { BackButton } from '../../components';
import type { GPSRiddleAPI } from '../../types/api';

interface GPSRiddleViewProps {
  riddle: GPSRiddleAPI;
}

export default function GPSRiddleView({ riddle }: GPSRiddleViewProps) {
  const [userLocation, setUserLocation] = useState<{ latitude: number; longitude: number } | null>(null);
  const [distance, setDistance] = useState<number | null>(null);
  const [locationError, setLocationError] = useState<string | null>(null);

  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
    const R = 6371e3;
    const φ1 = (lat1 * Math.PI) / 180;
    const φ2 = (lat2 * Math.PI) / 180;
    const Δφ = ((lat2 - lat1) * Math.PI) / 180;
    const Δλ = ((lon2 - lon1) * Math.PI) / 180;

    const a =
      Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
      Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c;
  };

  const getUserLocation = () => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setUserLocation({ latitude, longitude });
          const dist = calculateDistance(latitude, longitude, riddle.latitude, riddle.longitude);
          setDistance(dist);
          setLocationError(null);
        },
        (error) => {
          setLocationError('Impossible d\'obtenir votre position. Veuillez autoriser la géolocalisation.');
          console.error('Geolocation error:', error);
        }
      );
    } else {
      setLocationError('La géolocalisation n\'est pas supportée par votre navigateur.');
    }
  };

  useEffect(() => {
    getUserLocation();
  }, [riddle.latitude, riddle.longitude]);

  const formatDistance = (meters: number): string => {
    if (meters < 1000) {
      return `${Math.round(meters)} m`;
    }
    return `${(meters / 1000).toFixed(2)} km`;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Validation GPS');
  };

  return (
    <div className="min-h-screen flex justify-center bg-gradient-to-br from-purple-50 to-pink-100">
      <div className="w-full max-w-md bg-white min-h-screen shadow-2xl flex flex-col">
        <div className="p-4">
          <BackButton variant="light" />
        </div>

        <div className="flex-1 px-6 pb-6">
          <div className="mb-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <FontAwesomeIcon icon={faLocationDot} className="text-purple-600 text-2xl" />
                <h1 className="text-2xl font-bold text-gray-900">GPS</h1>
              </div>
              <div className="flex items-center gap-1">
                <span className="text-lg">{"🔥".repeat(riddle.difficulty)}</span>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-white to-purple-50 rounded-2xl p-6 border-2 border-purple-100 shadow-sm mb-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">{riddle.title}</h2>
            <p className="text-gray-700 leading-relaxed whitespace-pre-line">{riddle.description}</p>
          </div>

          <div className="space-y-4">
            <div className="bg-gradient-to-br from-white to-gray-50 rounded-2xl p-5 border-2 border-gray-200 shadow-sm">
              <h3 className="text-base font-bold text-gray-900 mb-3 flex items-center gap-2">
                <span className="text-xl">🎯</span>
                <span>Localisation cible</span>
              </h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600 font-medium">Latitude</span>
                  <span className="text-gray-900 font-mono">{riddle.latitude.toFixed(6)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 font-medium">Longitude</span>
                  <span className="text-gray-900 font-mono">{riddle.longitude.toFixed(6)}</span>
                </div>
              </div>
            </div>

            {locationError && (
              <div className="bg-red-50 border-2 border-red-200 rounded-2xl p-5">
                <p className="text-red-700 text-sm mb-3">{locationError}</p>
                <button
                  type="button"
                  onClick={getUserLocation}
                  className="flex items-center gap-2 text-red-800 font-semibold hover:text-red-900"
                >
                  <FontAwesomeIcon icon={faRefresh} />
                  <span>Réessayer</span>
                </button>
              </div>
            )}

            {userLocation && distance !== null && (
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-5 border-2 border-blue-200 shadow-sm">
                <h3 className="text-base font-bold text-gray-900 mb-3 flex items-center gap-2">
                  <span className="text-xl">📍</span>
                  <span>Votre position</span>
                </h3>
                <div className="space-y-2 text-sm mb-4">
                  <div className="flex justify-between">
                    <span className="text-gray-700 font-medium">Latitude</span>
                    <span className="text-gray-900 font-mono">{userLocation.latitude.toFixed(6)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-700 font-medium">Longitude</span>
                    <span className="text-gray-900 font-mono">{userLocation.longitude.toFixed(6)}</span>
                  </div>
                </div>
                <div className="pt-4 border-t border-blue-300">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-700 font-semibold">Distance</span>
                    <span className={`text-2xl font-bold ${distance < 50 ? 'text-green-600' : 'text-orange-600'}`}>
                      {formatDistance(distance)}
                    </span>
                  </div>
                </div>
              </div>
            )}

            <a
              href={`https://www.google.com/maps?q=${riddle.latitude},${riddle.longitude}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-3 w-full py-4 px-6 bg-purple-600 text-white rounded-xl font-semibold text-lg hover:bg-purple-700 active:scale-95 transition-all shadow-lg"
            >
              <FontAwesomeIcon icon={faMap} />
              <span>Ouvrir dans Google Maps</span>
            </a>

            {distance !== null && distance < 50 && (
              <form onSubmit={handleSubmit}>
                <div className="bg-green-50 border-2 border-green-300 rounded-2xl p-5 mb-4">
                  <p className="text-green-800 font-semibold text-center">
                    🎉 Vous êtes à proximité du lieu !
                  </p>
                </div>
                <button
                  type="submit"
                  className="w-full py-4 px-6 bg-green-600 text-white rounded-xl font-semibold text-lg hover:bg-green-700 active:scale-95 transition-all shadow-lg"
                >
                  Valider
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

