import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import TaskDisplay from '../components/tasks/TaskDisplay';
import ChooseTask from '../components/tasks/ChooseTask';
import { UserContext } from '../contexts/UserContext';

function Dashboard() {
  const { user, setUser } = useContext(UserContext);
  const [task, setTask] = useState();
  return (
    <>
      <h4>Hello Stanky, you have reached the dashboard.</h4>
      <TaskDisplay user={user} />
      <ChooseTask user={user} getUser={getUser} />
    </>
  );
}

export default Dashboard;
