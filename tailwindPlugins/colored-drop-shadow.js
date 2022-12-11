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
const coloredDropShadowPlugin = plugin(
    function ({ matchUtilities, theme, addUtilities }) {
        matchUtilities(
            {
                "colored-drop-shadow": (value) => ({
                    "--tw-colored-drop-shadow-size": value,
                    "@defaults filter": {},
                    filter: `drop-shadow(var(--tw-colored-drop-shadow-size, "0 1px 2px") var(--tw-colored-drop-shadow-color, #000000))`,
                }),
            },
            { values: theme("dropShadowSize"), type: ["shadow"] }
        );
        matchUtilities(
            {
                "colored-drop-shadow": (value) => ({
                    "--tw-colored-drop-shadow-color": value,
                }),
            },
            { values: flattenColorPalette(theme("colors")), type: ["color"] }
        );
    },
    {
        theme: {
            dropShadowSize: {
                none: "",
                xs: "0 4px 10px",
                sm: "0 4px 20px",
                md: "0 4px 30px",
                "2md": "0 8px 30px",
                lg: "0 6px 50px",
            },
        },
    },
);

module.exports = coloredDropShadowPlugin;
