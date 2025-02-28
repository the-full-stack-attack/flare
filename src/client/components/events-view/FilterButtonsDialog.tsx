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
  initialSelection: string[];
  title: string;
  description: string;
  setFilter: (items: string[]) => void;
};

function FilterButtonsDialog({
  choicesList,
  initialSelection,
  title,
  description,
  setFilter,
}: FilterButtonsDialogProps) {
  const [selectedList, setSelectedList] = useState<string[]>(initialSelection);

  const notSelectedButtonStyle = 'w-full bg-gradient-to-r from-yellow-500/20 via-orange-500/20 to-pink-500/20 border border-orange-500/30 hover:from-yellow-500/30 hover:via-orange-500/30 hover:to-pink-500/30'
  const selectedButtonStyle = 'w-full bg-gradient-to-r from-yellow-500/40 via-orange-500/40 to-pink-500/40 border border-orange-500/50 hover:from-yellow-500/50 hover:via-orange-500/50 hover:to-pink-500/50';

  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>{title}</DialogTitle>
        <DialogDescription>{description}</DialogDescription>
      </DialogHeader>
      <div className="space-y-4">
        <div>
          <Label className="text-gray-200 mb-2 block">
            Available
          </Label>
          <div className="grid grid-cols-3 gap-2">
            {
              choicesList
                .filter(item => !selectedList.includes(item))
                .map((item) => (
                  <Button
                    key={item}
                    className={notSelectedButtonStyle}
                  >
                    {item}
                  </Button>
                ))
            }
          </div>
        </div>
        <div>
          <Label className="text-gray-200 mb-2 block">
            Chosen
          </Label>
          <div className="grid grid-cols-3 gap-2">
            {
              selectedList
                .map((item) => (
                  <Button
                    key={item}
                    className={selectedButtonStyle}
                  >
                    {item}
                  </Button>
                ))
            }
          </div>
        </div>
      </div>
      <DialogFooter>
        <DialogClose asChild>
          <Button>
            Close
          </Button>
        </DialogClose>
      </DialogFooter>
    </DialogContent>
  );
}

export default FilterButtonsDialog;
