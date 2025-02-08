import React, { useCallback, useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import dayjs from 'dayjs';
import { toast } from 'sonner';

import {
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from '../../../components/ui/dialog';
import { RadioGroup, RadioGroupItem } from '../../../components/ui/radio-group';
import { Button } from '../../../components/ui/button';
import { Label } from '../../../components/ui/label';
import { Textarea } from '../../../components/ui/textarea';

type ScheduleTextDialogProps = {
  eventId: number;
  startTime: Date;
  endTime: Date;
  eventTitle: string;
};

function ScheduleTextDialog({
  eventId,
  startTime,
  endTime,
  eventTitle,
}: ScheduleTextDialogProps) {
  const [sendTime, setSendTime] = useState<string>('');
  const [message, setMessage] = useState<string>('');
  const [newTextMode, setNewTextMode] = useState<boolean>(true);
  const [updateMode, setUpdateMode] = useState<boolean>(false);

  const normalDialogButton = 'bg-gradient-to-r from-gray-700 to-pink-700 hover:from-gray-900 hover:to-pink-900 text-white';

  const warnDialogButton = 'bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-800 hover:to-orange-800 text-white';

  const successDialogButton = 'bg-gradient-to-r from-green-600 to-lime-600 hover:from-green-800 hover:to-lime-800 text-white';

  const { startTimeNum, endTimeNum, now } = useMemo(() => ({
    startTimeNum: new Date(startTime).getTime(),
    endTimeNum: new Date(endTime).getTime(),
    now: Date.now(),
  }), [startTime, endTime]);

  const handleSendTimeSelect = useCallback(({ target }: any) => {
    setSendTime(target.value);
  }, []);

  const handleMessageChange = useCallback(({ target }: any) => {
    setMessage(target.value);
  }, []);

  const getText = useCallback(() => {
    axios
      .get(`/api/text/${eventId}`)
      .then(({ data }) => {
        if (data !== '') {
          setNewTextMode(false);
          setUpdateMode(false);
          setMessage(data.content);
          setSendTime(data.time_from_start);
        } else {
          setNewTextMode(true);
          setUpdateMode(false);
          setMessage('');
          setSendTime('30-minutes');
        }
      })
      .catch((err: unknown) => {
        console.error('Failed to getText:', err);
      });
  }, [eventId]);

  const postPatchText = () => {
    const body: {
      text: {
        content: string;
        event_id: number;
        time_from_start: string;
        send_time?: Date;
      };
    } = {
      text: {
        content: message,
        time_from_start: sendTime,
        event_id: eventId,
      },
    };

    if (message === '') {
      body.text.content = `Are you still having a good time at ${eventTitle}?\nIf you aren't, remember that you don't need to stay.\nIf you are, disregard this message and live your best life!`;
    }

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
    if (updateMode) {
      axios
        .patch(`/api/text/${eventId}`, body)
        .then(getText)
        .catch((err: unknown) => {
          console.error('Failed to patchText:', err);
        });
    } else {
      axios
        .post('/api/text', body)
        .then(getText)
        .catch((err: unknown) => {
          console.error('Failed to postText:', err);
        });
    }
  };

  const handleUpdateModeTrue = () => {
    setUpdateMode(true);
    setNewTextMode(true);
  };

  const deleteText = () => {
    axios
      .delete(`/api/text/${eventId}`)
      .then(getText)
      .catch((err: unknown) => {
        console.error('Failed to deleteText:', err);
      });
  };

  useEffect(() => {
    getText();
  }, [getText]);

  return (
    <DialogContent className="sm:max-w-[425px] bg-gray-600/80 text-white">
      <DialogHeader>
        <DialogTitle>Schedule a Check-In Text</DialogTitle>
        <DialogDescription className="text-gray-200">
          Schedule a text to be sent during the event. This is a way to provide
          an out if you need to leave.
        </DialogDescription>
      </DialogHeader>
      <div className="grid gap-4 py-4">
        <Label htmlFor="Send Time" className="text-left">
          Send a Text In
        </Label>
        <RadioGroup defaultValue={sendTime} disabled={!newTextMode}>
          {
            (
              now < startTimeNum + 1000 * 60 * 30 && endTimeNum - startTimeNum >= 1000 * 60 * 45
            ) ? (
              <div className="flex items-center space-x-2">
                <RadioGroupItem
                  id="30-minutes"
                  value="30-minutes"
                  className="focus:bg-white text-white"
                  onClick={handleSendTimeSelect}
                />
                <Label htmlFor="30-minutes">{`30 minutes [Sends at ${dayjs(new Date(startTimeNum + 1000 * 60 * 30)).format('h:mm A')}]`}</Label>
              </div>
            ) : null
          }
          {
            (
              now < startTimeNum + 1000 * 60 * 60 * 1 && endTimeNum - startTimeNum >= 1000 * 60 * 60 * 1.25
            ) ? (
              <div className="flex items-center space-x-2">
                <RadioGroupItem
                  id="1-hour"
                  value="1-hour"
                  className="focus:bg-white text-white"
                  onClick={handleSendTimeSelect}
                />
                <Label htmlFor="1-hour">{`1 hour [Sends at ${dayjs(new Date(startTimeNum + 1000 * 60 * 60 * 1)).format('h:mm A')}]`}</Label>
              </div>
            ) : null
          }
          {
            (
              now < startTimeNum + 1000 * 60 * 60 * 2 && endTimeNum - startTimeNum >= 1000 * 60 * 60 * 2.25
            ) ? (
              <div className="flex items-center space-x-2">
                <RadioGroupItem
                  id="2-hours"
                  value="2-hours"
                  className="focus:bg-white text-white"
                  onClick={handleSendTimeSelect}
                />
                <Label htmlFor="2-hours">{`2 hours [Sends at ${dayjs(new Date(startTimeNum + 1000 * 60 * 60 * 2)).format('h:mm A')}]`}</Label>
              </div>
            ) : null
          }
        </RadioGroup>
      </div>
      <div className="grid gap-4 py-4">
        <Label htmlFor="message" className="text-left">
          Custom Message
        </Label>
        <Textarea
          placeholder="Optional: Create a custom message..."
          readOnly={!newTextMode}
          value={message}
          onChange={handleMessageChange}
        />
      </div>
      <DialogFooter>
        {newTextMode ? (
          <div className="grid grid-cols-2 gap-2">
            <DialogClose asChild>
              <Button type="submit" className={successDialogButton} onClick={() => {
                postPatchText();
                updateMode ? toast('Scheduled text has been updated.') : toast('A text message has been scheduled.');
              }}>
                Schedule Text
              </Button>
            </DialogClose>
            {updateMode ? <Button className={normalDialogButton} onClick={getText}>Cancel</Button> : null}
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-2">
            <Button className={normalDialogButton} onClick={handleUpdateModeTrue}>Update</Button>
            <DialogClose asChild>
              <Button className={warnDialogButton} onClick={() => {
                deleteText();
                toast('Scheduled text will no longer be sent.')
              }}>Delete</Button>
            </DialogClose>
          </div>
        )}
      </DialogFooter>
    </DialogContent>
  );
}

export default ScheduleTextDialog;
