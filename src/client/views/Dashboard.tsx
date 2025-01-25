import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import TaskDisplay from '../components/tasks/TaskDisplay';
import ChooseTask from '../components/tasks/ChooseTask';
import { UserContext } from '../contexts/UserContext';

function Dashboard() {
  const { user } = useContext(UserContext);
  const [task, setTask] = useState({});
  // Function to set the task in state
  const getTask = (): void => {
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
  };
  // Use effect will call getTask if there is a change in user state
  useEffect(getTask, [user]);
  return (
    <>
      <h4>Hello Stanky, you have reached the dashboard.</h4>
      <TaskDisplay user={user} />
      <ChooseTask user={user} />
    </>
  );
}

export default Dashboard;
