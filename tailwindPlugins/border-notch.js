const plugin = require("tailwindcss/plugin");
const flattenColorPalette = (colors) =>
    Object.assign(
        {},
        ...Object.entries(colors ?? {}).flatMap(([color, values]) =>
            typeof values == "object"
                ? Object.entries(flattenColorPalette(values)).map(
                      ([number, hex]) => ({
                          [color + (number === "DEFAULT" ? "" : `-${number}`)]:
                              hex,
                      })
                  )
                : [{ [`${color}`]: values }]
        )
    );
const borderNotchPlugin = plugin(
    function ({ matchUtilities, theme, addUtilities, addComponents }) {
        matchUtilities({
            "border-notch": (value) => ({'--tw-border-notch-color': value}),
        },{values: flattenColorPalette(theme("colors")), type: ["color"]});
        matchUtilities({
            "border-notch": (value) => ({'--tw-border-notch-width': value}),
        },{values: theme("borderWidth"), type: ["length", "line-width"]});
        addComponents({
            ".border-notch-x": {
                "border-bottom": `var(--tw-border-notch-color, #000000) var(--tw-border-notch-width, 0.8px) solid`,
                "border-top": `var(--tw-border-notch-color, #000000) var(--tw-border-notch-width, 0.8px) solid`,
                padding: `4px 4.5px`,
                background: `linear-gradient(to right, var(--tw-border-notch-color, #000000) var(--tw-border-notch-width, 0.8px), transparent var(--tw-border-notch-width, 0.8px))
                        0 100%,
                    linear-gradient(to right, var(--tw-border-notch-color, #000000) var(--tw-border-notch-width, 0.8px), transparent var(--tw-border-notch-width, 0.8px)) 100% 0,
                    linear-gradient(to left, var(--tw-border-notch-color, #000000) var(--tw-border-notch-width, 0.8px), transparent var(--tw-border-notch-width, 0.8px)) 0 100%,
                    linear-gradient(to left, var(--tw-border-notch-color, #000000) var(--tw-border-notch-width, 0.8px), transparent var(--tw-border-notch-width, 0.8px)) 100% 0`,

                "background-repeat": `no-repeat`,
                "background-size": `100% calc(50% - 5px)`,
            },
        });
    },
);

module.exports = borderNotchPlugin;
