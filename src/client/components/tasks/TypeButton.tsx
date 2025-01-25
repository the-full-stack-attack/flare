import React, { useState, useContext } from 'react';
import axios from 'axios';
import dayjs from 'dayjs';
import { Button } from '../../../components/ui/button';
import { UserContext } from '../../contexts/UserContext';

type TypeButtonProps = {
  type: string;
  setTask: React.Dispatch<React.SetStateAction<object>>;
};
type TaskInfo = {
  type: string;
  difficulty: number;
  date: dayjs.Dayjs;
  userId: number;
};

function TypeButton({ type, setTask }: TypeButtonProps) {
  const { user, getUser } = useContext(UserContext);
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
    const config = {
      taskInfo: copyTask,
    };
    config.taskInfo.userId = userId;
    // Make axios request: UPDATE the users current task AND create a user_task row
    axios
      .post('/api/task', config)
      .then(({ data }) => {
        setTask(data);
      })
      .then(() => {
        getUser();
      })
      .catch((err) => {
        console.error('Error posting task: ', err);
      });
  };
  return (
    <Button id={type} onClick={pickTask}>
      {type}
    </Button>
  );
}

export default TypeButton;
