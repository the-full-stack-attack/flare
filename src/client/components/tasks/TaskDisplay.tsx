import React from 'react';
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from '../../../components/ui/card';

// Define the props interface
interface TaskDisplayProps {
  user: object;
}
function TaskDisplay({ user }: TaskDisplayProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Current Task:</CardTitle>
      </CardHeader>
    </Card>
  );
}

export default TaskDisplay;
