import React from 'react';

import {
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '../../../components/ui/dialog';

type ScheduleTextDialogProps = { eventId: number };

function ScheduleTextDialog({ eventId }: ScheduleTextDialogProps) {
  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Boo!</DialogTitle>
      </DialogHeader>
    </DialogContent>
  );
}

export default ScheduleTextDialog;
