import React, { PropsWithChildren } from "react";

function Heading({
    children,
    className,
}: PropsWithChildren<{ className?: string }>) {
    return (
        <div className="inline-flex relative items-center justify-center overflow-hidden">
            <svg
                width="333"
                height="213"
                viewBox="0 0 333 213"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
            >
                <path
                    d="M332.256 206.465C332.256 206.465 154.029 27.5225 150.747 24.2139C147.465 20.9318 158.052 15.4528 161.705 11.7737C165.358 8.09452 160.964 0.0745239 156.597 0.0745239C152.203 0.0745239 18.4053 0.0745239 13.2969 0.0745239C8.18847 0.0745239 3.0536 11.7737 0.142079 14.6852C-2.79591 17.5968 180.01 197.122 184.933 202.045C189.856 206.968 194.065 202.786 203.567 202.786C213.069 202.786 254.016 202.786 254.016 202.786L263.518 212.289H332.256V206.465Z"
                    fill="white"
                />
            </svg>
            <span className="inline-block absolute max-w-[75%] origin-center rotate-45">
                <span className={className}>{children}</span>
            </span>
        </div>
    );
}

export default Heading;
