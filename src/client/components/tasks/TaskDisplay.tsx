import React, { useState, useContext } from 'react';
import axios from 'axios';
import dayjs from 'dayjs';
import { Button, Dialog, DialogPanel, DialogTitle } from '@headlessui/react';
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from '../../../components/ui/card';
import { UserContext } from '../../contexts/UserContext';

// Define the props interface
interface TaskDisplayProps {
  task: Task | object;
}
type Task = {
  id: number;
  description: string;
  type: string;
  completed_count: number;
  date: dayjs.Dayjs;
  difficulty: number;
};

function TaskDisplay({ task }: TaskDisplayProps) {
  const [openComplete, setOpenComplete] = useState(false);
  const [openOptOut, setOpenOptOut] = useState(false);
  // Function for when a task is complete
  const { user, getUser, setUser } = useContext(UserContext);
  // Is it better to use getUser or setUser in this function?
  const completeTask = (): void => {
    const userId = user.id;
    const taskId = task.id;
    const config = {
      ids: { userId, taskId },
    };
    axios
      .patch('/api/task/complete', config)
      .then(({ data }) => {
        setUser(data);
      })
      .catch((err) => {
        console.error('Error completing task/user PATCH: ', err);
      });
  };
  // Function for when a user opts out of a task
  const optOut = (): void => {
    const userId = user.id;
    const taskId = task.id;
    const config = {
      userId,
    };
    axios
      .patch(`/api/task/optOut/${taskId}`, config)
      .then(({ data }) => {
        setUser(data);
      })
      .then(() => {
        setOpenOptOut(false);
      })
      .catch((err) => {
        console.error('Error in the optOut PATCH: ', err);
      });
  };
  return (
    <>
      <Dialog
        open={openOptOut}
        as="div"
        className="relative z-10 focus:outline-none"
        onClose={() => setOpenOptOut(false)}
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
                Opt Out of Task
              </DialogTitle>
              <p className="mt-2 text-sm/6 text-white/50">
                Are you sure you want to opt out of your current task?
              </p>
              <div className="mt-4">
                <Button
                  onClick={() => {
                    setOpenOptOut(false);
                  }}
                >
                  Cancel
                </Button>
                <Button onClick={optOut}>Yes</Button>
              </div>
            </DialogPanel>
          </div>
        </div>
      </Dialog>
      <Card>
        <CardHeader>
          <CardTitle>Current Task:</CardTitle>
        </CardHeader>
        <CardContent>
          {user.current_task_id
            ? `Level ${task.difficulty} ${task.type} task  ${task.description}`
            : 'You are not assigned a task. Go to the Task page to choose your task.'}
        </CardContent>
        {user.current_task_id ? (
          <CardFooter>
            <Button onClick={completeTask} variant="secondary">
              Complete
            </Button>
            <Button
              onClick={() => {
                setOpenOptOut(true);
              }}
              variant="secondary"
            >
              Opt-Out
            </Button>
          </CardFooter>
        ) : null}
      </Card>
    </>
  );
}

export default TaskDisplay;
