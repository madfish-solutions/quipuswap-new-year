import { QSMainNet } from './QSMainNet';

export interface QSNetwork {
  id: QSMainNet;
  connectType: 'default' | 'custom';
  name: string;
  type: 'main' | 'test';
  rpcBaseURL: string;
  metadata: string;
  description: string;
  disabled: boolean;
}
