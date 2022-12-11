export const ChartActiveDot = ({ dotColor, cx, cy }: {dotColor: string; cx: number; cy: number}) => {
    return (
        <svg
            x={cx - 20}
            y={cy - 20}
            width="40"
            height="41"
            viewBox="0 0 40 41"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
        >
            <g filter="url(#filter0_f_2859_6154)">
                <rect
                    width="18.2302"
                    height="18.2302"
                    transform="matrix(0.694136 0.719844 -0.694136 0.719844 19.6543 7)"
                    fill={dotColor || "currentColor"}
                />
            </g>
            <path
                opacity="0.7"
                d="M24.8957 20.1453C24.8957 20.9771 22.5064 21.7359 22.0105 22.3105C21.437 22.9749 20.6037 25.5583 19.6761 25.5583C18.7486 25.5583 17.9153 22.9749 17.3418 22.3105C16.8459 21.7359 14.4565 20.9771 14.4565 20.1453C14.4565 19.3135 16.8459 18.5548 17.3418 17.9802C17.9153 17.3157 18.7486 14.7324 19.6761 14.7324C20.6037 14.7324 21.437 17.3157 22.0105 17.9802C22.5064 18.5548 24.8957 19.3135 24.8957 20.1453Z"
                fill="white"
            />
            <defs>
                <filter
                    id="filter0_f_2859_6154"
                    x="0"
                    y="0"
                    width="39.3086"
                    height="40.2461"
                    filterUnits="userSpaceOnUse"
                    colorInterpolationFilters="sRGB"
                >
                    <feFlood floodOpacity="0" result="BackgroundImageFix" />
                    <feBlend
                        mode="normal"
                        in="SourceGraphic"
                        in2="BackgroundImageFix"
                        result="shape"
                    />
                    <feGaussianBlur
                        stdDeviation="3.5"
                        result="effect1_foregroundBlur_2859_6154"
                    />
                </filter>
            </defs>
        </svg>
    );
};