import React, { useState, useContext } from 'react';
import dayjs from 'dayjs';
import axios from 'axios';
import { Button } from '@headlessui/react';
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from '../../../components/ui/card';
import { toast, Toaster } from 'sonner';
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
const types: string[] = ['Fun', 'Active', 'Normal', 'Duo', 'Rejection'];
const difficulties: number[] = [1, 2, 3, 4, 5];
function ChooseTask() {
  const [isOpen, setIsOpen] = useState(false);
  const [taskInfo, setTaskInfo] = useState<TaskInfo>({
    type: 'Normal',
    difficulty: 3,
    date: dayjs(),
  });
  const { user, getUser } = useContext(UserContext);
  // Function to assign the chosen task category to the user
  const chooseTask = () => {
    const userId = user.id;
    const copyTask = { ...taskInfo };
    // Change the time of the date object to midnight and format
    const formattedDate = taskInfo.date.startOf('day').format('MM/DD/YYYY');
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
        // Check what what the error was
        if (err.status === 409) {
          toast.error('You\'ve already attempted that task');
          setIsOpen(false);
        } else {
          toast.error('Task not assigned, try again');
        }
      });
  };
  return (
    <div className="pt-3">
      <Toaster
        position="top-center"
        theme="dark"
        toastOptions={{
          style: { backgroundColor: 'red' },
          className: 'bg-red-500',
        }}
      />
      <DialogBox
        isOpen={isOpen}
        confirm={chooseTask}
        stateSetter={setIsOpen}
        title="Confirm Task"
        content={`Do you want to choose the Level ${taskInfo.difficulty} ${taskInfo.type} task?`}
        cancelText="Cancel"
        confirmText="Confirm"
      />
      <Card className="bg-white/10 shadow-lg ring-1 ring-black/5 border-transparent text-white">
        <CardHeader>
          <CardTitle>Choose A Task</CardTitle>
        </CardHeader>
        <CardContent>
          Choose a Difficulty
          <div className="grid grid-cols-5 gap-1">
            {difficulties.map((difficulty) => (
              <DifficultyButton
                key={difficulty}
                difficulty={difficulty}
                taskInfo={taskInfo}
                setTaskInfo={setTaskInfo}
              />
            ))}
          </div>
          Choose a category
          <div className="grid grid-cols-5 gap-0 lg:grid-cols-15">
            {types.map((type) => (
              <TypeButton
                key={type}
                type={type}
                setTaskInfo={setTaskInfo}
                taskInfo={taskInfo}
              />
            ))}
          </div>
        </CardContent>
        <CardFooter
          className="justify-end"
        >
          <Button
            onClick={() => {
              setIsOpen(true);
            }}
            className="px-4 py-2 rounded-lg border border-white/10 bg-white/5 text-white/70 font-medium
                hover:bg-white/10 hover:text-white transition-all duration-300
                flex items-center gap-2 hover:scale-[1.02] active:scale-[0.98]"
          >
            Choose Task
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}

export default ChooseTask;
