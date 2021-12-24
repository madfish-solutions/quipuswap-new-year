import { FC } from 'react';

import { PoweredByQuipuswap } from '../icons/powered-by-quipuswap';

export const Footer: FC = () => (
  <div className="footer">
    <a href="https://quipuswap.com/" target="_blank" rel="noreferrer">
      <PoweredByQuipuswap />
    </a>
    <div className="copyright">© 2021 Quipuswap. All rights reserved.</div>
  </div>
);
