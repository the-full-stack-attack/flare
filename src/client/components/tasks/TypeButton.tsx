import React, { useState, useContext } from 'react';
import dayjs from 'dayjs';
import { Button } from '../../../components/ui/button';

type TypeButtonProps = {
  type: string;
  taskInfo: TaskInfo;
  setTaskInfo: React.Dispatch<React.SetStateAction<TaskInfo>>;
};
type TaskInfo = {
  type: string;
  difficulty: number;
  date: dayjs.Dayjs;
  userId?: number;
};

function TypeButton({ type, taskInfo, setTaskInfo }: TypeButtonProps) {
  // Function to set the taskInfo type
  const pickType = (element: any) => {
    const { id } = element.target;
    const copyTask = { ...taskInfo };
    copyTask.type = id;
    setTaskInfo(copyTask);
  };
  return (
    <Button
      className="border rounded-sm border-white/10"
      variant={taskInfo.type === type ? 'default' : 'ghost'}
      id={type}
      onClick={pickType}
    >
      {type}
    </Button>
  );
}

export default TypeButton;
