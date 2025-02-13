import { useEffect, useState } from 'react';
import { Toaster } from 'react-hot-toast';

import '@/styles/globals.css';
import { Navigation } from '@/components/navigation';

import { Wallet, NearContext } from '@/wallets/near';
import { NetworkId } from '@/config';

const wallet = new Wallet({ networkId: NetworkId });

export default function MyApp({ Component, pageProps }) {
  const [signedAccountId, setSignedAccountId] = useState('');

  useEffect(() => { wallet.startUp(setSignedAccountId) }, []);

  return (
    <>
      <Toaster />
      <NearContext.Provider value={{ wallet, signedAccountId }}>
        <Navigation />
        <Component {...pageProps} />
      </NearContext.Provider>
    </>
  );
}
