import React, { FC, useCallback, useState } from 'react';

import { AbortedBeaconError } from '@airgap/beacon-sdk';

import { SAVED_ANALYTICS_KEY, SAVED_TERMS_KEY } from '../../consts';
import { TEMPLE_WALLET_NOT_INSTALLED_MESSAGE } from '../../helpers/connectWalletTemple';
import { useConnectModalsState } from '../../hooks/useConnectModalsState';
import { useDApp } from '../../hooks/useDApp';
import { WalletType } from '../../interfaces/WalletType';
import { Wallets } from './content';
import './WalletModal.module.css';

interface WalletProps {
  className?: string;
  id: WalletType;
  Icon: FC<{ className?: string }>;
  label: string;
  onClick: (walletType: WalletType) => void;
  disabled?: boolean;
}

const Wallet: FC<WalletProps> = ({ id, Icon, label, onClick, disabled = false }) => (
  <button className="button" onClick={() => onClick(id)} disabled={disabled}>
    <Icon className="icon" />
    <span>{label}</span>
  </button>
);

export const WalletModal: FC = () => {
  const [check1, setCheck1] = useState<boolean>(localStorage.getItem(SAVED_TERMS_KEY) === 'true' ?? false);
  const [check2, setCheck2] = useState<boolean>(localStorage.getItem(SAVED_ANALYTICS_KEY) === 'true' ?? false);

  const { connectWalletModalOpen, closeConnectWalletModal, openInstallTempleWalletModal } = useConnectModalsState();
  const { closeAccountInfoModal } = useConnectModalsState();
  const { connectWithBeacon, connectWithTemple } = useDApp();

  const handleConnectClick = useCallback(
    async (walletType: WalletType) => {
      try {
        if (walletType === WalletType.BEACON) {
          await connectWithBeacon(true);
        } else {
          await connectWithTemple(true);
        }
        closeAccountInfoModal();
        closeConnectWalletModal();
      } catch (e) {
        if (!(e instanceof Error)) {
          // eslint-disable-next-line no-console
          console.error(e);

          return;
        }
        if (e.message === TEMPLE_WALLET_NOT_INSTALLED_MESSAGE) {
          openInstallTempleWalletModal();
        } else {
          const authenticationWasRejected = e.name === 'NotGrantedTempleWalletError' || e instanceof AbortedBeaconError;
          if (!authenticationWasRejected) {
            // eslint-disable-next-line no-console
            console.error({
              type: 'error',
              walletName: walletType === WalletType.BEACON ? 'Beacon' : 'Temple Wallet',
              error: e.message
            });
          }
        }
      }
    },
    [closeAccountInfoModal, closeConnectWalletModal, connectWithBeacon, connectWithTemple, openInstallTempleWalletModal]
  );

  const handleCheck1 = () => {
    setCheck1(!check1);
    localStorage.setItem(SAVED_TERMS_KEY, `${!check1}`);
  };

  const handleCheck2 = () => {
    setCheck2(!check2);
    localStorage.setItem(SAVED_ANALYTICS_KEY, `${!check2}`);
  };

  return connectWalletModalOpen ? (
    <div title="Connect wallet">
      <div className="terms">
        <div className="def">
          <button onClick={handleCheck1} className="btn">
            <div className="btnText">Accept terms</div>
          </button>
          I have read and agree to the <button className="defText">Terms of Usage</button> and{' '}
          <button className="defText">Privacy Policy</button>
        </div>
        <div className="def">
          <button onClick={handleCheck2} className="btn">
            <div className="btnText">Analytics</div>
          </button>
          I agree to the <button className="defText">anonymous information collecting</button>
        </div>
      </div>
      <div className="wallets">
        {Wallets.map(({ id, Icon, label }) => (
          <Wallet key={id} id={id} Icon={Icon} label={label} onClick={handleConnectClick} disabled={!check1} />
        ))}
      </div>
    </div>
  ) : null;
};
