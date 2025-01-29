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
  task: Task | object;
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
  // Function for when a task is complete
  const { user, getUser, setUser } = useContext(UserContext);
  // Is it better to use getUser or setUser in this function?
  const completeTask = (): void => {
    const userId = user.id;
    const taskId = task.id;
    const config = {
      ids: { userId, taskId },
    };
    axios
      .patch('/api/task/complete', config)
      .then(({ data }) => {
        setUser(data);
      })
      .catch((err) => {
        console.error('Error completing task/user PATCH: ', err);
      });
  };
  // Function for when a user opts out of a task
  const optOut = (): void => {
    const userId = user.id;
    const taskId = task.id;
    const config = {
      userId,
    };
    axios
      .patch(`/api/task/optOut/${taskId}`, config)
      .then(({ data }) => {
        setUser(data);
      })
      .catch((err) => {
        console.error('Error in the optOut PATCH: ', err);
      });
  };
  return (
    <Card>
      <CardHeader>
        <CardTitle>Current Task:</CardTitle>
      </CardHeader>
      <CardContent>
        {user.current_task_id
          ? `Level ${task.difficulty} ${task.type} task  ${task.description}`
          : 'You are not assigned a task. Go to the Task page to choose your task.'}
      </CardContent>
      {user.current_task_id ? (
        <CardFooter>
          <Button onClick={completeTask} variant="secondary">
            Complete
          </Button>
          <Button onClick={optOut} variant="secondary">
            Opt-Out
          </Button>
        </CardFooter>
      ) : null}
    </Card>
  );
}

export default TaskDisplay;
