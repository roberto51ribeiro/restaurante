
import React from 'react';
import { User, RoleType } from '../types';
import { RestaurantIcon, RoleIcon, EmployeeIcon, TaskIcon, MyTaskIcon, ReportIcon, LogoutIcon, MinimizeIcon, MaximizeIcon } from './icons/Icons';

interface SideMenuProps {
  user: User;
  activeScreen: string;
  setActiveScreen: (screen: string) => void;
  onLogout: () => void;
  isMinimized: boolean;
  setIsMinimized: (minimized: boolean) => void;
}

const SideMenu: React.FC<SideMenuProps> = ({ user, activeScreen, setActiveScreen, onLogout, isMinimized, setIsMinimized }) => {

  const menuItems = {
    [RoleType.Dono]: [
      { id: 'restaurantes', label: 'Restaurantes', icon: <RestaurantIcon /> },
      { id: 'funcoes', label: 'Funções', icon: <RoleIcon /> },
      { id: 'funcionarios', label: 'Funcionários', icon: <EmployeeIcon /> },
      { id: 'tarefas', label: 'Tarefas', icon: <TaskIcon /> },
      { id: 'relatorios', label: 'Relatórios', icon: <ReportIcon /> },
    ],
    [RoleType.Gerente]: [
      { id: 'tarefas', label: 'Tarefas', icon: <TaskIcon /> },
      { id: 'relatorios', label: 'Relatórios', icon: <ReportIcon /> },
    ],
    [RoleType.Funcionario]: [
      { id: 'minhas-tarefas', label: 'Minhas Tarefas', icon: <MyTaskIcon /> },
    ],
  };

  const availableItems = menuItems[user.role] || [];

  const NavLink: React.FC<{id: string, label: string, icon: React.ReactNode}> = ({ id, label, icon }) => (
    <button
      onClick={() => setActiveScreen(id)}
      className={`flex items-center w-full px-4 py-3 text-left transition-colors duration-200 ${
        activeScreen === id
          ? 'bg-blue-800 text-white'
          : 'text-blue-200 hover:bg-blue-900/50 hover:text-white'
      }`}
    >
      <span className="mr-4">{icon}</span>
      {!isMinimized && <span>{label}</span>}
    </button>
  );

  return (
    <aside className={`fixed top-0 left-0 h-full bg-gray-800 text-blue-200 flex flex-col transition-all duration-300 ${isMinimized ? 'w-20' : 'w-64'}`}>
      <div className={`flex items-center justify-center h-20 border-b border-gray-700 ${isMinimized ? 'px-2' : 'px-4'}`}>
        <h1 className={`text-xl font-bold text-blue-400 whitespace-nowrap ${isMinimized ? 'hidden' : 'block'}`}>Gerência 102.132.32</h1>
        <h1 className={`text-2xl font-bold text-blue-400 whitespace-nowrap ${isMinimized ? 'block' : 'hidden'}`}>G</h1>
      </div>
      
      <nav className="flex-1 mt-4">
        <button
          onClick={() => setActiveScreen('inicio')}
          className={`flex items-center w-full px-4 py-3 text-left transition-colors duration-200 ${
            activeScreen === 'inicio' ? 'bg-blue-800 text-white' : 'text-blue-200 hover:bg-blue-900/50 hover:text-white'
          }`}
        >
          <span className="mr-4">🏠</span>
          {!isMinimized && <span>Início</span>}
        </button>
        {availableItems.map(item => (
          <NavLink key={item.id} id={item.id} label={item.label} icon={item.icon}/>
        ))}
      </nav>

      <div className="p-4 border-t border-gray-700">
        <button onClick={() => setIsMinimized(!isMinimized)} className="flex items-center w-full px-4 py-3 text-left text-blue-200 hover:bg-blue-900/50 hover:text-white transition-colors duration-200 mb-2">
            <span className="mr-4">{isMinimized ? <MaximizeIcon /> : <MinimizeIcon />}</span>
            {!isMinimized && <span>Minimizar Menu</span>}
        </button>
        <button onClick={onLogout} className="flex items-center w-full px-4 py-3 text-left text-blue-200 hover:bg-red-800/50 hover:text-white transition-colors duration-200">
           <span className="mr-4"><LogoutIcon /></span>
           {!isMinimized && <span>Sair</span>}
        </button>
      </div>
    </aside>
  );
};

export default SideMenu;
