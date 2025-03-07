import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import dayjs from 'dayjs';
import { UserContext } from '../../contexts/UserContext';
import CompletedTask from './CompletedTask';

type CompletedTaskListType = {
  filter: string | null;
}
type CompletedTasks = UserTask[];
type UserTask = {
  completed?: boolean;
  overall_rating: number;
  date_completed: string | null;
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
  date: string | '';
  difficulty: number;
};
function CompletedTaskList({ filter }: CompletedTaskListType) {
  const { user } = useContext(UserContext);
  const [completedTasks, setCompletedTasks] = useState<CompletedTasks>([]);

  useEffect(() => {
    const { id } = user;
    axios
      .get(`/api/user_task/complete/${id}`, {
        params: {
          filter,
        }
      })
      .then(({ data }) => {
        setCompletedTasks(data);
      })
      .catch((err) => {
        console.error('Error fetching user_tasks: ', err);
      });
  }, [user, filter]);
  return (
    <div className="relative group transition-all duration-300 hover:transform text-white">
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-white/[0.07] to-white/[0.03] blur" />
      <div className="relative rounded-2xl border border-white/[0.08] bg-black/20 backdrop-blur-xl px-3 py-4 overflow-hidden min-h-40">
        <div className="relative z-10">
          {user.total_tasks_completed ? (
            <table className="w-full text-white">
              <thead>
                <tr className="border-b-2">
                  <th className="text-left">Type</th>
                  <th className="text-left">Task</th>
                  <th className="text-left">Completed</th>
                </tr>
              </thead>
              <tbody>
                {completedTasks.map((userTask) => (
                  <CompletedTask key={userTask.TaskId} userTask={userTask} />
                ))}
              </tbody>
            </table>
          ) : (
            <center className="text-white">
              You Have Not Completed Any Tasks
            </center>
          )}
        </div>
      </div>
    </div>
  );
}

export default CompletedTaskList;
