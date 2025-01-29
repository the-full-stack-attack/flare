import React, { useState, useContext } from 'react';
import axios from 'axios';
import dayjs from 'dayjs';
import { Button, Dialog, DialogPanel, DialogTitle } from '@headlessui/react';
import { UserContext } from '../../contexts/UserContext';

type CompletedTaskProps = {
  userTask: UserTask;
};
type UserTask = {
  completed?: boolean;
  overall_rating: number;
  date_completed: dayjs.Dayjs;
  opted_out?: boolean;
  UserId: number;
  TaskId: number;
  Task: Task;
};
type Task = {
  id: number;
  description: string;
  type: string;
  completed_count: number;
  date: dayjs.Dayjs | '';
  difficulty: number;
};
function OptOutTask({ userTask }: CompletedTaskProps) {
  const { type, description, difficulty } = userTask.Task;
  const { Task } = userTask;
  const { user, setUser } = useContext(UserContext);
  const [isOpen, setIsOpen] = useState(false);
  // Function to allow a user to retry a task
  const retryTask = () => {
    // Grab the task id and the user id
    const { UserId, TaskId } = userTask;
    const config = {
      ids: { UserId, TaskId },
    };
    axios
      .patch('/api/task/retry', config)
      .then(({ data }) => {
        setUser(data);
      })
      .then(() => {
        setIsOpen(false);
      })
      .catch((err) => {
        console.error('Error retrying the task: ', err);
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
                Retry Task
              </DialogTitle>
              <p className="mt-2 text-sm/6 text-white/50">
                {`Do you want retry the task ${Task.description.slice(0, -1)}? This will opt you out of your current task if you already have one.`}
              </p>
              <div className="mt-4">
                <Button
                  onClick={() => {
                    setIsOpen(false);
                  }}
                >
                  Cancel
                </Button>
                <Button onClick={retryTask}>Retry</Button>
              </div>
            </DialogPanel>
          </div>
        </div>
      </Dialog>
      <li>
        {`Opted out Level ${difficulty} ${type} ${description}`}
        <Button
          onClick={() => {
            setIsOpen(true);
          }}
        >
          Retry
        </Button>
      </li>
    </>
  );
}

export default OptOutTask;
