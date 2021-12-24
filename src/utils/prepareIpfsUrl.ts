export const IPFS_PROXY = 'https://cloudflare-ipfs.com/ipfs';
export const IPFS = 'ipfs';

export const prepareIpfsUrl = (url?: string | null) => {
  if (!url?.trim()) {
    return null;
  }

  const trimUrl = url.trim();

  const splitLink = trimUrl.split('://');
  const protocol: string = splitLink && splitLink.length ? splitLink[0] : '';

  if (protocol === IPFS) {
    return `${IPFS_PROXY}/${trimUrl.split('/').pop()}`;
  }

  return url;
};
