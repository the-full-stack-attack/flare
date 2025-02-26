import React from 'react';
import {
  Dialog,
  DialogTrigger,
  DialogClose,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from '../../../components/ui/dialog';

type FlareCardType = {
  flare: FlareType;
  index: number;
};

type FlareType = {
  id: number;
  name: string;
  type: string | void;
  icon: string;
  achievement: string;
  milestone: string;
  description: string;
  notification_message: string;
  card_message: string;
  value: number;
};

function FlareCard({ flare, index }: FlareCardType) {
  return (
      <Dialog>
        <DialogTrigger asChild>
          <div className="p-6">
            <div>
              <img className="rounded-full" src={flare.icon} />
              <h3 className="font-bold my-2 bg-gradient-to-r from-yellow-500 via-orange-500 to-pink-500 bg-clip-text text-transparent text-center">
                {flare.name}
              </h3>
            </div>
          </div>
        </DialogTrigger>
        <DialogContent>
          <DialogTitle>{flare.name}</DialogTitle>
          <div className="flex items-start space-x-4">
            <img className="rounded-full w-24 h-24 object-cover" src={flare.icon} />
            <DialogDescription className="flex-grow">{flare.card_message}</DialogDescription>
          </div>
          <DialogClose asChild>
          </DialogClose>
        </DialogContent>
      </Dialog>
  );
}

export default FlareCard;
