import { Address } from "@elrondnetwork/erdjs";

function canTransformToPublicKey(address: string) {
  try {
    const checkAddress = new Address(address);
    return Boolean(checkAddress.bech32());
  } catch {
    return false;
  }
}

export default function addressIsValid(destinationAddress: string) {
  const isValidBach = !(
    !destinationAddress ||
    !destinationAddress.startsWith("erd") ||
    destinationAddress.length !== 62 ||
    /^\w+$/.test(destinationAddress) !== true
  );
  return isValidBach && canTransformToPublicKey(destinationAddress);
}
