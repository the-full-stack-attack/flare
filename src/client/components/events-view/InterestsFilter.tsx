import React, { useState, useCallback, useEffect } from 'react';
import axios from 'axios';

type InterestsFilterProps = {
  interestsFilter: string[];
  handleSetInterestsFilter: (ints: string[]) => void;
};

function InterestsFilter({ interestsFilter, handleSetInterestsFilter }: InterestsFilterProps) {
  const [interestsList, setInterestsList] = useState<string[]>([]);

  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);

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

  useEffect(() => {
    setSelectedInterests(interestsFilter);
  }, [interestsFilter]);

  return (
    <div className="container mx-auto px-4 mt-4">
      <p className="text-gray-200">
        Interests Filter
      </p>
    </div>
  );
}

export default InterestsFilter;
