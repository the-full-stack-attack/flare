import React, { useState, useCallback, useEffect } from 'react';
import axios from 'axios';

import { toast } from 'sonner';

import { Button } from '@/components/ui/button';

type ChangeEvent = React.ChangeEvent<HTMLInputElement>;

type InterestsFilterProps = {
  interestsFilter: string[];
  handleSetInterestsFilter: (ints: string[]) => void;
};

function InterestsFilter({ interestsFilter, handleSetInterestsFilter }: InterestsFilterProps) {
  const [interestsList, setInterestsList] = useState<string[]>([]);

  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);

  const [changeInterestsFilter, setChangeInterestsFilter] = useState<boolean>(false);

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

  const handleCheckboxChange = ({ target }: ChangeEvent) => {
    const interestName = target.value;
    const isChecked = target.checked;

    if (isChecked) {
      setSelectedInterests([...selectedInterests, interestName]);
    } else {
      setSelectedInterests(selectedInterests.filter((int) => int !== interestName));
    }
  };

  const handleChangeInterestsFilterForm = () => {
    setChangeInterestsFilter(!changeInterestsFilter);
  };

  const handleSetInterestsFilterClick = () => {
    selectedInterests.length === 0 ? toast('Interests filter cleared.') : toast('Set interests filter.');
    handleSetInterestsFilter(selectedInterests);
    setChangeInterestsFilter(false);
  };

  const handleClearInterestsFilter = () => {
    toast('Interests filter cleared.');
    handleSetInterestsFilter([]);
    setChangeInterestsFilter(false);
  };

  useEffect(() => {
    getInterests();
  }, []);

  useEffect(() => {
    setSelectedInterests(interestsFilter);
  }, [interestsFilter]);

  return (
      <div className="container mx-auto px-4 mt-4">
        {
          changeInterestsFilter ? (
            <div className="grid grid-cols-2 gap-4 ">
              <div>
                <Button
                  className={buttonColor}
                  onClick={handleSetInterestsFilterClick}
                >
                  Set Filter
                </Button>
              </div>
              <div>
                { interestsFilter.length === 0 ? (
                    <Button
                      className={buttonColor}
                      onClick={handleChangeInterestsFilterForm}
                    >
                      Cancel
                    </Button>
                  ) : (
                    <Button
                      className={buttonColor}
                      onClick={handleClearInterestsFilter}
                    >
                      Clear
                    </Button>
                  )
                }
              </div>
            </div>
          ) : (
            <Button
              className={buttonColor}
              onClick={handleChangeInterestsFilterForm}
            >
              Select Interests
            </Button>
          )
        }
        {
          changeInterestsFilter ? interestsList.map((int) => (
            <div key={int}>
              <label className="text-gray-200">
                <input
                  type="checkbox"
                  value={int}
                  checked={selectedInterests.includes(int)}
                  onChange={handleCheckboxChange}
                />
                {` ${int}`}
              </label>
            </div>
          )) : (
            <p className="text-gray-200 mt-2">
              {interestsFilter.length === 0 ? '' : `Showing Interests: ${interestsFilter.join(', ')}`}
            </p>
          )
        }
      </div>
    );
}

export default InterestsFilter;
