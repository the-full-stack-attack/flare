import React from 'react';
import axios from 'axios';

import {
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '../../../components/ui/dialog';
import { RadioGroup, RadioGroupItem } from '../../../components/ui/radio-group';
import { Button } from '../../../components/ui/button';
import { Input } from '../../../components/ui/input';
import { Label } from '../../../components/ui/label';
import { Textarea } from '../../../components/ui/textarea';

type ScheduleTextDialogProps = {
  eventId: number;
  startTime: Date;
  endTime: Date;
};

function ScheduleTextDialog({ eventId, startTime, endTime }: ScheduleTextDialogProps) {
  return (
    <DialogContent className="sm:max-w-[425px]">
      <DialogHeader>
        <DialogTitle>Schedule a Check-In Text</DialogTitle>
        <DialogDescription>
          Schedule a text to be sent during the event. This is a way to provide
          an out if you need to leave.
        </DialogDescription>
        <div className="grid gap-4 py-4">
          <Label htmlFor="Send Time" className="text-left">
            Send a Text In
          </Label>
          <RadioGroup className="grid grid-cols-3 gap-2 items-center">
            <div>
              <RadioGroupItem
                id="30-minutes"
                value="30-minutes"
                onClick={(e) => {
                  console.log(e.target.value);
                }}
              />
              <Label htmlFor="30-minutes">30 minutes</Label>
            </div>
            <div>
              <RadioGroupItem
                id="1-hour"
                value="1-hour"
                onClick={(e) => {
                  console.log(e.target.value);
                }}
              />
              <Label htmlFor="1-hour">1 hour</Label>
            </div>
            <div>
              <RadioGroupItem
                id="2-hours"
                value="2-hours"
                onClick={(e) => {
                  console.log(e.target.value);
                }}
              />
              <Label htmlFor="2-hours">2 hours</Label>
            </div>
          </RadioGroup>
        </div>
        <div className="grid gap-4 py-4">
          <Label htmlFor="message" className="text-left">
            Custom Message
          </Label>
          <Textarea placeholder="Optional: Create a custom message..." />
        </div>
      </DialogHeader>
    </DialogContent>
  );
}

export default ScheduleTextDialog;
