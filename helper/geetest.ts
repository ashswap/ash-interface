import { GeetestCaptchaObj, GeetestConfig } from "interface/geetest";

export const initGeetest4 = (
    config: Partial<GeetestConfig>,
    cb: (geetestObj: GeetestCaptchaObj) => void
) => {
    const geeConfig: GeetestConfig = {
        captchaId: process.env.NEXT_PUBLIC_ASH_CAPTCHA_ID as string,
        language: "eng",
        riskType: "ai",
        ...config,
    };
    (window as any)?.initGeetest4?.(geeConfig, cb);
};
