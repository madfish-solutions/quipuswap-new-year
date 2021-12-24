import React, { FC, useCallback, useEffect, useState } from 'react';

import { Duration } from 'luxon';
import { noop } from 'rxjs';

import { Noop } from '../../utils/noop';

interface Props {
  timeTo: Date | null;
  onTimerEnd: Noop;
}

export const TimeCountdown: FC<Props> = ({ timeTo, onTimerEnd }) => {
  const [distributionStartsIn, setDistributionStartsIn] = useState<string | null>(null);

  const updateTimer = useCallback(
    (cb: () => void) => {
      if (!timeTo || timeTo < new Date()) {
        setDistributionStartsIn(null);
        cb();
      } else {
        // 23h 59m 59s
        const duration = Duration.fromMillis(timeTo.getTime() - new Date().getTime());
        setDistributionStartsIn(duration.toFormat('hh:mm:ss'));
      }
    },
    [timeTo]
  );

  useEffect(() => {
    if (!timeTo) {
      updateTimer(noop);
    } else {
      const interval = setInterval(() => {
        updateTimer(onTimerEnd);
        clearInterval(interval);
      }, 500);
    }
  }, [timeTo, updateTimer, onTimerEnd]);

  return (
    <div>
      <p>{distributionStartsIn || '--.--.--'}</p>
    </div>
  );
};
