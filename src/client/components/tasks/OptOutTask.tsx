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
function OptOutTask({ userTask }: CompletedTaskProps) {
  const { type, description, difficulty } = userTask.Task;
  return <li>{`Opted out Level ${difficulty} ${type} ${description}`}</li>;
}

export default OptOutTask;
