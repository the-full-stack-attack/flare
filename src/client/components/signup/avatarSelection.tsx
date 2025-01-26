import * as React from 'react';

import { Card, CardContent } from '../../../components/ui/card';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '../../../components/ui/carousel';

import aristocrat_01 from '../../assets/images/aristocrat_01_1.png';
import aristocrat_02 from '../../assets/images/aristocrat_02_1.png';
import dude from '../../assets/images/Dude_Monster.png';
import lady1 from '../../assets/images/FemaleWalkFront01.gif';
import lady2 from '../../assets/images/FemaleWalkFront02.gif';
import lady3 from '../../assets/images/FemaleWalkFront03.gif';
import guy1 from '../../assets/images/MaleWalkFront01.gif';
import guy2 from '../../assets/images/MaleWalkFront03.gif';
import owl from '../../assets/images/Owlet_Monster.png';
import pink from '../../assets/images/Pink_Monster.png';

export function AvatarSelection() {
  const allCharacters = [
    aristocrat_01,
    aristocrat_02,
    lady1,
    lady2,
    lady3,
    guy1,
    guy2,
    owl,
    pink,
    dude,
  ];

  return (
    <Carousel className="w-full max-w-xs">
      <CarouselContent>
        {allCharacters.map((_, index) => (
          <CarouselItem key={index}>
            <div className="p-1">
              <Card>
                <CardContent className="flex aspect-square items-center justify-center p-6">
                  <text>"Choose an Avatar"</text>
                  <span className="text-4xl font-semibold"><img src={_} width={150} height={150}/></span>
                </CardContent>
              </Card>
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious />
      <CarouselNext />
    </Carousel>
  );
}
