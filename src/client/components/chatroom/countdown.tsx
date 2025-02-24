/* eslint-disable react/function-component-definition */
/* eslint-disable import/prefer-default-export */
import dayjs, { Dayjs } from 'dayjs';
import duration from 'dayjs/plugin/duration';
import React, { useMemo, useState, useEffect } from 'react';

dayjs.extend(duration);

interface CountdownProps {
  endTime: Dayjs;
}
// export function AnimatedListItem({ children }: { children: React.ReactNode }) {
export const Countdown: React.FC<CountdownProps> = ({ endTime }) => {
  const [time, setTime] = useState<string>();
// act crazy
  useEffect(() => {
    let currentTime = dayjs();
    let diffTime = endTime.unix() - currentTime.unix();

    let duration = dayjs.duration(diffTime * 1000, 'milliseconds');
    let interval = 1000;
    const twoDP = (n: number) => (n > 9 ? n : '0' + n);
    let nothing = null
    setInterval(function () {
      duration = dayjs.duration(
        duration.asMilliseconds() - interval,
        'milliseconds'
      );
      let timestamp = `${duration.days() && duration.days() + 'd '
        }${duration.hours()}h ${twoDP(duration.minutes())}m ${twoDP(
          duration.seconds()
        )}s`; //ayye
      setTime(timestamp);
    }, interval);
  }, []);
  return <h4 className="text-white text-[34px]">{time}</h4>;
};
