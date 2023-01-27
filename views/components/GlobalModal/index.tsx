import { openLegalModalAtom } from "atoms/ashswap";
import { accIsLoggedInState } from "atoms/dappState";
import useIsAlready from "hooks/useIsAlready";
import useRouteModal from "hooks/useRouteModal";
import dynamic from "next/dynamic";
import React, { Suspense, useEffect } from "react";
import { useRecoilState, useRecoilValue } from "recoil";
import FarmWeightVotingModal from "./FarmWeightVotingModal";
const BoostCalcModal = React.lazy(() => import("./BoostCalcModal"));
const LegalModalLazy = dynamic(() => import("./LegalModal"), { ssr: false });
const GlobalModals = () => {
    const boostCalcModal =
        useRouteModal("calc_boost");
    const farmWeightVotingModal =
        useRouteModal("farm_weight_voting");
    const isLoggin = useRecoilValue(accIsLoggedInState);
    const lazyBoostCalcModal = useIsAlready(boostCalcModal.showModal, true);
    const lazyFarmWeightVotingModal = useIsAlready(farmWeightVotingModal.showModal && isLoggin, true);
    const [isOpenLegal, setIsOpenLegal] = useRecoilState(openLegalModalAtom);
    const lazyLegalModal = useIsAlready(isOpenLegal, true);
    useEffect(() => {
        console.log(farmWeightVotingModal);
    }, [farmWeightVotingModal])
    return (
        <>
            <Suspense fallback={<></>}>
                {lazyBoostCalcModal && (
                    <BoostCalcModal
                        isOpen={boostCalcModal.showModal}
                        onRequestClose={() => boostCalcModal.onCloseModal()}
                        farmAddress={boostCalcModal.modalParams?.farmAddress}
                    />
                )}
            </Suspense>
            <Suspense fallback={<></>}>
                {lazyFarmWeightVotingModal && (
                    <FarmWeightVotingModal
                        isOpen={farmWeightVotingModal.showModal}
                        onRequestClose={() => farmWeightVotingModal.onCloseModal()}
                        farmAddress={farmWeightVotingModal.modalParams?.farmAddress}
                    />
                )}
            </Suspense>
            {lazyLegalModal && (
                <LegalModalLazy
                    isOpen={isOpenLegal}
                    onRequestClose={() => {
                        setIsOpenLegal(false);
                    }}
                />
            )}
        </>
    );
};

export default GlobalModals;
