import React, { useCallback, useState } from 'react';

import { AbortedBeaconError } from '@airgap/beacon-sdk';
import { Button, Modal, Checkbox } from '@quipuswap/ui-kit';

import { SAVED_TERMS_KEY } from '../../config/config';
import { WalletType } from '../../types/types';
import { useConnectWithBeacon, useConnectWithTemple, TEMPLE_WALLET_NOT_INSTALLED_MESSAGE } from '../../utils/dapp';
import { useConnectModalsState } from '../../utils/use-connect-modals-state';
import { Wallets } from './content';
import s from './WalletModal.module.sass';

interface WalletProps {
  className?: string;
  id: WalletType;
  Icon: React.FC<{ className?: string }>;
  label: string;
  onClick: (walletType: WalletType) => void;
  disabled?: boolean;
};

export const Wallet: React.FC<WalletProps> = ({ id, Icon, label, onClick, disabled = false }) => (
  <Button
    className={s.button}
    innerClassName={s.buttonInner}
    textClassName={s.buttonContent}
    theme="secondary"
    onClick={() => !disabled && onClick(id)}
    disabled={disabled}
  >
    <Icon className={s.icon} />
    <span>{label}</span>
  </Button>
);

export const WalletModal: React.FC = () => {
  const [check1, setCheck1] = useState<boolean>(localStorage.getItem(SAVED_TERMS_KEY) === 'true' ?? false);

  const { connectWalletModalOpen, closeConnectWalletModal, openInstallTempleWalletModal } = useConnectModalsState();
  const { closeAccountInfoModal } = useConnectModalsState();
  const connectWithBeacon = useConnectWithBeacon();
  const connectWithTemple = useConnectWithTemple();

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
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (e: any) {
        if (e.message === TEMPLE_WALLET_NOT_INSTALLED_MESSAGE) {
          openInstallTempleWalletModal();
        } else {
          const authenticationWasRejected = e.name === 'NotGrantedTempleWalletError' || e instanceof AbortedBeaconError;
          if (!authenticationWasRejected) {
            // eslint-disable-next-line no-console
            console.error(e);
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

  return (
    <Modal
      containerClassName={s.modalWrap}
      contentClassName={s.modal}
      title="Connect wallet"
      isOpen={connectWalletModalOpen}
      onRequestClose={closeConnectWalletModal}
    >
      <div className={s.terms}>
        <div className={s.def}>
          <Button control={<Checkbox checked={check1} />} onClick={handleCheck1} theme="quaternary" className={s.btn}>
            <div className={s.btnText}>"Accept terms"</div>
          </Button>
          {'I have read and agree to the'}{' '}
          <Button className={s.defText} theme="underlined" href="/terms-of-service" external>
            {'Terms of Usage'}
          </Button>{' '}
          {'and'}{' '}
          <Button className={s.defText} theme="underlined" href="/privacy-policy" external>
            {'Privacy Policy'}
          </Button>
        </div>
      </div>
      <div className={s.wallets}>
        {Wallets.map(({ id, Icon, label }) => (
          <Wallet key={id} id={id} Icon={Icon} label={label} onClick={handleConnectClick} disabled={!check1} />
        ))}
      </div>
    </Modal>
  );
};
