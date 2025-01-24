import React from 'react';
import { Button } from '../../../components/ui/button';

type TypeButtonProps = {
  key: string;
  type: string;
};
function TypeButton({ type }: TypeButtonProps) {
  return <Button>{type}</Button>;
}

export default TypeButton;
