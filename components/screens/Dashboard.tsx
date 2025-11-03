
import React, { useState } from 'react';
import { User, RoleType, Alert } from '../../types';
import SideMenu from '../SideMenu';
import RestaurantesScreen from './RestaurantesScreen';
import FuncoesScreen from './FuncoesScreen';
import FuncionariosScreen from './FuncionariosScreen';
import TarefasScreen from './TarefasScreen';
import MinhasTarefasScreen from './MinhasTarefasScreen';
import RelatoriosScreen from './RelatoriosScreen';

interface DashboardProps {
  user: User;
  onLogout: () => void;
}

const AlertIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.21 3.03-1.742 3.03H4.42c-1.532 0-2.492-1.696-1.742-3.03l5.58-9.92zM10 13a1 1 0 110-2 1 1 0 010 2zm-1-4a1 1 0 011-1h.01a1 1 0 110 2H10a1 1 0 01-1-1z" clipRule="evenodd" />
    </svg>
);


const Dashboard: React.FC<DashboardProps> = ({ user, onLogout }) => {
  const [activeScreen, setActiveScreen] = useState('inicio');
  const [isMenuMinimized, setIsMenuMinimized] = useState(false);
  const [alerts] = useState<Alert[]>(() => {
    if (user.role === RoleType.Dono || user.role === RoleType.Gerente) {
      return [
        {id: '1', type: 'atraso_tarefa', message: 'Tarefa "Limpar cozinha" está atrasada.', timestamp: new Date().toISOString(), relatedId: 'task1'},
        {id: '2', type: 'funcionario_atrasado', message: 'Funcionário João Silva está 15 minutos atrasado.', timestamp: new Date().toISOString(), relatedId: 'user2'},
      ];
    }
    return [];
  });


  const renderScreen = () => {
    switch (activeScreen) {
      case 'restaurantes':
        return <RestaurantesScreen />;
      case 'funcoes':
        return <FuncoesScreen />;
      case 'funcionarios':
        return <FuncionariosScreen />;
      case 'tarefas':
        return <TarefasScreen user={user} />;
      case 'minhas-tarefas':
        return <MinhasTarefasScreen user={user} />;
      case 'relatorios':
        return <RelatoriosScreen />;
      default:
        return (
            <div className="text-blue-200">
                <h1 className="text-4xl font-bold mb-4">Bem-vindo(a), {user.name}!</h1>
                <p className="text-lg">Selecione uma opção no menu ao lado para começar.</p>
                {(user.role === RoleType.Dono || user.role === RoleType.Gerente) && alerts.length > 0 && (
                    <div className="mt-8 p-4 bg-gray-800 border border-yellow-500/50 rounded-lg">
                        <h2 className="text-2xl font-semibold text-yellow-400 mb-3">Alertas Recentes</h2>
                        <ul className="space-y-2">
                            {alerts.map(alert => (
                                <li key={alert.id} className="flex items-center p-3 bg-gray-700/50 rounded-md text-yellow-300">
                                   <AlertIcon />
                                   {alert.message}
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
            </div>
        );
    }
  };

  return (
    <div className="flex h-screen bg-gray-900 text-blue-300">
      <SideMenu 
        user={user} 
        activeScreen={activeScreen} 
        setActiveScreen={setActiveScreen} 
        onLogout={onLogout}
        isMinimized={isMenuMinimized}
        setIsMinimized={setIsMenuMinimized}
      />
      <main className={`flex-1 p-6 sm:p-10 transition-all duration-300 overflow-y-auto ${isMenuMinimized ? 'ml-20' : 'ml-64'}`}>
        {renderScreen()}
      </main>
    </div>
  );
};

export default Dashboard;
