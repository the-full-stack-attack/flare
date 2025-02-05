import React, { useState, useContext } from 'react';
import dayjs from 'dayjs';

type CompletedTaskProps = {
  userTask: UserTask;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setRetryTask: React.Dispatch<React.SetStateAction<UserTask>>;
};
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
function OptOutTask({ userTask, setIsOpen, setRetryTask }: CompletedTaskProps) {
  const { type, description, difficulty } = userTask.Task;

  const rowClick = () => {
    setIsOpen(true);
    setRetryTask(userTask);
  }
  return (
    <>
      <tr className="border-b-2 hover:bg-gray-500 hover:bg-opacity-50" onClick={rowClick}>
        <td>{`${difficulty} ${type}`}</td>
        <td>{description.slice(0, -1)}</td>
      </tr>
    </>
  );
}

export default OptOutTask;
