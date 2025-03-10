import React, { useMemo } from 'react';
import {
  Button,
  Dialog,
  DialogBackdrop,
  DialogPanel,
  DialogTitle,
} from '@headlessui/react';

import TTSButton from '../a11y/TTSButton';

type HeadlessDialogProps = {
  open: boolean;
  close: () => void;
  title: string;
  description: string;
  action: () => void;
  actionButtonName: string;
  type: 'good' | 'bad' | 'neutral';
}

function HeadlessDialog({
  open,
  close,
  title,
  description,
  action,
  actionButtonName,
  type,
}: HeadlessDialogProps) {
  const neutralButtonStyle = "inline-flex items-center gap-2 rounded-md bg-gray-700 py-1.5 px-3 text-sm/6 font-semibold text-white shadow-inner shadow-white/10 focus:outline-none data-[hover]:bg-gray-600 data-[focus]:outline-1 data-[focus]:outline-white data-[open]:bg-gray-700";

  const goodButtonStyle = "inline-flex items-center gap-2 rounded-md bg-green-700 py-1.5 px-3 text-sm/6 font-semibold text-white shadow-inner shadow-white/10 focus:outline-none data-[hover]:bg-green-600 data-[focus]:outline-1 data-[focus]:outline-white data-[open]:bg-green-700";

  const badButtonStyle = "inline-flex items-center gap-2 rounded-md bg-red-700 py-1.5 px-3 text-sm/6 font-semibold text-white shadow-inner shadow-white/10 focus:outline-none data-[hover]:bg-red-600 data-[focus]:outline-1 data-[focus]:outline-white data-[open]:bg-red-700";

  const actionButtonStyle = useMemo(() => {
    if (type === 'good') {
      return goodButtonStyle;
    }
    else if (type === 'bad') {
      return badButtonStyle;
    } 
    else {
      return neutralButtonStyle;
    }
  }, [type]);

  return (
    <Dialog
      open={open}
      as="div"
      className="relative backdrop-blur-xs z-50 focus:outline-none m-4"
      onClose={close}
    >
      <DialogBackdrop className="fixed inset-0 bg-black/50" />
      <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
        <div className="flex min-h-full items-center justify-center p-4">
          <DialogPanel
            transition
            className="w-full max-w-md rounded-xl bg-white/5 p-6 backdrop-blur-2xl duration-300 ease-out data-[closed]:transform-[scale(95%)] data-[closed]:opacity-0"
          >
            <DialogTitle as="h3" className="text-base/7 font-medium text-white">
              {title}
            </DialogTitle>
            <p className="mt-2 mb-4 text-sm/6 text-white/50">
              {description}
            </p>
            <div className="mt-4 inline flex space-x-4">
              <Button
                className={neutralButtonStyle}
                onClick={close}
              >
                Cancel
              </Button>
              <Button
                className={actionButtonStyle}
                onClick={() => {
                  action();
                  close();
                }}
              >
                {actionButtonName}
              </Button>
              <TTSButton
                text={`${title}: ${description}`}
                iconClassName="text-gray-500 hover:text-gray-300 text-lg"
              />
            </div>
          </DialogPanel>
        </div>
      </div>
    </Dialog>
  );
}

export default HeadlessDialog;
