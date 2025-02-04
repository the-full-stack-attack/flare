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
import DialogBox from './DialogBox';

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
  const { user, getUser } = useContext(UserContext);
  const completeTask = (): void => {
    const userId = user.id;
    const taskId = task.id;
    const config = {
      ids: { userId, taskId },
    };
    axios
      .patch('/api/task/complete', config)
      .then(({ data }) => {
        getUser();
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
    <div className="sm:w-full lg:w-1/2">
      <DialogBox
        isOpen={openOptOut}
        confirm={optOut}
        stateSetter={setOpenOptOut}
        title="Opt out of Task"
        content="Are you sure you want to opt out of your current task?"
        cancelText="Cancel"
        confirmText="Opt Out"
      />
      <Card>
        <CardHeader>
          <CardTitle>Your Task</CardTitle>
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
    </div>
  );
}

export default TaskDisplay;
