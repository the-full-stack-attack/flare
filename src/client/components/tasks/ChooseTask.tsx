import React from 'react';
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from '../../../components/ui/card';
import TypeButton from './TypeButton';

interface ChooseTaskProps {
  // user: object;
}

const types: string[] = ['Fun', 'Active', 'Normal', 'Duo', 'Rejection Therapy'];
function ChooseTask() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Pick a Task Category</CardTitle>
      </CardHeader>
      <CardContent>
        {types.map((type) => (
          <TypeButton key={type} type={type} />
        ))}
      </CardContent>
    </Card>
  );
}

export default ChooseTask;
