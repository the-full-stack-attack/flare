import { createContext } from 'react';

export interface UserType {
  id: number;
  username?: string;
  google_id?: string;
  email?: string;
  full_name?: string;
  phone_number?: string;
  total_tasks_completed: number;
  weekly_task_count: number;
  last_week_task_count?: number;
  events_attended: number;
  closest_event?: {
    title: string;
    start_time: Date;
  } | null;
  location?: string;
  avatar_id?: number;
  avatar_shirt?: string;
  avatar_pants?: string;
  current_task_id?: number;
  latest_flare?: {
    name: string;
    icon: string;
  } | null;
  avatar_uri?: string;
  User_Avatar?: {
    skin: string;
    hair: string;
    hair_color: string;
    eyebrows: string;
    eyes: string;
    mouth: string;
  };
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
  user: {
    id: 0, Interests: [], Notifications: [],
    total_tasks_completed: 0,
    weekly_task_count: 0,
    events_attended: 0
  },
  setUser: () => {},
  getUser: () => {},
  isAuthenticated: false,
});
