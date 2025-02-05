import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { UserContext } from '@/client/contexts/UserContext';
import AchievementCard from './AchievementCard';

type FlareType =
  | {
      id: number;
      name: string;
      type: string | void;
      icon: string | null;
      achievement: string;
      milestone: string;
      description: string;
      value: number;
    }
  | {};

function TaskSidebar() {
  const { user, getUser } = useContext(UserContext);
  const [taskFlares, setTaskFlares] = useState<FlareType>({});

  useEffect(() => {
    // GET req to /api/flares/user-flares with a body to tell the server which type of flare
    axios.get('/api/flares/user-flares')
      .then(({ data }) => {
        setTaskFlares(data);
      })
      .catch((err) => {
        console.error('Error getting user task flares:', err);
      })
  }, [])

  return (
    <div>
      <div className="text-2xl">{`Last week task count: ${user.last_week_task_count}`}</div>
      <div className="text-2xl">{`This week task count: ${user.weekly_task_count}`}</div>
    </div>
  );
}

export default TaskSidebar;
