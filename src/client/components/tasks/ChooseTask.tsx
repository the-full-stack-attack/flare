import React, { useState, useContext } from 'react';
import axios from 'axios';
import { Button } from '@headlessui/react';
import { toast } from 'sonner';
import TypeButton from './TypeButton';
import DifficultyButton from './DifficultyButton';
import DialogBox from './DialogBox';
import { UserContext } from '../../contexts/UserContext';

type TaskInfo = {
  type: string;
  difficulty: number;
  userId?: number;
};
const types: string[] = ['Fun', 'Active', 'Normal', 'Duo', 'Rejection'];
const difficulties: number[] = [1, 2, 3, 4, 5];
function ChooseTask() {
  const [isOpen, setIsOpen] = useState(false);
  const [taskInfo, setTaskInfo] = useState<TaskInfo>({
    type: 'Normal',
    difficulty: 3,
  });
  const { user, getUser } = useContext(UserContext);
  // Function to assign the chosen task category to the user
  const chooseTask = () => {
    const userId = user.id;
    const copyTask = { ...taskInfo };
    const now: Date = new Date(); // Gets current local date and time
    // Convert now to Midnight UTC
    const date: string = new Date(
      Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate())
    ).toISOString()
    // Passing date and userId to copyTask
    copyTask.date = date;
    copyTask.userId = userId;
    const config = {
      taskInfo: copyTask,
    };
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
          toast.error("You've already attempted that task");
          setIsOpen(false);
        } else {
          toast.error('Task not assigned, try again');
        }
      });
  };
  return (
    <div className="pt-3">
      <DialogBox
        isOpen={isOpen}
        confirm={chooseTask}
        stateSetter={setIsOpen}
        title="Confirm Task"
        content={`Do you want to choose the Level ${taskInfo.difficulty} ${taskInfo.type} task?`}
        cancelText="Cancel"
        confirmText="Confirm"
      />
      <div className="relative group transition-all duration-300 hover:transform text-white">
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-white/[0.07] to-white/[0.03] blur" />
        <div className="relative rounded-2xl border border-white/[0.08] bg-black/20 backdrop-blur-xl p-6 overflow-hidden">

          <div className="relative z-10">
            <h3 className="text-xl font-bold bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent pb-4">
              Choose a Task
            </h3>
          </div>
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
            <div className="grid grid-cols-5 gap-1 lg:grid-cols-15">
              {types.map((type) => (
                <TypeButton
                  key={type}
                  type={type}
                  setTaskInfo={setTaskInfo}
                  taskInfo={taskInfo}
                />
              ))}
            </div>
          <div className="pt-6 pr-6">
            <Button
              onClick={() => {
                setIsOpen(true);
              }}
              className="px-6 py-2 rounded-lg bg-gradient-to-r from-purple-500 to-pink-500 text-white font-medium
                  hover:from-purple-600 hover:to-pink-600 transition-all duration-300
                  flex items-center gap-2 hover:scale-[1.02] active:scale-[0.98] ml-auto"
            >
              Choose Task
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ChooseTask;
