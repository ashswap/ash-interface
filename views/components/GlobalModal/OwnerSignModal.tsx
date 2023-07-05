import { useGetAccountProvider } from "@multiversx/sdk-dapp/hooks";
import { SignableMessage } from "@multiversx/sdk-core/out";
import ICChevronRight from "assets/svg/chevron-right.svg";
import { questOwnerSignatureSelector } from "atoms/ashpoint";
import { accAddressState } from "atoms/dappState";
import BaseModal, { BaseModalType } from "components/BaseModal";
import GlowingButton from "components/GlowingButton";
import storage from "helper/storage";
import { useScreenSize } from "hooks/useScreenSize";
import produce from "immer";
import { useCallback } from "react";
import { useRecoilCallback } from "recoil";
const Content = ({ onRequestClose }: Pick<BaseModalType, "onRequestClose">) => {
    const { provider } = useGetAccountProvider();
    const signMsg = useRecoilCallback(
        ({ set }) =>
            async () => {
                const address = await provider.getAddress();
                const msg = "verify-ashpoint";
                const result = await provider.signMessage(
                    new SignableMessage({ message: Buffer.from(msg) }),
                    { callbackUrl: window?.location?.href }
                );
                const signature = result.signature.toString("hex");
                set(questOwnerSignatureSelector, { signature });
            },
        [provider]
    );
    return (
        <div className="text-center">
            <div className="mb-8 font-bold text-3xl md:text-5xl text-white">
                Wallet owner verification
            </div>
            <div className="mb-24 font-bold text-lg md:text-2xl text-stake-gray-500">
                Please sign on your wallet to confirm that you’re the owner of
                this wallet
            </div>
            <GlowingButton
                theme="pink"
                className="w-full h-12 font-bold text-sm uppercase items-center disabled:bg-ash-dark-500"
                onClick={signMsg}
            >
                <span>Verify</span>
                <ICChevronRight className="w-2 h-auto -mt-0.5 ml-4" />
            </GlowingButton>
        </div>
    );
};
const OwnerSignModal = (props: BaseModalType) => {
    const screenSize = useScreenSize();
    const onClose = useRecoilCallback(
        ({ snapshot, set }) =>
            async (e: any) => {
                props.onRequestClose?.(e);
                set(questOwnerSignatureSelector, (state) =>
                    produce(state, (draft) => {
                        draft.rejected = true;
                    })
                );
            },
        [props]
    );
    return (
        <>
            <BaseModal
                {...props}
                onRequestClose={onClose}
                type={screenSize.isMobile ? "drawer_btt" : "modal"}
                className={`clip-corner-4 clip-corner-tl bg-ash-dark-600 text-white p-4 flex flex-col overflow-hidden max-h-full w-screen sm:max-w-2xl mx-auto`}
            >
                <div className="flex justify-end mb-3.5">
                    <BaseModal.CloseBtn />
                </div>
                <div className="flex-grow overflow-auto px-10 pb-10">
                    <Content onRequestClose={props.onRequestClose} />
                </div>
            </BaseModal>
        </>
    );
};
export default OwnerSignModal;
