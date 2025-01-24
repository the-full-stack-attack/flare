import React, { useState } from 'react';
import axios from 'axios';
import dayjs from 'dayjs';
import { Button } from '../../../components/ui/button';

type TypeButtonProps = {
  key: string;
  user: object;
  type: string;
};
function TypeButton({ user, type }: TypeButtonProps) {
  const [taskInfo, setTaskInfo] = useState({
    type: '',
    difficulty: 3,
    date: dayjs(),
  });
  // Function to assign the chosen task category to the user
  const pickTask = (element) => {
    const { id } = element.target;
    const copyTask = { ...taskInfo };
    const formattedDate = taskInfo.date.format('MM/DD/YYYY');
    copyTask.date = dayjs(formattedDate);
    copyTask.type = id;
    // Make axios request to assign the task that matches the taskInfo to the user's current task
  };
  return (
    <Button id={type} onClick={pickTask}>
      {type}
    </Button>
  );
}

export default TypeButton;
