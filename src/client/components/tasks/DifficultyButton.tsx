import React from 'react';
import dayjs from 'dayjs';
import { Button } from '../../../components/ui/button';

type DifficultyButtonProps = {
  difficulty: number;
  taskInfo: TaskInfo;
  setTaskInfo: React.Dispatch<React.SetStateAction<TaskInfo>>;
};
type TaskInfo = {
  type: string;
  difficulty: number;
  date: dayjs.Dayjs;
  userId?: number;
};
function DifficultyButton({
  difficulty,
  taskInfo,
  setTaskInfo,
}: DifficultyButtonProps) {
  const chooseDifficulty = (element): void => {
    // Turn element's innerHTML to a number to set the correct type
    const difficultyChosen = Number(element.target.innerHTML);
    const copyTask = { ...taskInfo };
    copyTask.difficulty = difficultyChosen;
    setTaskInfo(copyTask);
  };
  return (
    <Button
      variant={taskInfo.difficulty === difficulty ? '' : 'ghost'}
      onClick={chooseDifficulty}
    >
      {difficulty}
    </Button>
  );
}

export default DifficultyButton;
