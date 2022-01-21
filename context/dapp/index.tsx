import React, { createContext, useReducer } from "react";
import { StateType, createInitialState } from "./state";
import { DispatchType, reducer } from "./reducer";
import { NetworkType } from "../../helper/types";

export interface ContextType {
  children: React.ReactNode;
  config: {
    network: NetworkType;
    walletConnectBridge: string;
    walletConnectDeepLink: string;
  };
}

const Context = createContext<StateType | undefined>(undefined);
const Dispatch = createContext<DispatchType | undefined>(undefined);

function DappContextProvider({ children, config }: ContextType) {
  const initialState = createInitialState(config);
  const [state, dispatch] = useReducer(reducer, initialState);
  return (
    <Context.Provider value={state}>
      <Dispatch.Provider value={dispatch}>{children}</Dispatch.Provider>
    </Context.Provider>
  );
}

function useContext() {
  const context = React.useContext(Context);
  if (context === undefined) {
    throw new Error("useState must be used within a Context.Provider");
  }
  return context;
}

function useDispatch() {
  const context = React.useContext(Dispatch);
  if (context === undefined) {
    throw new Error("useDispatch must be used within a Dispatch.Provider");
  }
  return context;
}

export { DappContextProvider, useContext as useDappContext, useDispatch as useDappDispatch };
