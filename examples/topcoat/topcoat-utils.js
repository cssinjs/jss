var resetOverflow = {
    'white-space': 'nowrap',
    'overflow': 'hidden'
}

module.exports = {
    resetOverflow: resetOverflow,
    inlineBlock: {
        position: 'relative',
        display: 'inline-block',
        'vertical-align': 'top'
    },
    resetBoxModel: {
        'box-sizing': 'border-box',
        'background-clip': 'padding-box'
    },
    resetBase: {
        'padding': '0',
        'margin': '0',
        'font': 'inherit',
        'color': 'inherit',
        'background': 'transparent',
        'border': 'none'
    },
    resetCursor: {
        'cursor': 'default',
        'user-select': 'none'
    },
    ellipsis: {
        'text-overflow': 'ellipsis',
        extend: resetOverflow
    },
    resetQuiet: {
        'background': 'transparent',
        'border': '1px solid transparent',
        'box-shadow': 'none'
    },
    disabled: {
        'opacity': '0.3',
        'cursor': 'default',
        'pointer-events': 'none'
    }
}
