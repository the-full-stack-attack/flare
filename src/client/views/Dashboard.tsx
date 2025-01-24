import React, { useEffect, useState } from 'react';
import axios from 'axios';
import TaskDisplay from '../components/tasks/TaskDisplay';
import ChooseTask from '../components/tasks/ChooseTask';

function Dashboard() {
  const [user, setUser] = useState({});

  useEffect(() => {
    axios
      .get('/api/user')
      .then(({ data }) => {
        console.log(data);
        setUser(data);
      })
      .catch((err: Error) => {
        console.error('Error GETting the user in the dashboard: ', err);
      });
  });
  return (
    <>
      <h4>Hello Stanky, you have reached the dashboard.</h4>
      <TaskDisplay user={user} />
      <ChooseTask user={user} />
    </>
  );
}

export default Dashboard;
