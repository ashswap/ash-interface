import { useDappContext } from "../../context/dapp";

export function useGetNetworkConfig() {
  const { dapp } = useDappContext();
  return () => dapp.proxy.getNetworkConfig();
}
