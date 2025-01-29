import React, {useState, useEffect } from 'react';
import dayjs from 'dayjs';

type CompletedTaskProps = {
  task: UserTask;
};
type UserTask = {
  completed?: boolean;
  overall_rating: number;
  date_completed: dayjs.Dayjs;
  opted_out?: boolean;
  UserId: number;
  TaskId: number;
};
type Task = {
  id: number;
  description: string;
  type: string;
  completed_count: number;
  date: dayjs.Dayjs | '';
  difficulty: number;
};
function CompletedTask({ task }: CompletedTaskProps) {
  const [currTask, setCurrTask] = useState<Task>({
    id: 0,
    description: '',
    type: '',
    completed_count: 0,
    date: '',
    difficulty: 0,
  });

  useEffect(() => {
    const { taskId } = task;
  }, [task]);
  return <li />;
}

export default CompletedTask;
