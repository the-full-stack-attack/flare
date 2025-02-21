import React, { useState, useContext } from 'react';

type CompletedTaskProps = {
  userTask: UserTask;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setRetryTask: React.Dispatch<React.SetStateAction<UserTask>>;
};
type UserTask = {
  completed?: boolean;
  overall_rating?: number;
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
  date: string;
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
      <tr className="border-b hover:bg-gray-500 hover:bg-opacity-50 hover:cursor-pointer pb-1" onClick={rowClick}>
        <td>{`${difficulty} ${type}`}</td>
        <td>{description.slice(0, -1)}</td>
      </tr>
    </>
  );
}

export default OptOutTask;
