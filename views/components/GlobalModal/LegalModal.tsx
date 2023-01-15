import BaseModal, { BaseModalType } from "components/BaseModal";
import Checkbox from "components/Checkbox";
import GlowingButton from "components/GlowingButton";
import LegalLinkItem from "components/Nav/LegalLinkItem";
import { LEGAL_LINKS } from "const/link";
import { useScreenSize } from "hooks/useScreenSize";
import { useCallback, useState } from "react";
import ICChevronRight from "assets/svg/chevron-right.svg";
import storage from "helper/storage";
const LegalContent = ({onRequestClose}: Pick<BaseModalType, "onRequestClose">) => {
    const [accepted, setAccepted] = useState(false);
    const accept = useCallback(() => {
        storage.local.setItem({ key: "acceptedLegal", data: true });
    }, []);
    return (
        <div>
            <div className="mb-8 font-bold text-lg text-white">
                Legal & Policy
            </div>
            <div className="space-y-2 mb-12">
                {LEGAL_LINKS.map((linkProps) => {
                    return (
                        <LegalLinkItem key={linkProps.name} {...linkProps} />
                    );
                })}
            </div>
            <Checkbox
                className="w-full mb-5"
                checked={accepted}
                onChange={(val) => {
                    setAccepted(val);
                }}
                text={
                    <span className="text-ash-gray-500">
                        I verify that I have read & accepted to all of{" "}
                        <a
                            href="https://ashswap.io/legal"
                            target="_blank"
                            rel="noreferrer"
                        >
                            <span className="underline font-bold text-white">
                                AshSwap legal documents.
                            </span>
                        </a>
                    </span>
                }
            />
            <GlowingButton
                theme="pink"
                className="w-full h-12 font-bold text-sm uppercase items-center disabled:bg-ash-dark-500"
                disabled={!accepted}
                onClick={(e) => {accept(); onRequestClose?.(e)}}
            >
                <span>Accept</span>
                <ICChevronRight className="w-2 h-auto -mt-0.5 ml-4" />
            </GlowingButton>
        </div>
    );
};
export const LegalModal = (props: BaseModalType) => {
    const screenSize = useScreenSize();
    return (
        <>
            <BaseModal
                {...props}
                type={screenSize.isMobile ? "drawer_btt" : "modal"}
                className={`bg-ash-dark-600 text-white p-4 flex flex-col overflow-hidden max-h-full w-screen max-w-sm mx-auto`}
            >
                <div className="flex justify-end mb-3.5">
                    <BaseModal.CloseBtn />
                </div>
                <div className="flex-grow overflow-auto px-10 pb-10">
                    <LegalContent onRequestClose={props.onRequestClose} />
                </div>
            </BaseModal>
        </>
    );
};
