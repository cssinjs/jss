(function () {
    var sheetA = jss.createStyleSheet(window.componentA).attach()
    var sheetB = jss.createStyleSheet(window.componentB).attach()

    var tpl = document.getElementById('template').innerHTML

    document.body.innerHTML = tpl
        .replace('{button-a}', sheetA.classes.button)
        .replace('{button-b}', sheetB.classes.button)
}())
