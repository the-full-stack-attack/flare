import React, { useState, useContext } from 'react';
import axios from 'axios';
import dayjs from 'dayjs';
import { UserContext } from '../../contexts/UserContext';
import DialogBox from './DialogBox';
import {
  Dialog,
  DialogPortal,
  DialogOverlay,
  DialogTrigger,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
} from '../../../components/ui/dialog';
import { FaTasks, FaCheckCircle } from 'react-icons/fa';

// Define the props interface
interface TaskDisplayProps {
  task: Task;
  setShowConfetti: React.Dispatch<React.SetStateAction<boolean>>
}
type Task = {
  id: number;
  description: string;
  type: string;
  completed_count: number;
  date: dayjs.Dayjs;
  difficulty: number;
};

function TaskDisplay({ task, setShowConfetti }: TaskDisplayProps) {
  const [openComplete, setOpenComplete] = useState(false);
  const [openOptOut, setOpenOptOut] = useState(false);
  // Function for when a task is complete
  const { user, getUser } = useContext(UserContext);
  const completeTask = (): void => {
    const userId = user.id;
    const taskId = task.id;
    const config = { ids: { userId, taskId } };
    axios
      .patch('/api/task/complete', config)
      .then(({ data }) => {
        getUser();
      })
      .then(() => {
        setShowConfetti(true);
        setTimeout(() => {
          setShowConfetti(false);
        }, 30000);
      })
      .catch((err) => {
        console.error('Error completing task/user PATCH: ', err);
      });
  };
  // Function for when a user opts out of a task
  const optOut = (): void => {
    const userId = user.id;
    const taskId = task.id;
    const config = { userId };
    axios
      .patch(`/api/task/optOut/${taskId}`, config)
      .then(({ data }) => {
        getUser();
      })
      .then(() => {
        setOpenOptOut(false);
      })
      .catch((err) => {
        console.error('Error in the optOut PATCH: ', err);
      });
  };
  return (
    <div className="pt-3">
      <DialogBox
        isOpen={openOptOut}
        confirm={optOut}
        stateSetter={setOpenOptOut}
        title="Opt out of Task"
        content="Are you sure you want to opt out of your current task?"
        cancelText="Cancel"
        confirmText="Opt Out"
      />
      <div className="relative group transition-all duration-300 hover:transform hover:scale-[1.02]">
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-white/[0.07] to-white/[0.03] blur" />
        <div className="relative rounded-2xl border border-white/[0.08] bg-black/20 backdrop-blur-xl p-6 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-white/[0.02] to-transparent" />

          <div className="relative z-10">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <FaTasks className="text-2xl bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent" />
                <h3 className="text-xl font-bold bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent">
                  Your Task
                </h3>
              </div>
            </div>
            <div className="text-white/70 mb-6">
              {user.current_task_id
                ? `Level ${task.difficulty} ${task.type} task ${task.description}`
                : 'You are not assigned a task. Go to the Task page to choose your task.'}
            </div>
            {user.current_task_id && (
              <div className="flex gap-3">
                <Dialog>
                  <DialogTrigger asChild>
                    <button
                      className="px-4 py-2 rounded-lg bg-gradient-to-r from-purple-500 to-pink-500 text-white font-medium
                  hover:from-purple-600 hover:to-pink-600 transition-all duration-300
                  flex items-center gap-2 hover:scale-[1.02] active:scale-[0.98]"
                    >
                      <FaCheckCircle className="text-white" />
                      Complete
                    </button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogTitle>TASK COMPLETE</DialogTitle>
                    <DialogDescription>
                      {`Great job completing your task to ${task.description} You've now completed ${user.weekly_task_count + 1} tasks this week!`}
                    </DialogDescription>
                    <DialogClose asChild>
                      <button
                        onClick={completeTask}
                        className="px-4 py-2 rounded-lg w-20 text-center bg-gradient-to-r from-purple-500 to-pink-500 text-white font-medium
                    hover:from-purple-600 hover:to-pink-600 transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
                      >
                      Done
                      </button>
                    </DialogClose>
                  </DialogContent>
                </Dialog>
                <button
                  onClick={() => setOpenOptOut(true)}
                  className="px-4 py-2 rounded-lg border border-white/10 bg-white/5 text-white/70 font-medium
                           hover:bg-white/10 hover:text-white transition-all duration-300
                           flex items-center gap-2 hover:scale-[1.02] active:scale-[0.98]"
                >
                  Opt-Out
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default TaskDisplay;
