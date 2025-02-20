import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import dayjs from 'dayjs';
import { UserContext } from '../../contexts/UserContext';
import OptOutTask from './OptOutTask';
import DialogBox from './DialogBox';

type OptedOutTasks = UserTask[];
type UserTask = {
  completed?: boolean;
  overall_rating?: number;
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
  const { user, getUser } = useContext(UserContext);
  const [optedOutTasks, setOptedOutTasks] = useState<OptedOutTasks>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [retryingTask, setRetryTask] = useState<UserTask>({
    date_completed: dayjs(),
    UserId: 0,
    TaskId: 0,
    Task: {
      id: 0,
      description: '',
      type: '',
      completed_count: 0,
      date: dayjs(),
      difficulty: 3,
    },
  });
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
  // Function to allow a user to retry a task
  const retryTask = () => {
    // Grab the task id and the user id
    const { UserId, TaskId } = retryingTask;
    const config = {
      ids: { UserId, TaskId },
    };
    axios
      .patch('/api/task/retry', config)
      .then(({ data }) => {
        getUser();
      })
      .then(() => {
        setIsOpen(false);
      })
      .catch((err) => {
        console.error('Error retrying the task: ', err);
      });
  };

  return (
    <>
      <DialogBox
        isOpen={isOpen}
        confirm={retryTask}
        stateSetter={setIsOpen}
        title="Retry Task"
        content={`Do you want retry this task? This will opt you out of your current task if you already have one.`}
        cancelText="Cancel"
        confirmText="Retry"
      />
      <div className="relative group transition-all duration-300 hover:transform text-white">
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-white/[0.07] to-white/[0.03] blur" />
        <div className="relative rounded-2xl border border-white/[0.08] bg-black/20 backdrop-blur-xl px-3 py-4 overflow-hidden">
          <div className="relative z-10"></div>
          <table className="w-full text-white">
            <thead>
              <tr className="border-b-2">
                <th className="text-left">Type</th>
                <th className="text-left">Task</th>
              </tr>
            </thead>
            <tbody>
              {optedOutTasks.map((userTask) => (
                <OptOutTask
                  key={userTask.TaskId}
                  userTask={userTask}
                  setIsOpen={setIsOpen}
                  setRetryTask={setRetryTask}
                />
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}

export default OptOutList;
