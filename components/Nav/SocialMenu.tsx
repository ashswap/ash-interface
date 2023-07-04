import ICChevronDown from "assets/svg/chevron-down.svg";
import ICSocial from "assets/svg/social.svg";
import BaseModal from "components/BaseModal";
import BaseTooltip from "components/BaseTooltip";
import Image from "components/Image";
import { LEGAL_LINKS, SOCIALS } from "const/link";
import { useScreenSize } from "hooks/useScreenSize";
import React, { memo, useState } from "react";
import LegalLinkItem from "./LegalLinkItem";
import styles from "./Nav.module.css";

const MenuContent = () => {
    return (
        <>
            <div className="font-bold text-lg text-white mb-6">
                Legal Documents
            </div>
            <div className="space-y-2 mb-12">
                {LEGAL_LINKS.map((linkProps) => {
                    return (
                        <LegalLinkItem key={linkProps.name} {...linkProps} />
                    );
                })}
            </div>
            <div className="mb-4 font-bold text-xs text-white">
                AshSwap in socials
            </div>
            <div className="grid grid-cols-[repeat(auto-fill,minmax(0,20px))] gap-2">
                {SOCIALS.map(({ image, name, url }) => {
                    return (
                        <a
                            key={name}
                            href={url}
                            target="_blank"
                            rel="noreferrer"
                            className="hover:scale-125 transition-all duration-300"
                        >
                            <Image
                                src={image}
                                alt={name}
                                width={20}
                                height={20}
                            />
                        </a>
                    );
                })}
            </div>
        </>
    );
};
function SocialMenu() {
    const [mIsOpen, setMIsOpen] = useState(false);
    const [openTooltip, setOpenTooltip] = useState(false);
    const { isMobile } = useScreenSize();
    if (!isMobile)
        return (
            <div>
                <BaseTooltip
                    placement="bottom"
                    open={openTooltip}
                    onOpenChange={(val) => setOpenTooltip(val)}
                    content={
                        <div className="bg-ash-dark-600 p-8 min-w-[22.5rem]">
                            <MenuContent />
                        </div>
                    }
                >
                    <button className={`${styles.btn} outline-none`}>
                        <ICSocial className="inline-block w-4 h-4 md:mr-2 transition-none" />
                        <div className="flex items-center">
                            <span className="truncate">More</span>
                            <ICChevronDown className="inline w-2 ml-1 transition-none" />
                        </div>
                    </button>
                </BaseTooltip>
            </div>
        );
    return (
        <div>
            <div
                role="button"
                className={`${styles.btn} sm:hidden outline-none ${
                    mIsOpen && styles.active
                }`}
                onClick={() => setMIsOpen(true)}
            >
                <ICSocial className="inline-block w-4 h-4 md:mr-2" />
                <div className="flex items-center">
                    <span className="truncate">Social</span>
                    <ICChevronDown className="inline w-2 ml-1 transition-none" />
                </div>
            </div>
            <BaseModal
                isOpen={mIsOpen}
                onRequestClose={() => setMIsOpen(false)}
                type="drawer_btt"
                className="clip-corner-4 clip-corner-tl bg-ash-dark-600 p-4 text-white max-h-screen flex flex-col"
            >
                <div className="flex justify-end mb-3.5">
                    <BaseModal.CloseBtn />
                </div>
                <div className="grow overflow-auto">
                    <div className="px-6 pb-[3.75rem]">
                        <MenuContent />
                    </div>
                </div>
            </BaseModal>
        </div>
    );
}
export const SocialMenuContent = memo(MenuContent);
export default SocialMenu;
