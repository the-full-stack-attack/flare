import React, { useContext } from 'react';
import axios from 'axios';
import dayjs from 'dayjs';
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from '../../../components/ui/card';
import { Button } from '../../../components/ui/button';
import { UserContext } from '../../contexts/UserContext';

// Define the props interface
interface TaskDisplayProps {
  task: Task | null | object;
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
  const { user, getUser, setUser } = useContext(UserContext);
  // Is it better to use getUser or setUser in this function?
  const completeTask = (): void => {
    const userId = user.id;
    const taskId = task.id;
    const config = {
      ids: { userId, taskId },
    };
    axios
      .patch('/api/task', config)
      .then(({ data }) => {
        setUser(data);
        console.log('Data from the patch: ', data);
      })
      .catch((err) => {
        console.error('Error completing task/user PATCH: ', err);
      });
  };
  return (
    <Card>
      <CardHeader>
        <CardTitle>Current Task:</CardTitle>
      </CardHeader>
      <CardContent>{task.description}</CardContent>
      <CardFooter>
        <Button onClick={completeTask}>Complete</Button>
      </CardFooter>
    </Card>
  );
}

export default TaskDisplay;
