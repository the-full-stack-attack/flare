import React, { useState } from 'react';

import { Button } from '@/components/ui/button';

import HeadlessDialog from '../general/HeadlessDialog';

type BailButtonProps = {
  patchAttendingEvent: (isAttending: boolean) => void;
  isAttending: boolean;
  eventTitle: string;
};

function ChangeAttendingButton({ patchAttendingEvent, isAttending, eventTitle }: BailButtonProps) {
  const [dialogOpen, setDialogOpen] = useState<boolean>(false);
  
  const warnDrawerButton = 'bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-800 hover:to-orange-800 text-white';

  const successDrawerButton = 'bg-gradient-to-r from-green-600 to-lime-600 hover:from-green-800 hover:to-lime-800 text-white'

  return (
    <>
      <Button
        className={isAttending ? successDrawerButton : warnDrawerButton}
        onClick={() => { setDialogOpen(true); }}
      >
        {isAttending ? 'Re-Attend' : 'Bail'}
      </Button>
      <HeadlessDialog
        open={dialogOpen}
        close={() => { setDialogOpen(false) }}
        title={ isAttending
          ? `Re-Attend the event ${eventTitle}?`
          : `Bail from the event ${eventTitle}?`
        }
        description={ isAttending
          ? `It's important to be a reliable guest. You've bailed on this event already. Are you sure you able to attend the event ${eventTitle}?`
          : `Sometimes plans need to change and that's okay. Are you sure you're unable to go to the event ${eventTitle}?`
        }
        action={() => { patchAttendingEvent(isAttending) }}
        actionButtonName={isAttending ? 'Re-Attend' : 'Bail'}
        type={isAttending ? 'good' : 'bad'}
      />
    </>
  );
}

export default ChangeAttendingButton;
