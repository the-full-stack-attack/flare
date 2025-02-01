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
function CompletedTaskList() {
  const { user } = useContext(UserContext);
  const [completedTasks, setCompletedTasks] = useState<CompletedTasks>([]);

  useEffect(() => {
    const { id } = user;
    axios
      .get(`/api/user_task/complete/${id}`)
      .then(({ data }) => {
        setCompletedTasks(data);
      })
      .catch((err) => {
        console.error('Error fetching user_tasks: ', err);
      });
  }, [user]);
  return (
    <div className="table w-full lg:w-1/2">
      <div className="table-header-group ...">
        <div className="table-row">
          <div className="table-cell text-left ...">Type</div>
          <div className="table-cell text-left ...">Task</div>
          <div className="table-cell text-left ...">Completed</div>
        </div>
      </div>
      {completedTasks.map((userTask) => (
        <CompletedTask key={userTask.TaskId} userTask={userTask} />
      ))}
    </div>
  );
}

export default CompletedTaskList;
