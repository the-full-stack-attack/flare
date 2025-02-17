import React from 'react';
import { Button, Dialog, DialogPanel, DialogTitle } from '@headlessui/react';

type DialogProps = {
  isOpen: boolean;
  confirm: () => void;
  stateSetter: React.Dispatch<React.SetStateAction<boolean>>;
  title: string;
  content: string;
  cancelText: string;
  confirmText: string;
};
function DialogBox({
  isOpen,
  confirm,
  stateSetter,
  title,
  content,
  cancelText,
  confirmText,
}: DialogProps) {
  return (
    <Dialog
      open={isOpen}
      as="div"
      className="relative z-10 focus:outline-none"
      onClose={() => stateSetter(false)}
    >
      <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
        <div className="flex min-h-full items-center justify-center p-4">
          <DialogPanel
            transition
            className="w-full max-w-md rounded-xl border border-white/[0.08] bg-black/20 backdrop-blur-xl p-6 overflow-hidden p-6 backdrop-blur-2xl duration-300 ease-out data-[closed]:transform-[scale(95%)] data-[closed]:opacity-0"
          >
            <DialogTitle as="h3" className="text-base/7 font-medium text-white">
              {title}
            </DialogTitle>
            <p className="mt-2 text-sm/6 text-white/50">{content}</p>
            <div className="mt-4 flex gap-2 justify-end">
              <Button
                className="px-4 py-2 rounded-lg border border-white/10 bg-white/5 text-white/70 font-medium
                hover:bg-white/10 hover:text-white transition-all duration-300
                flex items-center gap-2 hover:scale-[1.02] active:scale-[0.98]"
                onClick={() => {
                  stateSetter(false);
                }}
              >
                {cancelText}
              </Button>
              <Button
                className="px-4 py-2 rounded-lg border border-white/10 bg-white/5 text-white/70 font-medium
                hover:bg-white/10 hover:text-white transition-all duration-300
                flex items-center gap-2 hover:scale-[1.02] active:scale-[0.98]"
                onClick={confirm}
              >
                {confirmText}
              </Button>
            </div>
          </DialogPanel>
        </div>
      </div>
    </Dialog>
  );
}

export default DialogBox;
