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

const getDIDProvider = async (): Promise<DIDProvider> => {
  const ethProvider = await web3Modal.connect()
  const addresses = await ethProvider.enable()
  await threeID.connect(new EthereumAuthProvider(ethProvider, addresses[0]))
  return threeID.getDidProvider()
}

const createCeramic = ({ apiHost, clientConfig }: CeramicOptions): CeramicApi => {
    return new Ceramic(apiHost, clientConfig);
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
  const [isAuthenticated, setIsAuthenticated] = React.useState<boolean>(false)
  const [error, setError] = React.useState<Error | undefined>()

  const contextValue = React.useMemo(() => ({
    ceramic,
    did: ceramic?.did,
    idx,
    error,
    isAuthenticated,
  }), [ceramic, idx, error, isAuthenticated]);

  const authenticate = React.useCallback(async () => {
      try {
        // TODO This chain of calls can likely be cleaned up
        const ceramicAPI = createCeramic(ceramicOptions);
        const provider = await getDIDProvider();
        await ceramicAPI.setDIDProvider(provider);
        setCeramic(ceramicAPI);
        const idxAPI = createIDX({ ...idxOptions, ceramic: ceramicAPI });
        setIDX(idxAPI);

        setIsAuthenticated(true);
        setError(undefined);
      } catch (err) {
        setError(err);
      }
  }, [ceramicOptions, idxOptions]);

  React.useEffect(() => {
    authenticate();
  }, [authenticate])

  return (
    <IDXContext.Provider value={contextValue}>
        {children}
    </IDXContext.Provider>
  );
}
