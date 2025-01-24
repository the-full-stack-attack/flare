import React, { useEffect, useState } from 'react';
import axios from 'axios';
import TaskDisplay from '../components/tasks/TaskDisplay';
import ChooseTask from '../components/tasks/ChooseTask';

type User = {
  id: number;
  current_task_id: number;
};
type SetUser = (user: User) => User;

function Dashboard() {
  const [user, setUser]: [User, Function] = useState({
    id: 0,
    current_task_id: 0,
  });

  useEffect(() => {
    axios
      .get('/api/user')
      .then(({ data }) => {
        setUser(data);
      })
      .catch((err: Error) => {
        console.error('Error GETting the user in the dashboard: ', err);
      });
  }, []);
  return (
    <>
      <h4>Hello Stanky, you have reached the dashboard.</h4>
      <TaskDisplay user={user} />
      <ChooseTask user={user} />
    </>
  );
}

export default Dashboard;
