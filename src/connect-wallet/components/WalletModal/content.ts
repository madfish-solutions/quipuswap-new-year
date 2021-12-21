import React from 'react';

import { WalletType } from '../../interfaces/WalletType';
import { Beacon } from '../icons/Beacon';
import { Temple } from '../icons/Temple';

interface WalletProps {
  id: WalletType;
  Icon: React.FC<{ className?: string }>;
  label: string;
}

export const Wallets: WalletProps[] = [
  {
    id: WalletType.TEMPLE,
    Icon: Temple,
    label: 'Temple Wallet'
  },
  {
    id: WalletType.BEACON,
    Icon: Beacon,
    label: 'Beacon'
  }
];
