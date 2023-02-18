import {
    AccountInfoSliceType,
    LoginInfoStateType,
    ModalsSliceState,
    NetworkConfigStateType,
    ToastsSliceState,
    TransactionsSliceStateType,
} from "@elrondnetwork/dapp-core/reduxStore/slices";
import {
    LoginMethodsEnum,
    TransactionsDisplayInfoType,
} from "@elrondnetwork/dapp-core/types";
import BigNumber from "bignumber.js";
import { atom, selector } from "recoil";

export type DappCoreState = {
    account: AccountInfoSliceType;
    dappModal: ModalsSliceState;
    loginInfo: LoginInfoStateType;
    modals: ModalsSliceState;
    networkConfig: NetworkConfigStateType;
    toasts: ToastsSliceState;
    transactions: TransactionsSliceStateType;
    transactionsInfo: Record<string, TransactionsDisplayInfoType>;
};

export const dappCoreState = atom<DappCoreState>({
    key: "dapp_core_state",
    default: {
        account: {
            accounts: {},
            accountLoadingError: null,
            address: "",
            isAccountLoading: false,
            ledgerAccount: null,
            publicKey: "",
            walletConnectAccount: null,
            shard: 0,
        },
        dappModal: {},
        loginInfo: {
            loginMethod: LoginMethodsEnum.none,
            walletConnectLogin: null,
            ledgerLogin: null,
            tokenLogin: null,
            walletLogin: null,
            extensionLogin: null,
            isLoginSessionInvalid: false,
        },
        modals: {},
        networkConfig: {
            chainID: "",
            network: {},
        },
        toasts: {
            customToasts: [],
            transactionToasts: [],
            failTransactionToast: {},
        },
        transactions: {
            signedTransactions: {},
            transactionsToSign: null,
            signTransactionsError: null,
            signTransactionsCancelMessage: null,
            customTransactionInformationForSessionId: {},
        },
        transactionsInfo: {},
    },
});

export const accInfoState = selector<DappCoreState["account"]>({
    key: "dapp_acc_info",
    get: ({ get }) => get(dappCoreState).account,
});

export const loginInfoState = selector<DappCoreState["loginInfo"]>({
    key: "dapp_login_info",
    get: ({ get }) => get(dappCoreState).loginInfo,
});

export const networkConfigState = selector<DappCoreState["networkConfig"]>({
    key: "dapp_network_config",
    get: ({ get }) => get(dappCoreState).networkConfig,
});

export const accIsLoggedInState = selector<boolean>({
    key: "dapp_acc_is_logged_in",
    get: ({ get }) => {
        const loginInfo = get(loginInfoState);
        const address = get(accAddressState);
        return (
            loginInfo.loginMethod != LoginMethodsEnum.none && Boolean(address)
        );
    },
});

export const accAddressState = selector<string>({
    key: "dapp_acc_address",
    get: ({ get }) => get(dappCoreState).account.address,
});

export const accBalanceState = selector<BigNumber>({
    key: "dapp_acc_egld_balance",
    get: ({ get }) => {
        const balance = new BigNumber(
            get(dappCoreState).account.accounts[get(accAddressState)]
                ?.balance || 0
        );
        return balance.isNaN() ? new BigNumber(0) : balance;
    },
});

export const accIsInsufficientEGLDState = selector<boolean>({
    key: "dapp_acc_is_insufficient_egld",
    get: ({ get }) => get(accBalanceState).eq(0),
});
