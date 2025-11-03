
import React, { useState, useEffect } from 'react';
import { Task, User, Recurrence, RoleType } from '../../types';

interface TarefasScreenProps {
    user: User;
}

const TarefasScreen: React.FC<TarefasScreenProps> = ({ user }) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [employees, setEmployees] = useState<User[]>([]);

  const [description, setDescription] = useState('');
  const [assigneeId, setAssigneeId] = useState('');
  const [startTime, setStartTime] = useState('09:00');
  const [endTime, setEndTime] = useState('10:00');
  const [deadlineMinutes, setDeadlineMinutes] = useState(60);
  const [frequency, setFrequency] = useState<Recurrence>(Recurrence.Unica);

  useEffect(() => {
    const storedTasks = JSON.parse(localStorage.getItem('tasks') || '[]');
    setTasks(storedTasks);
    
    const allUsers = JSON.parse(localStorage.getItem('users') || '[]') as User[];
    const availableEmployees = allUsers.filter(u => u.role === RoleType.Funcionario || u.role === RoleType.Gerente);
    setEmployees(availableEmployees);
    if(availableEmployees.length > 0) {
        setAssigneeId(availableEmployees[0].id);
    }
  }, []);

  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault();
    const newTask: Task = {
      id: `task_${Date.now()}`,
      description,
      assigneeId,
      startTime,
      endTime,
      deadlineMinutes,
      frequency,
      completed: false,
      restaurantId: user.restaurantId || '',
    };
    const updatedTasks = [...tasks, newTask];
    setTasks(updatedTasks);
    localStorage.setItem('tasks', JSON.stringify(updatedTasks));
    // Reset form
    setDescription('');
  };

  const timeOptions = Array.from({ length: 48 }, (_, i) => {
    const hour = Math.floor(i / 2);
    const minute = (i % 2) * 30;
    return `${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`;
  });

  return (
    <div>
      <h1 className="text-3xl font-bold text-blue-400 mb-6">Gerenciar Tarefas</h1>
      
      <form onSubmit={handleAddTask} className="bg-gray-800 p-6 rounded-lg shadow-lg mb-8 border border-blue-500/20">
        <h2 className="text-2xl text-blue-300 mb-4">Nova Tarefa</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <textarea
                placeholder="Descrição da Tarefa"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full md:col-span-2 lg:col-span-3 px-4 py-2 text-white bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows={3}
            />
            <select value={assigneeId} onChange={e => setAssigneeId(e.target.value)} className="w-full px-4 py-2 text-white bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                {employees.map(emp => <option key={emp.id} value={emp.id}>{emp.name}</option>)}
            </select>
            <select value={startTime} onChange={e => setStartTime(e.target.value)} className="w-full px-4 py-2 text-white bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                {timeOptions.map(t => <option key={`start-${t}`} value={t}>{t}</option>)}
            </select>
             <select value={endTime} onChange={e => setEndTime(e.target.value)} className="w-full px-4 py-2 text-white bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                {timeOptions.map(t => <option key={`end-${t}`} value={t}>{t}</option>)}
            </select>
            <input type="number" placeholder="Prazo (minutos)" value={deadlineMinutes} onChange={e => setDeadlineMinutes(parseInt(e.target.value, 10))} className="w-full px-4 py-2 text-white bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
            <select value={frequency} onChange={e => setFrequency(e.target.value as Recurrence)} className="w-full px-4 py-2 text-white bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                {Object.values(Recurrence).map(r => <option key={r} value={r}>{r}</option>)}
            </select>
        </div>
        <button type="submit" className="mt-6 w-full md:w-auto px-6 py-2 font-bold text-white bg-blue-600 rounded-md hover:bg-blue-700 transition duration-300">Adicionar Tarefa</button>
      </form>

      <h2 className="text-2xl text-blue-300 mb-4">Tarefas Atribuídas</h2>
      <div className="space-y-4">
        {tasks.map(task => {
          const assignee = employees.find(emp => emp.id === task.assigneeId);
          return (
            <div key={task.id} className={`bg-gray-800 p-4 rounded-lg border-l-4 ${task.completed ? 'border-green-500' : 'border-yellow-500'}`}>
              <p className="text-lg font-semibold text-blue-400">{task.description}</p>
              <p className="text-sm text-gray-400">Atribuído a: {assignee?.name || 'N/A'}</p>
              <p className="text-sm text-gray-400">Horário: {task.startTime} - {task.endTime} | Frequência: {task.frequency}</p>
              <p className={`text-sm font-bold ${task.completed ? 'text-green-400' : 'text-yellow-400'}`}>{task.completed ? 'Concluída' : 'Pendente'}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default TarefasScreen;
