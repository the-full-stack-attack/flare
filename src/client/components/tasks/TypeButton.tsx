import React, { useState } from 'react';
import axios from 'axios';
import dayjs from 'dayjs';
import { Button } from '../../../components/ui/button';

type TypeButtonProps = {
  key: string;
  user: User;
  type: string;
};

type User = {
  id: number;
};
function TypeButton({ user, type }: TypeButtonProps) {
  const [taskInfo, setTaskInfo] = useState({
    type: '',
    difficulty: 3,
    date: dayjs(),
  });
  // Function to assign the chosen task category to the user
  const pickTask = (element) => {
    const userId = user.id;
    const { id } = element.target;
    const copyTask = { ...taskInfo };
    const formattedDate = taskInfo.date.format('MM/DD/YYYY');
    copyTask.date = dayjs(formattedDate);
    copyTask.type = id;
    console.log('CopyTask: ', copyTask);
    const config = {
      taskInfo: copyTask,
    };
    config.taskInfo.userId = userId;
    // Make axios request: UPDATE the users current task AND create a user_task row
    axios
      .post('/api/task', config)
      .then(({ data }) => {
        setTaskInfo(copyTask);
        console.log('Data from task: ', data);
      })
      .catch((err) => {
        console.error('Error posting task: ', err);
      });
  };
  console.log('TaskInfo on mount: ', taskInfo);
  return (
    <Button id={type} onClick={pickTask}>
      {type}
    </Button>
  );
}

export default TypeButton;

/**
 *  setTaskInfo((prevTask) => ({
      ...prevTask,
      type: id,
      date: dayjs(formattedDate),
    }));
 */
