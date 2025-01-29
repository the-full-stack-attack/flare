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
      <Dialog
        open={isOpen}
        as="div"
        className="relative z-10 focus:outline-none"
        onClose={() => setIsOpen(false)}
      >
        <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4">
            <DialogPanel
              transition
              className="w-full max-w-md rounded-xl bg-white/5 p-6 backdrop-blur-2xl duration-300 ease-out data-[closed]:transform-[scale(95%)] data-[closed]:opacity-0"
            >
              <DialogTitle
                as="h3"
                className="text-base/7 font-medium text-white"
              >
                ChooseTask
              </DialogTitle>
              <p className="mt-2 text-sm/6 text-white/50">
                {`Do you want to choose the Level ${taskInfo.difficulty} ${taskInfo.type} task?`}
              </p>
              <div className="mt-4">
                <Button
                  onClick={() => {
                    setIsOpen(false);
                  }}
                >
                  NO
                </Button>
                <Button onClick={chooseTask}>YES</Button>
              </div>
            </DialogPanel>
          </div>
        </div>
      </Dialog>
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
