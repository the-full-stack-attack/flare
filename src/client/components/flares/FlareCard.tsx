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
            <DialogDescription className="flex-grow">{flare.notification_message}</DialogDescription>
          </div>
          <DialogClose asChild>
            <button
              className="px-4 py-2 rounded-lg w-20 text-center bg-gradient-to-r from-purple-500 to-pink-500 text-white font-medium
                    hover:from-purple-600 hover:to-pink-600 transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] ml-auto"
            >
              Close
            </button>
          </DialogClose>
        </DialogContent>
      </Dialog>
  );
}

export default FlareCard;
