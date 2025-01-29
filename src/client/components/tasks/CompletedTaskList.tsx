import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import dayjs from 'dayjs';
import { UserContext } from '../../contexts/UserContext';
import CompletedTask from './CompletedTask';

type CompletedTasks = UserTask[];
type UserTask = {
  completed?: boolean;
  overall_rating: number;
  date_completed: dayjs.Dayjs;
  opted_out?: boolean;
  UserId: number;
  TaskId: number;
};

function CompletedTaskList() {
  const { user } = useContext(UserContext);
  const [completedTasks, setCompletedTasks] = useState<CompletedTasks>([]);

  useEffect(() => {
    const { id } = user;
    axios
      .get(`/api/user_task/complete/${id}`)
      .then(({ data }) => {
        console.log('Completed tasks from server: ', data);
        setCompletedTasks(data);
      })
      .catch((err) => {
        console.error('Error fetching user_tasks: ', err);
      });
  }, [user]);
  return (
    <ul>
      {completedTasks.map((userTask) => (
        <CompletedTask key={userTask.TaskId} userTask={userTask} />
      ))}
    </ul>
  );
}

export default CompletedTaskList;
