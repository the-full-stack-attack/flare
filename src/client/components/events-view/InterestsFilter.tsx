import React, { useState, useCallback, useEffect } from 'react';
import axios from 'axios';

import { Button } from '@/components/ui/button';

import { Dialog, DialogTrigger } from '@/components/ui/dialog';

import FilterButtonsDialog from './FilterButtonsDialog';

type InterestsFilterProps = {
  interestsFilter: string[];
  handleSetInterestsFilter: (ints: string[]) => void;
};

function InterestsFilter({ interestsFilter, handleSetInterestsFilter }: InterestsFilterProps) {
  const [interestsList, setInterestsList] = useState<string[]>([]);

  const buttonColor = 'bg-gradient-to-r from-yellow-500 via-orange-500 to-pink-500 hover:from-yellow-600 hover:via-orange-600 hover:to-pink-600 text-white px-4 py-4 rounded-xl text-md';

  const getInterests = useCallback(() => {
    axios.get('/api/signup/interests')
      .then(({ data }) => {
        setInterestsList(data);
      })
      .catch((error: unknown) => {
        console.error('Failed to getInterests:', error);
      });
  }, []);

  useEffect(() => {
    getInterests();
  }, []);

  return (
    <div className="container mx-auto px-4 mt-4">
      <Dialog>
        <DialogTrigger asChild>
          <Button
            className={buttonColor}
          >
            Select Interests
          </Button>
        </DialogTrigger>
        <FilterButtonsDialog
          choicesList={interestsList}
          initialSelection={interestsFilter}
          itemType="Interest"
          title="Filter by Interest"
          description="Choose which interests you want to filter upcoming events by."
          setFilter={handleSetInterestsFilter}
        />
      </Dialog>
    </div>
  );
}

export default InterestsFilter;
