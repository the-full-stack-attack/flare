import React, { useState } from 'react';

import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

type FilterButtonsDialogProps = {
  choicesList: string[];
  title: string;
  description: string;
  setFilter: () => void;
};

function FilterButtonsDialog({ choicesList, title, description, setFilter }: FilterButtonsDialogProps) {
  return (
    <div>
      Filter Buttons
    </div>
  );
}

export default FilterButtonsDialog;
