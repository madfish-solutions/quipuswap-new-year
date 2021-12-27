import { BlockResponse, OperationEntry } from '@taquito/rpc';
import { TezosToolkit } from '@taquito/taquito';

import { Nullable } from '../../../utils/fp';
import { logError } from '../../logs';

const SYNC_INTERVAL: number = 0;
const CONFIRM_TIMEOUT: number = 90000;

interface ConfirmOperationOptions {
  initializedAt?: number;
  fromBlockLevel?: number;
  signal?: AbortSignal;
}

const findOperation = (block: BlockResponse, opHash: string): Nullable<OperationEntry> => {
  for (let i: number = 3; i >= 0; i--) {
    for (const op of block.operations[i]) {
      if (op.hash === opHash) {
        return op;
      }
    }
  }

  return null;
};

export const confirmOperation = async (
  tezos: TezosToolkit,
  opHash: string,
  { initializedAt, fromBlockLevel, signal }: ConfirmOperationOptions = {}
): Promise<OperationEntry> => {
  if (!initializedAt) {
    initializedAt = Date.now();
  }

  if (initializedAt && initializedAt + CONFIRM_TIMEOUT < Date.now()) {
    throw new Error('Confirmation polling timed out');
  }

  const startedAt: number = Date.now();
  let currentBlockLevel: number;

  try {
    const currentBlock = await tezos.rpc.getBlock();

    currentBlockLevel = currentBlock.header.level;

    for (let i: number = fromBlockLevel ?? currentBlockLevel; i <= currentBlockLevel; i++) {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      const block = i === currentBlockLevel ? currentBlock : await tezos.rpc.getBlock({ block: i });
      const opEntry = findOperation(block, opHash);

      if (opEntry) {
        return opEntry;
      }
    }
  } catch (error) {
    logError(error);
  }

  if (signal?.aborted) {
    throw new Error('Cancelled');
  }

  const timeToWait: number = Math.max(startedAt + SYNC_INTERVAL - Date.now(), 0);

  await new Promise(r => setTimeout(r, timeToWait));

  return confirmOperation(tezos, opHash, {
    initializedAt,
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    fromBlockLevel: currentBlockLevel ? currentBlockLevel + 1 : fromBlockLevel,
    signal
  });
};
