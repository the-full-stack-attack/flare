import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { UserContext } from '../contexts/UserContext';
import Confetti from 'react-confetti';
import { useWindowSize } from '@react-hook/window-size';
import { BackgroundGlow } from '@/components/ui/background-glow';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import TaskDisplay from '../components/tasks/TaskDisplay';
import ChooseTask from '../components/tasks/ChooseTask';
import CompletedTaskList from '../components/tasks/CompletedTaskList';
import OptOutList from '../components/tasks/OptOutList';
import TaskSidebar from '../components/tasks/TaskSidebar';

function Task() {
  const { user } = useContext(UserContext);
  const [task, setTask] = useState<object | null>({});
  const [width, height] = useWindowSize();
  const [showConfetti, setShowConfetti] = useState(false);
  const [completeDisabled, setCompleteDisabled] = useState(false);
  const [filter, setFilter] = React.useState<string | null>(null);
  // Use effect will call getTask if there is a change in user state
  useEffect((): void => {
    // Find the task by the id and set the task in state
    const { current_task_id } = user;
    if (current_task_id) {
      axios
        .get(`/api/task/${current_task_id}`)
        .then(({ data }) => {
          setTask(data);
        })
        .catch((err) => {
          console.error('Error GETting task by id: ', err);
        });
    }
  }, [user]);
  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-pink-900 relative overflow-hidden pt-20 pb-12 px-4">
      <BackgroundGlow className="absolute inset-0 z-0 pointer-events-none" />
      {showConfetti && (
        <Confetti
          width={width}
          height={height * 2}
          numberOfPieces={height * 2}
          recycle={false}
        />
      )}
      <div className="flex flex-col justify-center items-center">
        <div className="inline-flex justify-center text-white w-full py-3">
          Task Counts:
          <div className="text-md text-white px-2">{`Last week: ${user.last_week_task_count}`}</div>
          <div className="text-md text-white">{`This week: ${user.weekly_task_count}`}</div>
        </div>
        <TaskSidebar />
        <div className="min-w-[50vw]">
          {user.current_task_id ? (
            <TaskDisplay
              task={task}
              completeDisabled={completeDisabled}
              setShowConfetti={setShowConfetti}
              setCompleteDisabled={setCompleteDisabled}
            />
          ) : (
            <ChooseTask />
          )}
          <div className="inline-flex items-center space-x-4">
            <div className="text-xl font-semibold text-white pt-3">
              Completed Tasks
              <div className="text-white pt-2 pb-3">
                <Select onValueChange={setFilter}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectItem
                        className="!text-gray-900 !bg-gray-100 !hover:bg-gray-200 !focus:bg-gray-200 !data-[state=active]:bg-gray-300"
                        value={null as any}
                      >
                        None
                      </SelectItem>
                      <SelectItem
                        className="!text-gray-900 !bg-gray-100 !hover:bg-gray-200 !focus:bg-gray-200 !data-[state=active]:bg-gray-300"
                        value="Fun"
                      >
                        Fun
                      </SelectItem>
                      <SelectItem
                        className="!text-gray-900 !bg-gray-100 !hover:bg-gray-200 !focus:bg-gray-200 !data-[state=active]:bg-gray-300"
                        value="Active"
                      >
                        Active
                      </SelectItem>
                      <SelectItem
                        className="!text-gray-900 !bg-gray-100 !hover:bg-gray-200 !focus:bg-gray-200 !data-[state=active]:bg-gray-300"
                        value="Normal"
                      >
                        Normal
                      </SelectItem>
                      <SelectItem
                        className="!text-gray-900 !bg-gray-100 !hover:bg-gray-200 !focus:bg-gray-200 !data-[state=active]:bg-gray-300"
                        value="Duo"
                      >
                        Duo
                      </SelectItem>
                      <SelectItem
                        className="!text-gray-900 !bg-gray-100 !hover:bg-gray-200 !focus:bg-gray-200 !data-[state=active]:bg-gray-300"
                        value="Rejection"
                      >
                        Rejection
                      </SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
          <div className="container overflow-auto max-h-60">
            <CompletedTaskList filter={filter} />
          </div>
          <div className="text-xl font-semibold text-white pt-3">
            Opted Out Tasks
          </div>
          <div className="container overflow-auto min-h-40 max-h-60">
            <OptOutList />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Task;
