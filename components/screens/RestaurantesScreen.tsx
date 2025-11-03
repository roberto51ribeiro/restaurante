
import React, { useState, useEffect } from 'react';
import { Restaurant } from '../../types';

const RestaurantesScreen: React.FC = () => {
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [name, setName] = useState('');
  const [openTime, setOpenTime] = useState('09:00');
  const [closeTime, setCloseTime] = useState('22:00');
  const [daysOpen, setDaysOpen] = useState<string[]>([]);
  const [currentLocation, setCurrentLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [error, setError] = useState('');
  const [isLoadingLocation, setIsLoadingLocation] = useState(false);

  useEffect(() => {
    const storedRestaurants = JSON.parse(localStorage.getItem('restaurants') || '[]');
    setRestaurants(storedRestaurants);
  }, []);

  const handleDayToggle = (day: string) => {
    setDaysOpen(prev => 
      prev.includes(day) ? prev.filter(d => d !== day) : [...prev, day]
    );
  };

  const handleAddRestaurant = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoadingLocation(true);
    setError('');

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const newLocation = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        };
        setCurrentLocation(newLocation);

        if (!name || daysOpen.length === 0) {
          setError('Nome e pelo menos um dia de funcionamento são obrigatórios.');
          setIsLoadingLocation(false);
          return;
        }

        const newRestaurant: Restaurant = {
          id: `rest_${Date.now()}`,
          name,
          location: newLocation,
          openingHours: { open: openTime, close: closeTime },
          daysOpen,
        };

        const updatedRestaurants = [...restaurants, newRestaurant];
        setRestaurants(updatedRestaurants);
        localStorage.setItem('restaurants', JSON.stringify(updatedRestaurants));
        
        // Reset form
        setName('');
        setDaysOpen([]);
        setIsLoadingLocation(false);
      },
      (geoError) => {
        setError(`Erro ao obter localização: ${geoError.message}`);
        setIsLoadingLocation(false);
      }
    );
  };
  
  const weekDays = ['Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado', 'Domingo'];

  const timeOptions = Array.from({ length: 48 }, (_, i) => {
    const hour = Math.floor(i / 2);
    const minute = (i % 2) * 30;
    return `${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`;
  });

  return (
    <div>
      <h1 className="text-3xl font-bold text-blue-400 mb-6">Gerenciar Restaurantes</h1>
      
      <form onSubmit={handleAddRestaurant} className="bg-gray-800 p-6 rounded-lg shadow-lg mb-8 border border-blue-500/20">
        <h2 className="text-2xl text-blue-300 mb-4">Novo Restaurante</h2>
        {error && <p className="text-red-400 mb-4">{error}</p>}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="Nome do Restaurante"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-2 text-white bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <div></div>
            <select value={openTime} onChange={e => setOpenTime(e.target.value)} className="w-full px-4 py-2 text-white bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                {timeOptions.map(time => <option key={`open-${time}`} value={time}>{time}</option>)}
            </select>
            <select value={closeTime} onChange={e => setCloseTime(e.target.value)} className="w-full px-4 py-2 text-white bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                {timeOptions.map(time => <option key={`close-${time}`} value={time}>{time}</option>)}
            </select>
        </div>
        <div className="mt-4">
            <p className="text-blue-300 mb-2">Dias de Funcionamento:</p>
            <div className="flex flex-wrap gap-2">
                {weekDays.map(day => (
                    <button
                        type="button"
                        key={day}
                        onClick={() => handleDayToggle(day)}
                        className={`px-3 py-1 rounded-full text-sm font-semibold transition-colors ${daysOpen.includes(day) ? 'bg-blue-600 text-white' : 'bg-gray-700 text-blue-200 hover:bg-gray-600'}`}
                    >
                        {day}
                    </button>
                ))}
            </div>
        </div>
        <button type="submit" disabled={isLoadingLocation} className="mt-6 w-full md:w-auto px-6 py-2 font-bold text-white bg-blue-600 rounded-md hover:bg-blue-700 transition duration-300 disabled:bg-gray-500">
          {isLoadingLocation ? 'Obtendo Localização...' : 'Adicionar Restaurante'}
        </button>
      </form>

      <div>
        <h2 className="text-2xl text-blue-300 mb-4">Restaurantes Cadastrados</h2>
        <div className="space-y-4">
          {restaurants.length > 0 ? (
            restaurants.map(r => (
              <div key={r.id} className="bg-gray-800 p-4 rounded-lg flex justify-between items-center">
                <div>
                  <h3 className="text-xl font-semibold text-blue-400">{r.name}</h3>
                  <p className="text-sm text-gray-400">Horário: {r.openingHours.open} - {r.openingHours.close}</p>
                  <p className="text-sm text-gray-400">Dias: {r.daysOpen.join(', ')}</p>
                   <p className="text-xs text-gray-500 mt-1">Lat: {r.location.lat.toFixed(4)}, Lng: {r.location.lng.toFixed(4)}</p>
                </div>
              </div>
            ))
          ) : (
            <p className="text-gray-400">Nenhum restaurante cadastrado.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default RestaurantesScreen;
