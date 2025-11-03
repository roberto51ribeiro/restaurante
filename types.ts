
export enum RoleType {
  Dono = 'Dono',
  Gerente = 'Gerente',
  Funcionario = 'Funcionário',
}

export enum Recurrence {
  Diaria = 'Diária',
  Semanal = 'Semanal',
  Quinzenal = 'Quinzenal',
  Mensal = 'Mensal',
  Unica = 'Única',
}

export interface User {
  id: string;
  name: string;
  email: string;
  password?: string;
  role: RoleType;
  schedule?: {
    start: string;
    end: string;
  };
  recurrence?: Recurrence;
  restaurantId?: string;
}

export interface Restaurant {
  id: string;
  name: string;
  location: {
    lat: number;
    lng: number;
  };
  openingHours: {
    open: string;
    close: string;
  };
  daysOpen: string[];
}

export interface FunctionRole {
  id: string;
  name: string;
  restaurantId: string;
}

export interface Task {
  id: string;
  description: string;
  assigneeId: string;
  startTime: string;
  endTime: string;
  deadlineMinutes: number;
  frequency: Recurrence;
  completed: boolean;
  restaurantId: string;
}

export interface TimeRecord {
    id: string;
    employeeId: string;
    timestamp: string;
    type: 'chegada' | 'saida';
    location: {
        lat: number;
        lng: number;
    };
}

export interface Alert {
    id: string;
    type: 'atraso_tarefa' | 'funcionario_atrasado' | 'funcionario_ausente';
    message: string;
    timestamp: string;
    relatedId: string; // Task ID or Employee ID
}
