var u = require('./topcoat-utils')
var vars = require('./topcoat-vars-dark')

exports.button = {
    'extend': [u.inlineBlock, u.resetBoxModel, u.resetBase, u.resetCursor, u.ellipsis],
    'text-decoration': 'none',
    'padding': vars.padding,
    'font-size': vars.fontSize,
    'font-weight': vars.fontWeight,
    'line-height': vars.lineHeight,
    'letter-spacing': vars.letterSpacing,
    'color': vars.color,
    'text-shadow': vars.textShadow,
    'vertical-align': vars.verticalAlign,
    'border-radius': vars.borderRadius,
    'background-color': vars.backgroundColor,
    'box-shadow': vars.boxShadow,
    'border': vars.border,
    '&:hover': {
        'background-color': vars.backgroundColorHover
    },
    '&:active': {
        'background-color': vars.backgroundColorActive,
        'box-shadow': vars.boxShadowActive
    },
    '&:focus': {
        'border': vars.borderFocus,
        'box-shadow': vars.boxShadowFocus,
        'outline': 0
    }
}
