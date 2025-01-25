import React, { useState } from 'react';
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from '../../../components/ui/card';
import TypeButton from './TypeButton';

type ChooseTaskProps = {
  setTask: React.Dispatch<React.SetStateAction<object>>;
};

const types: string[] = ['Fun', 'Active', 'Normal', 'Duo', 'Rejection Therapy'];
function ChooseTask({ setTask }: ChooseTaskProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Pick a Task Category</CardTitle>
      </CardHeader>
      <CardContent>
        {types.map((type) => (
          <TypeButton key={type} type={type} setTask={setTask} />
        ))}
      </CardContent>
    </Card>
  );
}

export default ChooseTask;
