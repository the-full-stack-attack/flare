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
  itemType: string;
  title: string;
  description: string;
  setFilter: (items: string[]) => void;
};

function FilterButtonsDialog({
  choicesList,
  initialSelection,
  itemType,
  title,
  description,
  setFilter,
}: FilterButtonsDialogProps) {
  const [selectedList, setSelectedList] = useState<string[]>(initialSelection);

  const notSelectedButtonStyle = 'text-xs sm:text-base w-full bg-gradient-to-r from-yellow-500/20 via-orange-500/20 to-pink-500/20 border border-orange-500/30 hover:from-yellow-500/30 hover:via-orange-500/30 hover:to-pink-500/30'
  const selectedButtonStyle = 'text-xs sm:text-base w-full bg-gradient-to-r from-yellow-500/40 via-orange-500/40 to-pink-500/40 border border-orange-500/50 hover:from-yellow-500/50 hover:via-orange-500/50 hover:to-pink-500/50';
  const footerButtonStyle = 'bg-gradient-to-r from-yellow-500/80 via-orange-500/80 to-pink-500/80 border-orange-500/90 hover:from-yellow-600/90 hover:via-orange-600/90 hover:to-pink-600/90 text-white px-4 py-4 rounded-xl text-base';


  const handleSelect = (item: string) => {
    const newList: string[] = [...selectedList, item];
    setSelectedList(newList);
  };

  const handleRemove = (item: string) => {
    const newList: string[] = selectedList.filter(elem => elem !== item);
    setSelectedList(newList);
  };

  return (
    <DialogContent className="bg-black/80 rounded-xl border-transparent">
      <DialogHeader>
        <DialogTitle className="text-gray-200 text-xl">{title}</DialogTitle>
        <DialogDescription className="text-gray-400 text-base">{description}</DialogDescription>
      </DialogHeader>
      <div className="space-y-4">
        <div>
          <Label className="text-gray-200 mb-2 block text-lg">
            {`Add ${itemType}`}
          </Label>
          <div className="grid grid-cols-2 gap-2">
            {
              choicesList
                .filter(item => !selectedList.includes(item))
                .map((item) => (
                  <Button
                    key={item}
                    className={notSelectedButtonStyle}
                    onClick={() => handleSelect(item)}
                  >
                    {item}
                  </Button>
                ))
            }
          </div>
        </div>
        <div>
          <Label className="text-gray-200 mb-2 block text-lg">
          {`Current ${itemType} Filter`}
          </Label>
          <div className="grid grid-cols-2 gap-2">
            {
              selectedList.length
              ? selectedList.map((item) => (
                  <Button
                    key={item}
                    className={selectedButtonStyle}
                    onClick={() => handleRemove(item)}
                  >
                    {item}
                  </Button>
                ))
              : <p className="text-center col-span-2 text-gray-400"><em>None</em></p>
            }
          </div>
        </div>
      </div>
      <DialogFooter>
        <DialogClose asChild>
          <Button
            className={footerButtonStyle}
            onClick={() => setFilter(selectedList)}
          >
            Submit
          </Button>
        </DialogClose>
      </DialogFooter>
    </DialogContent>
  );
}

export default FilterButtonsDialog;
