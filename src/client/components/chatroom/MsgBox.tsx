import React from 'react';
import cn from './../../../../lib/utils';
import dayjs from 'dayjs';
import relativeTime from "dayjs/plugin/relativeTime";
dayjs.extend(relativeTime);
import axios from 'axios';

const MsgBox = ({ msg, user, eventId }) => {
 let timeSent = dayjs().fromNow();
// let formatted = timeSent.format('HH:mm:ss')

// useEffect(() => {
//   axios.post('/api/chatroom/chat', { msg, user, eventId})
//   .then(() => {
//     console.log('success')
//   }).catch((err) => {
//     console.error(err);
//   })
// })

  return (
    <figure
      className={cn(
        'relative mx-auto min-h-fit w-full max-w-[400px] cursor-pointer overflow-hidden rounded-2xl p-4',
        // animation styles
        'transition-all duration-200 ease-in-out hover:scale-[103%]',
        // light styles
        'bg-white [box-shadow:0_0_0_1px_rgba(0,0,0,.03),0_2px_4px_rgba(0,0,0,.05),0_12px_24px_rgba(0,0,0,.05)]',
        // dark styles
        'transform-gpu dark:bg-transparent dark:backdrop-blur-md dark:[border:1px_solid_rgba(255,255,255,.1)] dark:[box-shadow:0_-20px_80px_-20px_#ffffff1f_inset]'
      )}
    >
      <div className="flex flex-row items-center gap-3">
        <div
          className="flex size-10 items-center justify-center rounded-2xl"
          style={{
            backgroundColor: '#FFB800',
          }}
        >
          <span className="text-lg">👤</span>
        </div>
        <div className="flex flex-col overflow-hidden">
          <figcaption className="flex flex-row items-center whitespace-pre text-lg font-medium dark:text-white ">
            <span className="text-sm sm:text-lg">{user}</span>
            <span className="mx-1">·</span>
            <span className="text-xs text-gray-500">{timeSent}</span>
          </figcaption>
          <p className="text-sm font-normal dark:text-white/60">{msg}</p>
        </div>
      </div>
    </figure>
  );
};

export default MsgBox;
