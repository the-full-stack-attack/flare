import React, { useState, useContext } from 'react';
import dayjs from 'dayjs';
import axios from 'axios';
import { Button, Dialog, DialogPanel, DialogTitle } from '@headlessui/react';
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from '../../../components/ui/card';
import TypeButton from './TypeButton';
import DifficultyButton from './DifficultyButton';
import DialogBox from './DialogBox';
import { UserContext } from '../../contexts/UserContext';

type TaskInfo = {
  type: string;
  difficulty: number;
  date: dayjs.Dayjs;
  userId?: number;
};
const types: string[] = ['Fun', 'Active', 'Normal', 'Duo', 'Rejection Therapy'];
const difficulties: number[] = [1, 2, 3, 4, 5];
function ChooseTask() {
  const [isOpen, setIsOpen] = useState(false);
  const [taskInfo, setTaskInfo] = useState<TaskInfo>({
    type: '',
    difficulty: 3,
    date: dayjs(),
  });
  const { user, getUser } = useContext(UserContext);
  // Function to assign the chosen task category to the user
  const chooseTask = () => {
    const userId = user.id;
    const copyTask = { ...taskInfo };
    const formattedDate = taskInfo.date.format('MM/DD/YYYY');
    copyTask.date = dayjs(formattedDate);
    const config = {
      taskInfo: copyTask,
    };
    config.taskInfo.userId = userId;
    // Make axios request: UPDATE the users current task AND create a user_task row
    axios
      .post('/api/task', config)
      .then(() => {
        getUser();
      })
      .then(() => {
        setIsOpen(false);
      })
      .catch((err) => {
        console.error('Error posting task: ', err);
      });
  };
  return (
    <>
      <DialogBox
        isOpen={isOpen}
        confirm={chooseTask}
        stateSetter={setIsOpen}
        title="Confirm Task"
        content={`Do you want to choose the Level ${taskInfo.difficulty} ${taskInfo.type} task?`}
        cancelText="Cancel"
        confirmText="Confirm"
      />
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
              setTaskInfo={setTaskInfo}
              taskInfo={taskInfo}
            />
          ))}
        </CardContent>
        <CardFooter>
          <Button
            onClick={() => {
              setIsOpen(true);
            }}
            variant="secondary"
          >
            Choose Task
          </Button>
        </CardFooter>
      </Card>
    </>
  );
}

export default ChooseTask;
