import { createContext } from 'react';

export interface UserType {
  id: number;
  username?: string;
  google_id?: string;
  email?: string;
  full_name?: string;
  phone_number?: string;
  total_tasks_completed?: number;
  weekly_task_count: number;
  last_week_task_count: number;
  events_attended?: number;
  location?: string;
  avatar_id?: number;
  avatar_shirt?: string;
  avatar_pants?: string;
  current_task_id?: number;
  Interests: {
    id: number;
    name: string;
  }[];
  Notifications: {
    id: number;
    message: string;
    send_time: Date;
    User_Notification: {
      NotificationId: number;
    };
  }[];
}

type UserContextType = {
  user: UserType;
  setUser: (user: UserType) => void;
  getUser: () => void;
  isAuthenticated: boolean;
};

export const UserContext = createContext<UserContextType>({
  user: { id: 0, Interests: [], Notifications: [] },
  setUser: () => {},
  getUser: () => {},
  isAuthenticated: false,
});
