
import React, { useState, useEffect } from 'react';
import { User, RoleType, Recurrence, Restaurant } from '../../types';

const FuncionariosScreen: React.FC = () => {
  const [employees, setEmployees] = useState<User[]>([]);
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [editingEmployee, setEditingEmployee] = useState<User | null>(null);

  const [formState, setFormState] = useState({
      name: '',
      email: '',
      password: '',
      role: RoleType.Funcionario,
      restaurantId: '',
      scheduleStart: '09:00',
      scheduleEnd: '17:00',
      recurrence: Recurrence.Diaria,
  });
  
  useEffect(() => {
    const allUsers = JSON.parse(localStorage.getItem('users') || '[]');
    setEmployees(allUsers);
    const storedRestaurants = JSON.parse(localStorage.getItem('restaurants') || '[]');
    setRestaurants(storedRestaurants);
    if (storedRestaurants.length > 0) {
      setFormState(prev => ({ ...prev, restaurantId: storedRestaurants[0].id }));
    }
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormState(prev => ({...prev, [name]: value}));
  };
  
  const resetForm = () => {
    setFormState({
        name: '',
        email: '',
        password: '',
        role: RoleType.Funcionario,
        restaurantId: restaurants.length > 0 ? restaurants[0].id : '',
        scheduleStart: '09:00',
        scheduleEnd: '17:00',
        recurrence: Recurrence.Diaria,
    });
    setEditingEmployee(null);
  }

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const employeeData = {
        name: formState.name,
        email: formState.email,
        password: formState.password,
        role: formState.role,
        restaurantId: formState.restaurantId,
        schedule: { start: formState.scheduleStart, end: formState.scheduleEnd },
        recurrence: formState.recurrence,
    };

    let updatedEmployees;
    if (editingEmployee) {
        updatedEmployees = employees.map(emp => emp.id === editingEmployee.id ? { ...emp, ...employeeData } : emp);
    } else {
        const newUser: User = {
            id: `user_${Date.now()}`,
            ...employeeData,
        };
        updatedEmployees = [...employees, newUser];
    }
    
    setEmployees(updatedEmployees);
    localStorage.setItem('users', JSON.stringify(updatedEmployees));
    resetForm();
  };
  
  const handleEdit = (employee: User) => {
      setEditingEmployee(employee);
      setFormState({
          name: employee.name,
          email: employee.email,
          password: employee.password || '',
          role: employee.role,
          restaurantId: employee.restaurantId || (restaurants.length > 0 ? restaurants[0].id : ''),
          scheduleStart: employee.schedule?.start || '09:00',
          scheduleEnd: employee.schedule?.end || '17:00',
          recurrence: employee.recurrence || Recurrence.Diaria,
      });
  }

  const timeOptions = Array.from({ length: 48 }, (_, i) => {
    const hour = Math.floor(i / 2);
    const minute = (i % 2) * 30;
    return `${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`;
  });

  return (
    <div>
      <h1 className="text-3xl font-bold text-blue-400 mb-6">Gerenciar Funcionários</h1>
      <form onSubmit={handleFormSubmit} className="bg-gray-800 p-6 rounded-lg shadow-lg mb-8 border border-blue-500/20">
        <h2 className="text-2xl text-blue-300 mb-4">{editingEmployee ? 'Editar Funcionário' : 'Novo Funcionário'}</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input type="text" name="name" placeholder="Nome" value={formState.name} onChange={handleInputChange} className="w-full px-4 py-2 text-white bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" required />
            <input type="email" name="email" placeholder="Email (Gmail)" value={formState.email} onChange={handleInputChange} className="w-full px-4 py-2 text-white bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" required />
            <input type="password" name="password" placeholder="Senha" value={formState.password} onChange={handleInputChange} className="w-full px-4 py-2 text-white bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" required />
            <select name="role" value={formState.role} onChange={handleInputChange} className="w-full px-4 py-2 text-white bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                {Object.values(RoleType).map(r => <option key={r} value={r}>{r}</option>)}
            </select>
            <select name="restaurantId" value={formState.restaurantId} onChange={handleInputChange} className="w-full px-4 py-2 text-white bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                {restaurants.map(r => <option key={r.id} value={r.id}>{r.name}</option>)}
            </select>
            <select name="recurrence" value={formState.recurrence} onChange={handleInputChange} className="w-full px-4 py-2 text-white bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                {Object.values(Recurrence).map(r => <option key={r} value={r}>{r}</option>)}
            </select>
            <select name="scheduleStart" value={formState.scheduleStart} onChange={handleInputChange} className="w-full px-4 py-2 text-white bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                {timeOptions.map(t => <option key={`start-${t}`} value={t}>{t}</option>)}
            </select>
            <select name="scheduleEnd" value={formState.scheduleEnd} onChange={handleInputChange} className="w-full px-4 py-2 text-white bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                {timeOptions.map(t => <option key={`end-${t}`} value={t}>{t}</option>)}
            </select>
        </div>
        <div className="mt-6 flex gap-4">
            <button type="submit" className="px-6 py-2 font-bold text-white bg-blue-600 rounded-md hover:bg-blue-700 transition duration-300">
              {editingEmployee ? 'Salvar Alterações' : 'Adicionar Funcionário'}
            </button>
            {editingEmployee && <button type="button" onClick={resetForm} className="px-6 py-2 font-bold text-white bg-gray-600 rounded-md hover:bg-gray-500 transition duration-300">Cancelar Edição</button>}
        </div>
      </form>
      
      <h2 className="text-2xl text-blue-300 mb-4">Funcionários Cadastrados</h2>
      <div className="space-y-4">
          {employees.map(emp => (
              <div key={emp.id} className="bg-gray-800 p-4 rounded-lg flex justify-between items-center">
                  <div>
                      <h3 className="text-xl font-semibold text-blue-400">{emp.name} <span className="text-sm text-gray-500">({emp.role})</span></h3>
                      <p className="text-gray-400">{emp.email}</p>
                      <p className="text-sm text-gray-500">Horário: {emp.schedule?.start} - {emp.schedule?.end}</p>
                  </div>
                  <button onClick={() => handleEdit(emp)} className="px-4 py-1 text-sm font-semibold text-blue-200 bg-blue-800/50 rounded-md hover:bg-blue-700">Editar</button>
              </div>
          ))}
      </div>
    </div>
  );
};

export default FuncionariosScreen;
