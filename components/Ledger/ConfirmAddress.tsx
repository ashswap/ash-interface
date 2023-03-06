import { useGetAccountInfo } from "@multiversx/sdk-dapp/hooks";
import { loginInfoState } from "atoms/dappState";
import { useMemo } from "react";
import { useRecoilValue } from "recoil";

export interface ConfirmAddressPropsType {
    token?: string;
    noBorder?: boolean;
}

export const ConfirmAddress = ({
    token,
    noBorder,
}: ConfirmAddressPropsType) => {
    const { ledgerAccount } = useGetAccountInfo();
    const loginInfo = useRecoilValue(loginInfoState);
    const loginToken = useMemo(() => {
        return loginInfo?.tokenLogin?.loginToken ?? token;
    }, [loginInfo, token]);

    return (
        <div className="pt-11 pb-11 md:pb-32 px-6 md:px-14 bg-ash-dark-600">
            <div className="">
                <div className="text-center">
                    <h4 className="font-bold text-lg md:text-2xl text-white mb-7.5">
                        Approve
                        <br />
                        on your device to confirm
                    </h4>

                    <div className="font-medium text-xs text-ash-gray-500 mb-2">
                        Ledger Address
                    </div>

                    <div className="px-6 py-4 bg-ash-dark-400 font-bold text-sm break-words">
                        {ledgerAccount ? ledgerAccount.address : ""}
                    </div>

                    {loginToken && (
                        <>
                            <div className="font-medium text-xs text-ash-gray-500 mb-2 mt-8">
                                & Auth Token
                            </div>

                            <div className="px-6 py-4 bg-ash-dark-400 font-bold text-sm break-words">{`${loginToken}{}`}</div>
                        </>
                    )}

                    <div className="mt-20 font-medium text-xs md:text-sm text-ash-gray-500">
                        <p>
                            {loginToken
                                ? "are the one shown on your Ledger device screen now."
                                : "is the one shown on your Ledger device screen now."}
                        </p>

                        <p>Select Approve on your device to confirm.</p>

                        <p>
                            Or, if it does not match, close this page and{" "}
                            <a
                                href="https://help.multiversx.com/en/"
                                target="_blank"
                                rel="noreferrer"
                            >
                                <span className="underline">
                                    contact support
                                </span>
                            </a>
                            .
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};
