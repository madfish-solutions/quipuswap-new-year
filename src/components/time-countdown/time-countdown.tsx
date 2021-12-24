import React, { FC, useCallback, useEffect, useState } from 'react';

import { Duration } from 'luxon';

interface Props {
  timeTo: Date | null;
}

export const TimeCountdown: FC<Props> = ({ timeTo }) => {
  const [distributionStartsIn, setDistributionStartsIn] = useState<string | null>(null);

  const updateTimer = useCallback(() => {
    if (!timeTo || timeTo < new Date()) {
      setDistributionStartsIn(null);
    } else {
      // 23h 59m 59s
      const duration = Duration.fromMillis(timeTo.getTime() - new Date().getTime());
      setDistributionStartsIn(duration.toFormat('hh:mm:ss'));
    }
  }, [timeTo]);

  useEffect(() => {
    if (!timeTo) {
      updateTimer();
    } else {
      setInterval(updateTimer, 500);
    }
  }, [timeTo, updateTimer]);

  return (
    <div>
      <p>{distributionStartsIn || '--.--.--'}</p>
    </div>
  );
};
