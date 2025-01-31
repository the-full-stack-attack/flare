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
    <div>
      <div>
        <p>{`You completed ${last_week_task_count} tasks last week`}</p>
      </div>
      <div>
        <p>{`You've completed ${weekly_task_count} tasks so far this week`}</p>
      </div>
      {user.current_task_id ? <TaskDisplay task={task} /> : <ChooseTask />}
      <CompletedTaskList />
      <br />
      <OptOutList />
    </div>
  );
}

export default Task;
