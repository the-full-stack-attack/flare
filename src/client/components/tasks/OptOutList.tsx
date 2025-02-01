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
    <div className="table w-full lg:w-1/2">
      <div className="table-header-group ...">
        <div className="table-row">
          <div className="table-cell text-left ...">Type</div>
          <div className="table-cell text-left ...">Task</div>
        </div>
      </div>
      {optedOutTasks.map((userTask) => (
        <OptOutTask key={userTask.TaskId} userTask={userTask} />
      ))}
    </div>
  );
}

export default OptOutList;
