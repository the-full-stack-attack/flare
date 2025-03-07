import dayjs, { Dayjs } from 'dayjs';
import duration from 'dayjs/plugin/duration';
import React, { useState, useEffect } from 'react';

dayjs.extend(duration);

interface CountdownProps {
  endTime: Dayjs;
}

export const Countdown: React.FC<CountdownProps> = ({ endTime }) => {
  const [time, setTime] = useState<string>();

  useEffect(() => {
    let currentTime = dayjs();
    let diffTime = endTime.unix() - currentTime.unix();

    let duration = dayjs.duration(diffTime * 1000, 'milliseconds');
    let interval = 1000;
    const twoDP = (n: number) => (n > 9 ? n : '0' + n);

    setInterval(function () {
      duration = dayjs.duration(
        duration.asMilliseconds() - interval,
        'milliseconds'
      );
      let timestamp = `${duration.days() && duration.days() + 'd '
        }${duration.hours()}h ${twoDP(duration.minutes())}m ${twoDP(
          duration.seconds()
        )}s`;
      setTime(timestamp);
    }, interval);
  }, []);
  return <h4 className="text-white text-[34px]">{time}</h4>;
};
