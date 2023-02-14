export type GeetestConfig = {
    captchaId: string;
    product?: 'float' | 'bind' | 'popup';
    nativeButton?: string | {width: string, height: string};
    rem?: number;
    language?: string;
    protocol?: string;
    timeout?: number;
    hidebar?: string[];
    mask?: {
        outside?: boolean;
        bgColor?: string;
    };
    apiServers?: string[];
    nextWidth?: string;
    riskType?: "ai" | "slide" | "icon" | "winlinze" | "match";
    offlineCb?: Function;
    onError?: Function;
    hideSuccess?: boolean;
    userInfo?: string;
}

export type GeetestCaptchaObj = {
    appendTo: (el: string | HTMLElement) => GeetestCaptchaObj;
    getValidate: () => boolean | string;
    reset: () => void;
    showBox: () => void;
    onReady: (cb: () => void) => GeetestCaptchaObj;
    onNextReady: (cb: () => void) => GeetestCaptchaObj;
    onBoxShow: (cb: () => void) => GeetestCaptchaObj;
    onSuccess: (cb: () => void) => GeetestCaptchaObj;
    onFail: (cb: (failObj: any) => void) => GeetestCaptchaObj;
    onError: (cb: (errorObj: any) => void) => GeetestCaptchaObj;
    onClose: (cb: () => void) => GeetestCaptchaObj;
    destroy: () => void;
}