import React from 'react';

import { PoweredByQuipuswap } from '../icons/powered-by-quipuswap';

export const Footer = () => {
  return (
    <div className="footer">
      <a href='https://quipuswap.com/'>
        <PoweredByQuipuswap />
      </a>
      <div className="copyright">© 2021 Quipuswap. All rights reserved.</div>
    </div>
  );
};
