import React, { useState, useContext } from 'react';
import axios from 'axios';
import dayjs from 'dayjs';
import { Button } from '@headlessui/react';
import { UserContext } from '../../contexts/UserContext';
import DialogBox from './DialogBox';

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
  const { Task } = userTask;
  const { user, getUser } = useContext(UserContext);
  const [isOpen, setIsOpen] = useState(false);
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
        content={`Do you want retry the task ${Task.description.slice(0, -1)}? This will opt you out of your current task if you already have one.`}
        cancelText="Cancel"
        confirmText="Retry"
      />
      <tr className="border-b-2">
        <td>{`${difficulty} ${type}`}</td>
        <td>{description.slice(0, -1)}</td>
      <Button
        onClick={() => {
          setIsOpen(true);
        }}
      >
        Retry
      </Button>
      </tr>
    </>
  );
}

export default OptOutTask;
