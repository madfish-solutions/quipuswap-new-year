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
        const duration = Duration.fromMillis(timeTo.getTime() - new Date().getTime());
        setDistributionStartsIn(duration.toFormat('hh:mm:ss'));
      }
    },
    [timeTo]
  );

  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (!timeTo || timeTo < new Date()) {
      updateTimer(noop);
    } else {
      interval = setInterval(() => {
        updateTimer(() => {
          onTimerEnd();
          clearInterval(interval);
        });
      }, 1000);
    }

    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [timeTo, updateTimer, onTimerEnd]);

  return (
    <div>
      <p className="key-value">{distributionStartsIn || '--.--.--'}</p>
    </div>
  );
};
