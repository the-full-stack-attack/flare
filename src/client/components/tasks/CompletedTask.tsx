import React from 'react';
import dayjs from 'dayjs';

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
function CompletedTask({ userTask }: CompletedTaskProps) {
  const { type, description, difficulty } = userTask.Task;
  // date_completed needs to be converted to string to be rendered to the page
  const dateString: string = dayjs(userTask.date_completed).format(
    'MM/DD/YYYY'
  );
  return (
    <tr className="border-b pb-2">
      <td>{`${difficulty} ${type}`}</td>
      <td>{description.slice(0, -1)}</td>
      <td>{dateString}</td>
    </tr>
  );
}

export default CompletedTask;
