import { IconType } from 'react-icons';
import { UserType } from '../client/contexts/UserContext';

export interface WeatherData {
  temp: number;
  feels_like: number;
  temp_min: number;
  temp_max: number;
  humidity: number;
  pressure: number;
  description: string;
  icon: string;
  city: string;
  country: string;
  wind_speed: number;
  wind_deg: number;
  clouds: number;
  visibility: number;
  sunrise: number;
  sunset: number;
}

export interface Location {
  lat: number;
  lon: number;
}

export interface StatCard {
  id: string;
  icon: IconType;
  label: string;
  value: number | string;
  color: string;
}

export interface Achievement {
  icon: IconType;
  title: string;
  description: string;
  earned: boolean;
}

export interface Task {
  id: number;
  title: string;
  description: string;
  difficulty: 'easy' | 'medium' | 'hard';
  category: string;
  completed: boolean;
  due_date?: string;
  created_at: string;
  updated_at: string;
}

