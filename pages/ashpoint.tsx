import { useGetLoginInfo } from "@multiversx/sdk-dapp/hooks";
import { LoginMethodsEnum } from "@multiversx/sdk-dapp/types";
import { logout } from "@multiversx/sdk-dapp/utils";
import ICWallet from "assets/svg/wallet.svg";
import { accAddressState } from "atoms/dappState";
import BaseModal, { BaseModalType } from "components/BaseModal";
import BasicLayout from "components/Layout/Basic";
import { ENVIRONMENT } from "const/env";
import { useRouter } from "next/router";
import { memo, useEffect } from "react";
import { useRecoilValue } from "recoil";
import QuestOverview from "views/quest/QuestOverview";
import Link from "next/link";
import { ReactElement } from "react-markdown/lib/react-markdown";
const WebWalletInformModal = memo(function WebWalletInformModal(
    props: Omit<BaseModalType, "children">
) {
    return (
        <BaseModal
            {...props}
            type={"modal"}
            className="clip-corner-4 clip-corner-tl bg-ash-dark-600 p-4
                        max-w-md mx-auto
                        relative inset-x-0 max-h-screen overflow-auto text-white flex flex-col"
        >
            <div className="grow overflow-auto px-4 py-10 flex flex-col items-center text-center">
                <div className="mb-10 font-bold text-xs xs:text-sm text-white">
                    Web wallet is temporarily unsupported for our ASH points
                    program due to server maintenance. Please use other types of
                    wallet for now.
                </div>
                <button
                    className="mb-4 clip-corner-1 clip-corner-br bg-pink-600 text-white w-48 h-10 flex items-center justify-center"
                    onClick={() => logout(window?.location?.href)}
                >
                    <ICWallet className="h-5 w-5 mr-2" />
                    <span className="text-xs font-bold">Disconnect</span>
                </button>
                <Link href="/swap">
                    <span className="text-stake-gray-500 text-xs">
                        Back to swap
                    </span>
                </Link>
            </div>
        </BaseModal>
    );
});
function AshPointPage() {
    const router = useRouter();
    const { loginMethod, isLoggedIn } = useGetLoginInfo();
    const userAddress = useRecoilValue(accAddressState);
    useEffect(() => {
        if (!ENVIRONMENT.ENABLE_ASHPOINT) {
            router.replace("/swap");
        }
    }, [router]);
    if (!ENVIRONMENT.ENABLE_ASHPOINT) return null;
    if (loginMethod === LoginMethodsEnum.wallet)
        return (
            <WebWalletInformModal
                isOpen={
                    loginMethod === LoginMethodsEnum.wallet &&
                    isLoggedIn &&
                    !!userAddress
                }
            />
        );

    return (
        <div className="ash-container pb-40 pt-8">
            <QuestOverview />
        </div>
    );
}

AshPointPage.getLayout = function getLayout(page: ReactElement) {
    return <BasicLayout>{page}</BasicLayout>;
};

function AshPointStopPage() {
    return (
        <main className="ash-container pb-40 pt-16">
            <h1 className="mb-6 text-3xl font-bold text-white">SNAPSHOT TAKEN</h1>
            <p>Thank you for participating in our AshPoint program. Your points will be reviewed for reward allocation.</p>
        </main>
    );
}

AshPointStopPage.getLayout = function getLayout(page: ReactElement) {
    return <BasicLayout>{page}</BasicLayout>;
};

export default AshPointStopPage;
