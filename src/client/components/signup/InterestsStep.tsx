import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';

function InterestsStep({ initialData, onSubmit, onBack }) {
  const [interests, setInterests] = useState([]);
  const [selectedInterests, setSelectedInterests] = useState(initialData || []);

  const addToSelectedInterests = (value) => {
    setSelectedInterests([...selectedInterests, value]);
    setInterests(interests.filter((interest) => interest !== value));
  };

  const removeSelectedInterests = (value) => {
    setSelectedInterests(
      selectedInterests.filter((interest) => interest !== value)
    );
    setInterests([...interests, value]);
  };

  useEffect(() => {
    axios
      .get('api/signup/interests')
      .then((interestNames) => {
        setInterests([...interests, ...interestNames.data]);
      })
      .catch((err) => {
        console.error('error', err);
      });
  }, []);

  const handleContinue = () => {
    onSubmit(selectedInterests);
  };

  return (
    <div className="flex-1">
      <CardHeader>
        <CardTitle className="text-xl font-bold bg-gradient-to-r from-yellow-500 via-orange-500 to-pink-500 bg-clip-text text-transparent">
          Select Your Interests
        </CardTitle>
        <CardDescription className="text-gray-400">
          Choose interests to connect with like-minded people.
        </CardDescription>
      </CardHeader>

      <CardContent>
        <div className="space-y-4">
          <div>
            <Label className="text-gray-200 mb-2 block">
              Available Interests
            </Label>
            <div className="grid grid-cols-3 gap-2">
              {interests.map((interest, index) => (
                <Button
                  key={`interest-${index}`}
                  onClick={() => addToSelectedInterests(interest)}
                  type="button"
                  className="w-full bg-gradient-to-r from-yellow-500/20 via-orange-500/20 to-pink-500/20 border border-orange-500/30 hover:from-yellow-500/30 hover:via-orange-500/30 hover:to-pink-500/30"
                >
                  {interest}
                </Button>
              ))}
            </div>
          </div>

          <div>
            <Label className="text-gray-200 mb-2 block">
              Selected Interests
            </Label>
            <div className="grid grid-cols-3 gap-2">
              {selectedInterests.map((interest, index) => (
                <Button
                  key={`selected-${index}`}
                  name="selectedInterest"
                  onClick={() => removeSelectedInterests(interest)}
                  type="button"
                  className="w-full bg-gradient-to-r from-yellow-500/40 via-orange-500/40 to-pink-500/40 border border-orange-500/50 hover:from-yellow-500/50 hover:via-orange-500/50 hover:to-pink-500/50"
                >
                  {interest}
                </Button>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-2 mt-6">
            <Button
              onClick={handleContinue}
              className="w-full bg-gradient-to-r from-yellow-500 via-orange-500 to-pink-500 text-white font-semibold hover:from-yellow-600 hover:via-orange-600 hover:to-pink-600"
            >
              Continue to Avatar Creation
            </Button>
            <Button
              onClick={onBack}
              className="w-full bg-gradient-to-r from-yellow-500/20 via-orange-500/20 to-pink-500/20 border border-orange-500/30 hover:from-yellow-500/30 hover:via-orange-500/30 hover:to-pink-500/30"
            >
              Go Back
            </Button>
          </div>
        </div>
      </CardContent>
    </div>
  );
}

export default InterestsStep;
