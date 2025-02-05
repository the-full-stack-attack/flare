import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { UserContext } from '@/client/contexts/UserContext';

type FlareType =
  | {
      id: number;
      name: string;
      icon: string | null;
      achievement: string;
      value: number;
      type: string | void;
    }
  | {};

function TaskSidebar() {
  const { user, getUser } = useContext(UserContext);
  const [flares, setFlare] = useState<FlareType>({});

  return (
    <div>
      <div>
        <p>{`This week: ${user.last_week_task_count} tasks last week`}</p>
      </div>
      <div>
        <p>{`Last week: ${user.weekly_task_count}`}</p>
      </div>
    </div>
  );
}
