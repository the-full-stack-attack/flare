import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { UserContext } from '../contexts/UserContext';
import TaskDisplay from '../components/tasks/TaskDisplay';
import ChooseTask from '../components/tasks/ChooseTask';
import CompletedTaskList from '../components/tasks/CompletedTaskList';
import OptOutList from '../components/tasks/OptOutList';

function Task() {
  const { user } = useContext(UserContext);
  const { weekly_task_count, last_week_task_count } = user;
  const [task, setTask] = useState<object | null>({});
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
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-pink-900 relative overflow-hidden pt-20 pb-12 text-white">
      <div>
        <p>{`You completed ${last_week_task_count} tasks last week`}</p>
      </div>
      <div>
        <p>{`You've completed ${weekly_task_count} tasks so far this week`}</p>
      </div>
      <div className="sm:w-full md:w-2/3">
        {user.current_task_id ? <TaskDisplay task={task} /> : <ChooseTask />}
        <div className="text-2xl font-semibold">Completed Tasks</div>
        <div className="container overflow-auto border-2 px-1 rounded-lg min-h-40 max-h-80">
          {user.total_tasks_completed ? (
            <CompletedTaskList />
          ) : (
            <center>You Have Not Completed Any Tasks</center>
          )}
        </div>
        <div className="text-2xl font-semibold">Opted Out Tasks</div>
        <div className="container overflow-auto border-2 px-1 rounded-lg min-h-40 max-h-80">
          <OptOutList />
        </div>
      </div>
    </div>
  );
}

export default Task;
