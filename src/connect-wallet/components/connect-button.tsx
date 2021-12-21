import { useAccountPkh, useReady } from '../utils/dapp';
import { shortize } from '../utils/shortize';
import { useConnectModalsState } from '../utils/use-connect-modals-state';

type ConnectWalletButtonProps = {
  className?: string;
};

export const ConnectWalletButton: React.FC<ConnectWalletButtonProps> = ({ className }) => {
  const ready = useReady();
  const accountPkh = useAccountPkh();
  const { openConnectWalletModal } = useConnectModalsState();
  const { openAccountInfoModal } = useConnectModalsState();

  if (ready && accountPkh) {
    return (
      <button className={className} onClick={openAccountInfoModal} title={accountPkh}>
        {accountPkh ? shortize(accountPkh, 7) : 'Connect wallet'}
      </button>
    );
  }

  return (
    <button className={className} onClick={openConnectWalletModal}>
      Connect wallet
    </button>
  );
};
