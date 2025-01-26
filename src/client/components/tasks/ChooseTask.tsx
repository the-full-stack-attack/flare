import React, { useState } from 'react';
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from '../../../components/ui/card';
import dayjs from 'dayjs';
import TypeButton from './TypeButton';
import DifficultyButton from './DifficultyButton';

type ChooseTaskProps = {
  setTask: React.Dispatch<React.SetStateAction<object>>;
};
type TaskInfo = {
  type: string;
  difficulty: number;
  date: dayjs.Dayjs;
  userId?: number;
};
const types: string[] = ['Fun', 'Active', 'Normal', 'Duo', 'Rejection Therapy'];
const difficulties: number[] = [1, 2, 3, 4, 5];
function ChooseTask({ setTask }: ChooseTaskProps) {
  const [taskInfo, setTaskInfo] = useState<TaskInfo>({
    type: '',
    difficulty: 3,
    date: dayjs(),
  });
  return (
    <Card>
      <CardHeader>
        <CardTitle>Choose A Task</CardTitle>
      </CardHeader>
      <CardContent>
        Choose a Difficulty
        {difficulties.map((difficulty) => (
          <DifficultyButton
            key={difficulty}
            difficulty={difficulty}
            taskInfo={taskInfo}
            setTaskInfo={setTaskInfo}
          />
        ))}
        <br />
        {types.map((type) => (
          <TypeButton
            key={type}
            type={type}
            setTask={setTask}
            taskInfo={taskInfo}
          />
        ))}
      </CardContent>
    </Card>
  );
}

export default ChooseTask;
