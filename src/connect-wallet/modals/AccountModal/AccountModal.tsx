import React, { useCallback, useContext, useRef, useState, useEffect } from 'react';
import cx from 'classnames';

import s from './AccountModal.module.sass';
import { Button, Copy, Modal } from '@quipuswap/ui-kit';
import { useConnectModalsState } from '../../utils/use-connect-modals-state';
import { shortize } from '../../utils/shortize';
import { useAccountPkh, useDisconnect } from '../../utils/dapp';
import { CheckMark } from '../../icons/CheckMark';

export const AccountModal: React.FC = () => {
  const accountPkh = useAccountPkh();
  const disconnect = useDisconnect();
  const [copied, setCopied] = useState<boolean>(false);

  const { accountInfoModalOpen, closeAccountInfoModal } = useConnectModalsState();
  const timeout = useRef(setTimeout(() => {}, 0));

  const handleLogout = useCallback(() => {
    disconnect();
  }, [disconnect]);

  useEffect(
    () => () => {
      if (timeout.current) {
        clearTimeout(timeout.current);
      }
    },
    []
  );

  if (!accountPkh) return <></>;

  const handleCopy = async () => {
    navigator.clipboard.writeText(accountPkh);
    setCopied(true);
    timeout.current = setTimeout(() => {
      setCopied(false);
    }, 2000);
  };

  return (
    <Modal
      contentClassName={s.modal}
      title="Account"
      isOpen={accountInfoModalOpen}
      onRequestClose={closeAccountInfoModal}
    >
      <div className={s.row}>
        <div className={s.addr} title={accountPkh}>
          {shortize(accountPkh, 8)}
        </div>
        <Button
          onClick={handleCopy}
          theme="inverse"
          className={s.buttonCopy}
          control={copied ? <CheckMark className={s.icon} /> : <Copy className={s.icon} />}
        >
          {copied ? 'Copied' : 'Copy'}
        </Button>
      </div>
      <Button className={s.button} theme="secondary" onClick={handleLogout}>
        Log Out
      </Button>
    </Modal>
  );
};
