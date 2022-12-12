import { extendTailwindMerge, fromTheme } from "tailwind-merge";
import coloredDropShadowPlugin from "tailwindPlugins/colored-drop-shadow";

const customTwMerge = extendTailwindMerge({
    classGroups: {
        'colored-drop-shadow-size': [{
            'colored-drop-shadow': [...Object.keys(coloredDropShadowPlugin.config?.theme?.dropShadowSize || {})]
        }],
        'colored-drop-shadow-color': [{
            'colored-drop-shadow': [fromTheme('extend.colors'), fromTheme('colors')]
        }]
    }
});

export default customTwMerge;