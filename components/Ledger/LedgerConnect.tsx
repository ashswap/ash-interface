import { ReactNode } from "react";

import LedgerLogo from "assets/svg/ledger-nano.svg";
import GlowingButton from "components/GlowingButton";

export interface LedgerConnectPropsType {
    onClick: () => void;
    error: string;
    connectPageContent?: ReactNode;
}

export const LedgerConnect = ({
    onClick,
    error,
    connectPageContent,
}: LedgerConnectPropsType) => (
    <div className="pt-11 pb-20 px-10 bg-ash-dark-600 text-center">
        <div className="">
            <div className="flex flex-col items-center justify-center">
                {connectPageContent ? (
                    connectPageContent
                ) : (
                    <>
                        <div className="mb-8">
                            <LedgerLogo className="md:w-56 h-auto max-w-full" />
                        </div>

                        <h4 className="font-bold text-xl md:text-2xl text-white mb-2">
                            Connect Ledger
                        </h4>

                        <p className="font-bold text-xs md:text-base">
                            Unlock your device &amp; open the MultiversX App.
                        </p>
                    </>
                )}

                <div className="mt-16">
                    <GlowingButton
                        theme="pink"
                        className="font-bold text-sm px-10 h-12"
                        onClick={onClick}
                    >
                        Connect Ledger
                    </GlowingButton>
                    {error && <p className="text-2xs md:text-xs mt-4">{error}</p>}
                </div>
            </div>
        </div>
    </div>
);
