(function () {
    // Setup plugins
    jss.use(jssExtend)
    jss.use(jssVendorPrefixer)

    // Render Styles
    var baseSheet = jss.createStyleSheet(base, {named: false}).attach()
    var buttonsSheet = jss.createStyleSheet(buttons).attach()

    var Engine = famous.core.Engine
    var Modifier = famous.core.Modifier
    var Transform = famous.core.Transform
    var Surface = famous.core.Surface
    var ImageSurface = famous.surfaces.ImageSurface

    var mainContext = Engine.createContext()

    var logo = new ImageSurface({
        size: [200, 200],
        content: 'http://code.famo.us/assets/famous_logo.svg',
        classes: ['double-sided']
    })

    var initialTime = Date.now()
    var centerSpinModifier = new Modifier({
        origin: [0.5, 0.5],
        align: [0.5, 0.5],
        transform : function () {
            return Transform.rotateY(0.002 * (Date.now() - initialTime))
        }
    })

    mainContext.add(centerSpinModifier).add(logo)

    var attachButton = new Surface({
      size: [200, 40],
      content: 'Attach style sheet',
      classes: [buttonsSheet.classes.attach]
    })
    attachButton.on('click', function () {
      baseSheet.attach()
    })
    mainContext
        .add(new Modifier({transform: Transform.translate(10, 10)}))
        .add(attachButton)


    var detachButton = new Surface({
      size: [200, 40],
      content: 'Detach style sheet',
      classes: [buttonsSheet.classes.detach]
    })
    detachButton.on('click', function () {
      baseSheet.detach()
    })
    mainContext
        .add(new Modifier({transform: Transform.translate(10, 60)}))
        .add(detachButton)

    var sourceButton = new Surface({
      size: [200, 40],
      content: 'View source',
      // Using style declarations inline.
      properties: buttonsSheet.getRule('source').style
    })
    sourceButton.on('click', function () {
      location.href = 'http://github.com/jsstyles/jss/tree/master/examples/famous'
    })
    mainContext
        .add(new Modifier({transform: Transform.translate(10, 110)}))
        .add(sourceButton)

}())
