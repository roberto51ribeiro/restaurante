
import React, { useState, useEffect } from 'react';
import { TimeRecord, Task, User } from '../../types';
import { generateReportSummary } from '../../services/geminiService';

const RelatoriosScreen: React.FC = () => {
  const [timeRecords, setTimeRecords] = useState<TimeRecord[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [summary, setSummary] = useState<string>('');
  const [isLoadingSummary, setIsLoadingSummary] = useState(false);

  useEffect(() => {
    const records = JSON.parse(localStorage.getItem('timeRecords') || '[]');
    setTimeRecords(records);
    const allTasks = JSON.parse(localStorage.getItem('tasks') || '[]');
    setTasks(allTasks);
    const allUsers = JSON.parse(localStorage.getItem('users') || '[]');
    setUsers(allUsers);
  }, []);

  const handleGenerateSummary = async () => {
    setIsLoadingSummary(true);
    const result = await generateReportSummary(timeRecords, tasks, users);
    setSummary(result);
    setIsLoadingSummary(false);
  };
  
  const getEmployeeName = (id: string) => users.find(u => u.id === id)?.name || 'Desconhecido';

  return (
    <div>
      <h1 className="text-3xl font-bold text-blue-400 mb-6">Relatórios</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-gray-800 p-6 rounded-lg shadow-lg border border-blue-500/20">
          <h2 className="text-2xl text-blue-300 mb-4">Registros de Ponto</h2>
          <div className="max-h-96 overflow-y-auto">
            <ul className="space-y-2">
              {timeRecords.map(record => (
                <li key={record.id} className="p-3 bg-gray-700/50 rounded-md">
                  <p className="font-semibold text-blue-300">{getEmployeeName(record.employeeId)}</p>
                  <p className="text-sm text-gray-400">
                    {new Date(record.timestamp).toLocaleString('pt-BR')} - <span className="capitalize font-medium">{record.type}</span>
                  </p>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="bg-gray-800 p-6 rounded-lg shadow-lg border border-blue-500/20">
          <h2 className="text-2xl text-blue-300 mb-4">Status das Tarefas</h2>
          <div className="max-h-96 overflow-y-auto">
            <ul className="space-y-2">
              {tasks.map(task => (
                <li key={task.id} className="p-3 bg-gray-700/50 rounded-md">
                   <p className="font-semibold text-blue-300">{task.description}</p>
                   <p className="text-sm text-gray-400">Atribuída a: {getEmployeeName(task.assigneeId)}</p>
                   <p className={`text-sm font-bold ${task.completed ? 'text-green-400' : 'text-yellow-400'}`}>
                     {task.completed ? 'Concluída' : 'Pendente'}
                   </p>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
      
      <div className="mt-8 bg-gray-800 p-6 rounded-lg shadow-lg border border-blue-500/20">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl text-blue-300">Resumo com IA (Gemini)</h2>
          <button
            onClick={handleGenerateSummary}
            disabled={isLoadingSummary}
            className="px-5 py-2 font-bold text-white bg-blue-600 rounded-md hover:bg-blue-700 transition duration-300 disabled:bg-gray-500 disabled:cursor-not-allowed"
          >
            {isLoadingSummary ? 'Gerando...' : 'Gerar Resumo'}
          </button>
        </div>
        <div className="prose prose-invert prose-blue max-w-none bg-gray-900/50 p-4 rounded-md min-h-[10rem]">
          {isLoadingSummary ? (
            <p className="text-center">Analisando dados e gerando relatório...</p>
          ) : (
            <div dangerouslySetInnerHTML={{ __html: summary.replace(/\n/g, '<br />') }} />
          )}
        </div>
      </div>
    </div>
  );
};

export default RelatoriosScreen;
