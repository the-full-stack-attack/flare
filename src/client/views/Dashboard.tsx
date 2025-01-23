import React from 'react';
import TaskDisplay from '../components/tasks/TaskDisplay';

function Dashboard() {
  return (
    <div>
      <TaskDisplay />
      <h4>Hello Stanky, you have reached the dashboard.</h4>
    </div>
  );
}

export default Dashboard;
