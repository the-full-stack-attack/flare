import React, { useContext } from 'react';
import axios from 'axios';
import dayjs from 'dayjs';
import { UserContext } from '../../contexts/UserContext';
import { Button } from '../../../components/ui/button';

type CompletedTaskProps = {
  userTask: UserTask;
};
type UserTask = {
  completed?: boolean;
  overall_rating: number;
  date_completed: dayjs.Dayjs;
  opted_out?: boolean;
  UserId: number;
  TaskId: number;
  Task: Task;
};
type Task = {
  id: number;
  description: string;
  type: string;
  completed_count: number;
  date: dayjs.Dayjs | '';
  difficulty: number;
};
function OptOutTask({ userTask }: CompletedTaskProps) {
  const { type, description, difficulty } = userTask.Task;
  const { user, setUser } = useContext(UserContext);
  // Function to allow a user to retry a task
  const retryTask = () => {
    // Grab the task id and the user id
    const { UserId, TaskId } = userTask;
    const config = {
      ids: { UserId, TaskId },
    };
    axios
      .patch('/api/task/retry', config)
      .then(({ data }) => {
        setUser(data);
      })
      .catch((err) => {
        console.error('Error retrying the task: ', err);
      });
  };
  return (
    <li>
      {`Opted out Level ${difficulty} ${type} ${description}`}
      <Button onClick={retryTask}>Retry</Button>
    </li>
  );
}

export default OptOutTask;
