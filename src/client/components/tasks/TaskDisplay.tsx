import React from 'react';
import dayjs from 'dayjs';
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from '../../../components/ui/card';

// Define the props interface
interface TaskDisplayProps {
  task: Task;
}
type Task = {
  id: number;
  description: string;
  type: string;
  completed_count: number;
  date: dayjs.Dayjs;
  difficulty: number;
};
function TaskDisplay({ task }: TaskDisplayProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Current Task:</CardTitle>
      </CardHeader>
      <CardContent>{task.description}</CardContent>
    </Card>
  );
}

export default TaskDisplay;
