import React, { useEffect, useState } from 'react';

import { Card, CardContent } from '../../../components/ui/card';
import { CarouselItem } from '../../../components/ui/carousel';
import axios from 'axios';

export default function AvatarItem({ picture, index }) {
  const [selectedAlias, setSelectedAlias] = useState('');
  const [color, setColor] = useState('white');
  const [intro, setIntro] = useState('Choose An Alias');

  const chosenAvatar = () => {
    if (color === 'white') {
      setColor('#9CCC65');
      setIntro('You Have Chosen this Alias');
    } else {
      setColor('white');
      setIntro('Choose an Alias');
    }
  };

  useEffect(() => {
    // Set the persons selected alias
  }, [color]);

  return (
    <CarouselItem key={index + Math.random()} onClick={chosenAvatar}>
      <div className="p-1">
        <Card id={picture} style={{ backgroundColor: color }}>
          <CardContent className="flex aspect-square items-center justify-center p-6">
            <Card id={picture}>
              <div>{intro}</div>
            </Card>
            <span className="text-4xl font-semibold">
              <img
                src={picture}
                width={150}
                height={150}
                alt="failed to load"
              />
            </span>
          </CardContent>
        </Card>
      </div>
    </CarouselItem>
  );
}