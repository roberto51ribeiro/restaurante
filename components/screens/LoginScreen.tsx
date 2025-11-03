
import React, { useState, useEffect } from 'react';
import { User, RoleType } from '../../types';

interface LoginScreenProps {
  onLogin: (user: User) => void;
}

const LoginScreen: React.FC<LoginScreenProps> = ({ onLogin }) => {
  const [selectedRole, setSelectedRole] = useState<RoleType | null>(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [savePassword, setSavePassword] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const savedCreds = localStorage.getItem('savedCredentials');
    if (savedCreds) {
      const { email, password, role } = JSON.parse(savedCreds);
      setEmail(email);
      setPassword(password);
      setSelectedRole(role);
      setSavePassword(true);
    }
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!selectedRole) {
      setError('Por favor, selecione um nível de acesso.');
      return;
    }
    
    const users: User[] = JSON.parse(localStorage.getItem('users') || '[]');
    const user = users.find(u => u.email === email && u.password === password && u.role === selectedRole);

    if (user) {
      if (savePassword) {
        localStorage.setItem('savedCredentials', JSON.stringify({ email, password, role: selectedRole }));
      } else {
        localStorage.removeItem('savedCredentials');
      }
      onLogin(user);
    } else {
      setError('Email, senha ou nível de acesso incorreto.');
    }
  };
  
  const renderLoginForm = () => (
    <form onSubmit={handleLogin} className="space-y-4">
      <h2 className="text-xl font-semibold text-center text-blue-400">Acesso {selectedRole}</h2>
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
      <div className="flex items-center justify-between">
        <label className="flex items-center text-sm text-gray-400">
          <input
            type="checkbox"
            checked={savePassword}
            onChange={(e) => setSavePassword(e.target.checked)}
            className="mr-2 bg-gray-700 border-gray-600 rounded focus:ring-blue-500"
          />
          Salvar senha
        </label>
        <button type="button" onClick={() => setSelectedRole(null)} className="text-sm text-blue-400 hover:underline">
            Voltar
        </button>
      </div>
       {error && <p className="text-red-400 text-sm text-center">{error}</p>}
      <button type="submit" className="w-full py-2 font-bold text-white bg-blue-600 rounded-md hover:bg-blue-700 transition duration-300">
        Entrar
      </button>
    </form>
  );

  const renderRoleSelection = () => (
    <div className="space-y-4">
       <h2 className="text-xl font-semibold text-center text-blue-400">Selecione o Acesso</h2>
       {Object.values(RoleType).map(role => (
         <button 
           key={role} 
           onClick={() => setSelectedRole(role)}
           className="w-full py-3 font-bold text-blue-200 bg-gray-700 rounded-md hover:bg-blue-800 hover:text-white transition duration-300 border border-blue-900"
         >
           {role}
         </button>
       ))}
    </div>
  );

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-900 text-blue-300">
      <div className="w-full max-w-sm p-8 space-y-6 bg-gray-800 rounded-lg shadow-lg border border-blue-500/30">
        <h1 className="text-3xl font-bold text-center text-blue-400">Gerência 102.132.32</h1>
        {selectedRole ? renderLoginForm() : renderRoleSelection()}
      </div>
    </div>
  );
};

export default LoginScreen;

