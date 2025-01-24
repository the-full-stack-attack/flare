import React, { useState } from 'react';
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from '../../../components/ui/card';
import TypeButton from './TypeButton';

interface ChooseTaskProps {
  user: object;
  getUser: any;
}

const types: string[] = ['Fun', 'Active', 'Normal', 'Duo', 'Rejection Therapy'];
function ChooseTask({ user, getUser }: ChooseTaskProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Pick a Task Category</CardTitle>
      </CardHeader>
      <CardContent>
        {types.map((type) => (
          <TypeButton key={type} type={type} user={user} getUser={getUser} />
        ))}
      </CardContent>
    </Card>
  );
}

export default ChooseTask;
