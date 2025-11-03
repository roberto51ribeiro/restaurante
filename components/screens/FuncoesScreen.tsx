
import React, { useState, useEffect } from 'react';
import { FunctionRole, Restaurant } from '../../types';

const FuncoesScreen: React.FC = () => {
  const [roles, setRoles] = useState<FunctionRole[]>([]);
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [roleName, setRoleName] = useState('');
  const [selectedRestaurant, setSelectedRestaurant] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const storedRoles = JSON.parse(localStorage.getItem('roles') || '[]');
    setRoles(storedRoles);
    const storedRestaurants = JSON.parse(localStorage.getItem('restaurants') || '[]');
    setRestaurants(storedRestaurants);
    if (storedRestaurants.length > 0) {
      setSelectedRestaurant(storedRestaurants[0].id);
    }
  }, []);

  const handleAddRole = (e: React.FormEvent) => {
    e.preventDefault();
    if (!roleName || !selectedRestaurant) {
      setError('Nome da função e restaurante são obrigatórios.');
      return;
    }
    setError('');

    const newRole: FunctionRole = {
      id: `role_${Date.now()}`,
      name: roleName,
      restaurantId: selectedRestaurant,
    };
    const updatedRoles = [...roles, newRole];
    setRoles(updatedRoles);
    localStorage.setItem('roles', JSON.stringify(updatedRoles));
    setRoleName('');
  };

  return (
    <div>
      <h1 className="text-3xl font-bold text-blue-400 mb-6">Gerenciar Funções</h1>
      
      <form onSubmit={handleAddRole} className="bg-gray-800 p-6 rounded-lg shadow-lg mb-8 border border-blue-500/20">
        <h2 className="text-2xl text-blue-300 mb-4">Nova Função</h2>
        {error && <p className="text-red-400 mb-4">{error}</p>}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            type="text"
            placeholder="Nome da Função (ex: Cozinheiro)"
            value={roleName}
            onChange={(e) => setRoleName(e.target.value)}
            className="w-full px-4 py-2 text-white bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <select 
            value={selectedRestaurant} 
            onChange={e => setSelectedRestaurant(e.target.value)}
            className="w-full px-4 py-2 text-white bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {restaurants.map(r => <option key={r.id} value={r.id}>{r.name}</option>)}
          </select>
        </div>
        <button type="submit" className="mt-6 w-full md:w-auto px-6 py-2 font-bold text-white bg-blue-600 rounded-md hover:bg-blue-700 transition duration-300">
          Adicionar Função
        </button>
      </form>

      <div>
        <h2 className="text-2xl text-blue-300 mb-4">Funções Cadastradas</h2>
        <div className="space-y-4">
          {roles.length > 0 ? (
            roles.map(role => {
              const restaurant = restaurants.find(r => r.id === role.restaurantId);
              return (
                <div key={role.id} className="bg-gray-800 p-4 rounded-lg">
                  <h3 className="text-xl font-semibold text-blue-400">{role.name}</h3>
                  <p className="text-sm text-gray-400">Restaurante: {restaurant?.name || 'Não encontrado'}</p>
                </div>
              );
            })
          ) : (
            <p className="text-gray-400">Nenhuma função cadastrada.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default FuncoesScreen;
