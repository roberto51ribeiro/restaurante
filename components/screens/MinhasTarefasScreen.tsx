
import React, { useState, useEffect } from 'react';
import { User, Task, TimeRecord, Restaurant } from '../../types';
import { calculateDistance } from '../../utils/geolocation';

interface MinhasTarefasScreenProps {
  user: User;
}

const MinhasTarefasScreen: React.FC<MinhasTarefasScreenProps> = ({ user }) => {
  const [myTasks, setMyTasks] = useState<Task[]>([]);
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [reminder, setReminder] = useState('');
  const [fileName, setFileName] = useState('');
  const [message, setMessage] = useState<{type: 'success' | 'error', text: string} | null>(null);

  useEffect(() => {
    const allTasks: Task[] = JSON.parse(localStorage.getItem('tasks') || '[]');
    setMyTasks(allTasks.filter(task => task.assigneeId === user.id));
    const storedRestaurants: Restaurant[] = JSON.parse(localStorage.getItem('restaurants') || '[]');
    setRestaurants(storedRestaurants);
  }, [user.id]);
  
  const handleToggleTask = (taskId: string) => {
    const updatedTasks = myTasks.map(task => 
      task.id === taskId ? { ...task, completed: !task.completed } : task
    );
    setMyTasks(updatedTasks);
    
    // Update all tasks in localStorage
    const allTasks: Task[] = JSON.parse(localStorage.getItem('tasks') || '[]');
    const allUpdatedTasks = allTasks.map(task => {
        const updatedTask = updatedTasks.find(ut => ut.id === task.id);
        return updatedTask || task;
    });
    localStorage.setItem('tasks', JSON.stringify(allUpdatedTasks));
  };
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFileName(e.target.files[0].name);
    }
  };

  const handleRegisterTime = (type: 'chegada' | 'saida') => {
    setMessage(null);
    const restaurant = restaurants.find(r => r.id === user.restaurantId);
    if (!restaurant) {
      setMessage({type: 'error', text: 'Restaurante não encontrado. Contate um administrador.'});
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const distance = calculateDistance(
          position.coords.latitude,
          position.coords.longitude,
          restaurant.location.lat,
          restaurant.location.lng
        );

        if (distance <= 30) {
          const newRecord: TimeRecord = {
            id: `record_${Date.now()}`,
            employeeId: user.id,
            timestamp: new Date().toISOString(),
            type,
            location: {
              lat: position.coords.latitude,
              lng: position.coords.longitude,
            }
          };
          
          const allRecords: TimeRecord[] = JSON.parse(localStorage.getItem('timeRecords') || '[]');
          localStorage.setItem('timeRecords', JSON.stringify([...allRecords, newRecord]));
          setMessage({type: 'success', text: `Registro de ${type} efetuado com sucesso!`});
        } else {
          setMessage({type: 'error', text: `Você está a ${Math.round(distance)} metros. Aproxime-se do restaurante (limite de 30m).`});
        }
      },
      (geoError) => {
        setMessage({type: 'error', text: `Erro de GPS: ${geoError.message}`});
      }
    );
  };

  return (
    <div>
      <h1 className="text-3xl font-bold text-blue-400 mb-6">Minhas Tarefas e Ponto</h1>
      
      {message && (
          <div className={`p-4 mb-4 rounded-md text-white ${message.type === 'success' ? 'bg-green-600/80' : 'bg-red-600/80'}`}>
              {message.text}
          </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
            <h2 className="text-2xl text-blue-300 mb-4">Tarefas de Hoje</h2>
            <div className="space-y-4">
            {myTasks.length > 0 ? myTasks.map(task => (
                <div key={task.id} className="bg-gray-800 p-4 rounded-lg flex items-center justify-between">
                <div>
                    <p className={`text-lg ${task.completed ? 'line-through text-gray-500' : 'text-blue-300'}`}>{task.description}</p>
                    <p className="text-sm text-gray-400">Horário: {task.startTime} - {task.endTime}</p>
                </div>
                <button onClick={() => handleToggleTask(task.id)} className={`px-4 py-2 rounded-md font-semibold text-white transition-colors ${task.completed ? 'bg-gray-600 hover:bg-gray-500' : 'bg-green-600 hover:bg-green-700'}`}>
                    {task.completed ? 'Desfazer' : 'Concluir'}
                </button>
                </div>
            )) : <p className="text-gray-400">Você não tem tarefas atribuídas.</p>}
            </div>
        </div>
        <div className="bg-gray-800 p-6 rounded-lg shadow-lg border border-blue-500/20">
            <h2 className="text-2xl text-blue-300 mb-4">Controle de Ponto</h2>
            <div className="space-y-4">
                <button onClick={() => handleRegisterTime('chegada')} className="w-full py-3 font-bold text-white bg-blue-600 rounded-md hover:bg-blue-700 transition duration-300">Registrar Chegada</button>
                <button onClick={() => handleRegisterTime('saida')} className="w-full py-3 font-bold text-white bg-red-600 rounded-md hover:bg-red-700 transition duration-300">Registrar Saída</button>
            </div>
            <hr className="my-6 border-gray-600" />
            <h2 className="text-2xl text-blue-300 mb-4">Comunicação</h2>
             <textarea
                placeholder="Deixar um lembrete para seus superiores..."
                value={reminder}
                onChange={(e) => setReminder(e.target.value)}
                className="w-full px-4 py-2 text-white bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows={4}
            />
            <label className="w-full mt-4 cursor-pointer inline-flex items-center justify-center px-4 py-2 text-white bg-gray-700 border border-gray-600 rounded-md hover:bg-gray-600">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM6.293 6.707a1 1 0 010-1.414l3-3a1 1 0 011.414 0l3 3a1 1 0 01-1.414 1.414L11 5.414V13a1 1 0 11-2 0V5.414L7.707 6.707a1 1 0 01-1.414 0z" clipRule="evenodd" /></svg>
                {fileName || 'Enviar Arquivo'}
                <input type="file" onChange={handleFileChange} className="hidden" />
            </label>
        </div>
      </div>
    </div>
  );
};

export default MinhasTarefasScreen;
