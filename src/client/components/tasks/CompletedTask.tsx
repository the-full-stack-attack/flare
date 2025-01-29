import React, {useState, useEffect } from 'react';
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
  const { type, description, difficulty} = userTask.Task;
  const dateString: string = dayjs(userTask.date_completed).format('MM/DD/YYYY');
  const [currTask, setCurrTask] = useState<Task>({
    id: 0,
    description: '',
    type: '',
    completed_count: 0,
    date: '',
    difficulty: 0,
  });
  useEffect(() => {
    const { taskId } = userTask;
  }, [userTask]);
  return <li>{`Level ${difficulty} ${type} ${description} ${dateString}`}</li>;
}

export default CompletedTask;
