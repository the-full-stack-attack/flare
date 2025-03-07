import React, {
  useEffect,
  useState,
  useCallback,
  useContext,
  useRef,
  ref,
  useId,
} from 'react';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import {
  Card,
  CardContent,
  CardDescription,
  CardTitle,
  CardFooter,
} from '@/components/ui/card';
import { Button } from '../../../components/ui/button';
import Tutorial_1 from '../../assets/images/Tutorial_1.png';
import Tutorial_2 from '../../assets/images/Tutorial_2.png';
import Tutorial_3 from '../../assets/images/Tutorial_3.png';

type FlamiliarTutorialProps = {
  toggleQuit: () => void;
};

const FlamiliarTutorial = ({toggleQuit}: FlamiliarTutorialProps) => {

  return (
    <div>
    <div className="flex justify-center items-center mt-2">
      <Button
        className="bg-gradient-to-r from-yellow-400 via-orange-500 to-pink-600 text-grey-700"
        onClick={toggleQuit}
      >
        Get Flamiliar!
      </Button>
    </div>
    <div className="flex flex-col gap-2 items-center">
      <h1 className="text-white font-bold">TUTORIAL</h1>
      <div>
        <Carousel className="w-full max-w-xs sm:max-w-sm md:max-w-md">
          <CarouselContent>
            <CarouselItem className="">
              <Card className="bg-slate-950 md:h-full">
                <CardTitle className="flex justify-center text-orange-500 font-bold text-4xl p-4">
                  Step 1
                </CardTitle>
                <CardContent className="flex justify-center">
                  <img
                    className="flex justify-center"
                    src={Tutorial_1}
                  ></img>
                </CardContent>
                <CardDescription className="flex justify-center font-semibold text-orange-500 text-3xl p-6">
                  When Ready, Click "Get Flamiliar!"
                </CardDescription>
                <CardFooter className="text-xs font-light text-gray-200 flex justify-center">
                  <em>
                    Clicking 'get flamiliar' at the bottom of the screen
                    prompts the A.I. to generate a prompt based on our
                    alagorithm!
                  </em>
                </CardFooter>
              </Card>
            </CarouselItem>
            <CarouselItem className="">
              <Card className="bg-slate-950 md:h-full">
                <CardTitle className="flex justify-center text-orange-500 font-bold text-4xl p-4">
                  Step 2
                </CardTitle>
                <CardContent className="flex justify-center">
                  <img src={Tutorial_2}></img>
                </CardContent>
                <CardDescription className="flex justify-center font-semibold text-orange-500 text-3xl p-6">
                  Be Funny!
                </CardDescription>
                <CardFooter className="text-xs font-light text-gray-200 flex justify-center">
                  <em>
                    The A.I. bartender will give you an unfinished
                    sentence. Find a way to complete the sentence... oh,
                    and be funny!
                  </em>
                </CardFooter>
              </Card>
            </CarouselItem>
            <CarouselItem className="">
              <Card className="bg-slate-950 md:h-full">
                <CardTitle className="flex justify-center text-orange-500 font-bold text-4xl p-4">
                  Step 3
                </CardTitle>
                <CardContent className="flex justify-center">
                  <img
                    className="flex justify-center"
                    src={Tutorial_3}
                  ></img>
                </CardContent>
                <CardDescription className="flex justify-center font-semibold text-orange-500 text-3xl p-6">
                  Vote!
                </CardDescription>
                <CardFooter className="text-xs font-light text-gray-200 flex justify-center">
                  <em>
                    Vote for the player who has the funniest response...
                    You can only vote ONCE! P.S. You CANNOT vote for
                    yourself you Narcissist!!
                  </em>
                </CardFooter>
              </Card>
            </CarouselItem>

            <CarouselItem className="">
              <Card className="bg-slate-950 h-full flex flex-col justify-center">
                <CardDescription className="flex justify-center font-semibold text-orange-500 items-center p-6">
                  With the power invested in me, I now pronounce you READY
                  to GET FLAMILIAR!
                </CardDescription>
                <CardFooter className="text-xs font-light text-gray-200 flex justify-center">
                  <em>Click Get Flamiliar to start the game</em>
                </CardFooter>
                <div className="flex justify-center items-center mt-2">
                  <Button
                    className="bg-gradient-to-r from-yellow-400 via-orange-500 to-pink-600 text-grey-700"
                    onClick={toggleQuit}
                  >
                    Get Flamiliar!
                  </Button>
                </div>
              </Card>
            </CarouselItem>
          </CarouselContent>
          <CarouselPrevious className="bg-yellow-500" />
          <CarouselNext className="bg-yellow-500" />
        </Carousel>
      </div>
    </div>
  </div>
  )
}

export default FlamiliarTutorial;