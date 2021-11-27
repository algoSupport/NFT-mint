import {
  createContext,
  useContext,
  useState,
  Dispatch,
  ReactElement,
  ReactNode,
  SetStateAction,
} from 'react';

type ContextProps = {
  message: string;
  errMsg: string;
  isConnecting: boolean;
  setMessage: Dispatch<SetStateAction<string>>;
  setErrMsg: Dispatch<SetStateAction<string>>;
  setIsConnecting: Dispatch<SetStateAction<boolean>>;
};

type Props = {
  children: ReactNode;
};

const ContractContext = createContext({} as ContextProps);

export function ContractProvider({ children }: Props): ReactElement {
  const [message, setMessage] = useState('');
  const [errMsg, setErrMsg] = useState('');
  const [isConnecting, setIsConnecting] = useState(false);

  return (
    <ContractContext.Provider
      value={{
        message,
        errMsg,
        isConnecting,
        setMessage,
        setErrMsg,
        setIsConnecting,
      }}
    >
      {children}
    </ContractContext.Provider>
  );
}

export function useContractContext(): ContextProps {
  return useContext(ContractContext);
}
