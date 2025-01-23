import React from 'react';
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from '../../../components/ui/card';

// Define the props interface
interface TaskDisplayProps {
  // user: object;
}
const types: String[] = ['Action', 'Fun', 'Duo', 'Normal', 'Rejection Therapy'];
function TaskDisplay() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Current Task:</CardTitle>
      </CardHeader>
    </Card>
  );
}

export default TaskDisplay;
