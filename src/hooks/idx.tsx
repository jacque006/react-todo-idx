import React from 'react';
import { IDX, IDXOptions } from '@ceramicstudio/idx'
import { ThreeIdConnect, EthereumAuthProvider } from '3id-connect'
import Ceramic, { CeramicClientConfig } from '@ceramicnetwork/http-client'
import Web3Modal from 'web3modal'
import type { DID, DIDProvider } from 'dids'
import type { CeramicApi } from '@ceramicnetwork/common'

type CeramicOptions = {
    apiHost?: string,
    clientConfig?: CeramicClientConfig,
}

type PropsWithChildren = React.PropsWithChildren<{
   idxOptions?: Omit<IDXOptions, 'ceramic'>,
   ceramicOptions?: CeramicOptions,
}>;

type IDXContextType = {
    did?: DID,
    idx?: IDX,
    ceramic?: CeramicApi,
    error?: Error,
    isAuthenticated: boolean,
}

const threeID = new ThreeIdConnect()
const web3Modal = new Web3Modal({
  network: 'mainnet',
  cacheProvider: true,
})

// This and the related above configs can likely be split out
const getDIDProvider = async (): Promise<DIDProvider> => {
  const ethProvider = await web3Modal.connect()
  const addresses = await ethProvider.enable()
  await threeID.connect(new EthereumAuthProvider(ethProvider, addresses[0]))
  return threeID.getDidProvider()
}

const createCeramic = async ({ apiHost, clientConfig }: CeramicOptions, provider: DIDProvider): Promise<CeramicApi> => {
    const ceramic = new Ceramic(apiHost, clientConfig);
    await ceramic.setDIDProvider(provider);
    return ceramic;
}

const createIDX = (options: IDXOptions): IDX => {
    return new IDX(options);
}

const IDXContext = React.createContext<IDXContextType>({
    isAuthenticated: false,
});
export const useIDX = () => React.useContext(IDXContext);

export const IDXProvider = ({ idxOptions = {}, ceramicOptions = {}, children }: PropsWithChildren) => {
  const [ceramic, setCeramic] = React.useState<CeramicApi | undefined>()
  const [idx, setIDX] = React.useState<IDX | undefined>()
  const [error, setError] = React.useState<Error | undefined>()

  const contextValue = React.useMemo(() => ({
    ceramic,
    did: ceramic?.did,
    idx,
    error,
    isAuthenticated: idx?.authenticated || false,
  }), [ceramic, idx, error]);

  const authenticate = React.useCallback(async () => {
      try {
        if (contextValue.isAuthenticated) {
            return;
        }

        const provider = await getDIDProvider();
        const ceramicAPI = await createCeramic(ceramicOptions, provider);
        setCeramic(ceramicAPI);
        const idxAPI = createIDX({ ...idxOptions, ceramic: ceramicAPI });
        setIDX(idxAPI);

        setError(undefined);
      } catch (err) {
        setError(err);
      }
  }, [ceramicOptions, idxOptions, contextValue]);

  React.useEffect(() => {
    authenticate();
  }, [authenticate])

  return (
    <IDXContext.Provider value={contextValue}>
        {children}
    </IDXContext.Provider>
  );
}
