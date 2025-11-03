
import React, { useState, useEffect } from 'react';
import OwnerRegistrationScreen from './components/screens/OwnerRegistrationScreen';
import LoginScreen from './components/screens/LoginScreen';
import Dashboard from './components/screens/Dashboard';
import { User, RoleType } from './types';

const App: React.FC = () => {
  const [isOwnerRegistered, setIsOwnerRegistered] = useState<boolean>(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  useEffect(() => {
    try {
      const ownerRegistered = localStorage.getItem('ownerRegistered') === 'true';
      setIsOwnerRegistered(ownerRegistered);

      const savedUser = localStorage.getItem('currentUser');
      if (savedUser) {
        setCurrentUser(JSON.parse(savedUser));
      }
    } catch (error) {
      console.error("Failed to access localStorage:", error);
    }
  }, []);
  
  const handleLogin = (user: User) => {
    setCurrentUser(user);
    localStorage.setItem('currentUser', JSON.stringify(user));
  };
  
  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem('currentUser');
  };

  const handleOwnerRegistered = () => {
    setIsOwnerRegistered(true);
    localStorage.setItem('ownerRegistered', 'true');
  };
  
  if (currentUser) {
    return <Dashboard user={currentUser} onLogout={handleLogout} />;
  }

  if (!isOwnerRegistered) {
    return <OwnerRegistrationScreen onRegister={handleOwnerRegistered} />;
  }

  return <LoginScreen onLogin={handleLogin} />;
};

export default App;
