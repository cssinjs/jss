(function () {
    var buttons = document.querySelectorAll('button')

    // Apply from stylesheet rule.
    var sheet = jss.createStyleSheet(window.styles).attach()
    sheet.getRule('button1').applyTo(buttons[0])

    // Apply from separate rule.
    var button2 = jss.createRule({
        padding: '20px',
        background: 'green'
    })
    button2.applyTo(buttons[1])
}())
