import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import dayjs from 'dayjs';
import { UserContext } from '../../contexts/UserContext';
import OptOutTask from './OptOutTask';

type OptedOutTasks = UserTask[];
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
function OptOutList() {
  const { user } = useContext(UserContext);
  const [optedOutTasks, setOptedOutTasks] = useState<OptedOutTasks>([]);
  useEffect(() => {
    const { id } = user;
    axios
      .get(`/api/user_task/optOut/${id}`)
      .then(({ data }) => {
        setOptedOutTasks(data);
      })
      .catch((err) => {
        console.error('Error getting optedOut tasks from the server: ', err);
      });
  }, [user]);
  return (
    <table className="w-full lg:w-1/3">
      <thead>
        <tr className="border-b-4">
          <th className="text-left">Type</th>
          <th className="text-left">Task</th>
        </tr>
      </thead>
      <tbody>
        {optedOutTasks.map((userTask) => (
          <OptOutTask key={userTask.TaskId} userTask={userTask} />
        ))}
      </tbody>
    </table>
  );
}

export default OptOutList;
