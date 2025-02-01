import React, { useCallback, useState } from 'react';
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
import { Label } from '../../../components/ui/label';
import { Textarea } from '../../../components/ui/textarea';

type ScheduleTextDialogProps = {
  eventId: number;
  startTime: Date;
  endTime: Date;
};

function ScheduleTextDialog({
  eventId,
  startTime,
  endTime,
}: ScheduleTextDialogProps) {
  const [sendTime, setSendTime] = useState<string>('30-minutes');
  const [message, setMessage] = useState<string>('');

  const handleSendTimeSelect = useCallback(({ target }: any) => {
    setSendTime(target.value);
  }, []);

  const handleMessageChange = useCallback(({ target }: any) => {
    setMessage(target.value);
  }, []);

  const postScheduledText = () => {
    const body: {
      text: {
        content: string;
        event_id: number;
        send_time?: Date;
      };
    } = {
      text: {
        content: message,
        event_id: eventId,
      },
    };
    if (sendTime === '30-minutes') {
      body.text.send_time = new Date(
        new Date(startTime).getTime() + 1000 * 60 * 30
      );
    }

    if (sendTime === '1-hour') {
      body.text.send_time = new Date(
        new Date(startTime).getTime() + 1000 * 60 * 60 * 1
      );
    }

    if (sendTime === '2-hours') {
      body.text.send_time = new Date(
        new Date(startTime).getTime() + 1000 * 60 * 60 * 2
      );
    }
    axios
      .post('/api/text', body)
      .then(() => {
        console.log('Text scheduled');
      })
      .catch((err: unknown) => {
        console.error('Failed to postScheduledText:', err);
      });
  };

  return (
    <DialogContent className="sm:max-w-[425px]">
      <DialogHeader>
        <DialogTitle>Schedule a Check-In Text</DialogTitle>
        <DialogDescription>
          Schedule a text to be sent during the event. This is a way to provide
          an out if you need to leave.
        </DialogDescription>
      </DialogHeader>
      <div className="grid gap-4 py-4">
        <Label htmlFor="Send Time" className="text-left">
          Send a Text In
        </Label>
        <RadioGroup defaultValue={sendTime}>
          <div className="flex items-center space-x-2">
            <RadioGroupItem
              id="30-minutes"
              value="30-minutes"
              onClick={handleSendTimeSelect}
            />
            <Label htmlFor="30-minutes">30 minutes</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem
              id="1-hour"
              value="1-hour"
              onClick={handleSendTimeSelect}
            />
            <Label htmlFor="1-hour">1 hour</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem
              id="2-hours"
              value="2-hours"
              onClick={handleSendTimeSelect}
            />
            <Label htmlFor="2-hours">2 hours</Label>
          </div>
        </RadioGroup>
      </div>
      <div className="grid gap-4 py-4">
        <Label htmlFor="message" className="text-left">
          Custom Message
        </Label>
        <Textarea
          placeholder="Optional: Create a custom message..."
          value={message}
          onChange={handleMessageChange}
        />
      </div>
      <DialogFooter>
        <Button type="submit" onClick={postScheduledText}>
          Schedule Text
        </Button>
      </DialogFooter>
    </DialogContent>
  );
}

export default ScheduleTextDialog;
