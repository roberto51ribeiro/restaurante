
import React, { useState } from 'react';
import { User, RoleType } from '../../types';

interface OwnerRegistrationScreenProps {
  onRegister: () => void;
}

const OwnerRegistrationScreen: React.FC<OwnerRegistrationScreenProps> = ({ onRegister }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError('As senhas não coincidem.');
      return;
    }
    if (!name || !email || !password) {
      setError('Todos os campos são obrigatórios.');
      return;
    }

    const owner: User = {
      id: `user_${Date.now()}`,
      name,
      email,
      password,
      role: RoleType.Dono,
    };

    localStorage.setItem('users', JSON.stringify([owner]));
    onRegister();
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-900 text-blue-300">
      <div className="w-full max-w-md p-8 space-y-6 bg-gray-800 rounded-lg shadow-lg border border-blue-500/30">
        <h1 className="text-3xl font-bold text-center text-blue-400">Gerência 102.132.32</h1>
        <h2 className="text-xl font-semibold text-center">Registro do Dono</h2>
        <p className="text-center text-sm text-gray-400">Este é o primeiro acesso. Por favor, crie a conta principal.</p>
        <form onSubmit={handleRegister} className="space-y-4">
          <input
            type="text"
            placeholder="Nome Completo"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-4 py-2 text-white bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="email"
            placeholder="Email (Gmail)"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-2 text-white bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="password"
            placeholder="Senha"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-2 text-white bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="password"
            placeholder="Confirmar Senha"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="w-full px-4 py-2 text-white bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {error && <p className="text-red-400 text-sm">{error}</p>}
          <button type="submit" className="w-full py-2 font-bold text-white bg-blue-600 rounded-md hover:bg-blue-700 transition duration-300">
            Registrar
          </button>
        </form>
      </div>
    </div>
  );
};

export default OwnerRegistrationScreen;
