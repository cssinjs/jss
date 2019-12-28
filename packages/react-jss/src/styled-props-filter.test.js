// @flow
import expect from 'expect.js'
import React, {type StatelessFunctionalComponent} from 'react'
import TestRenderer from 'react-test-renderer'
import {stripIndent} from 'common-tags'
import {styled, JssProvider, SheetsRegistry} from '.'

type Props = Object

const createGenerateId = () => {
  let counter = 0
  return rule => `${rule.key}-${counter++}`
}

const renderToJSON = children => {
  const registry = new SheetsRegistry()
  return {
    tree: TestRenderer.create(
      <JssProvider registry={registry} generateId={createGenerateId()}>
        {children}
      </JssProvider>
    ).toJSON(),
    css: registry.toString()
  }
}

describe('React-JSS: styled props filter', () => {
  it('should compose shouldForwardProp on composed styled components', () => {
    const StyledDiv = styled('div', {
      shouldForwardProp: prop => prop === 'forwardMe'
    })()

    const ComposedDiv = styled(StyledDiv, {
      shouldForwardProp: () => true
    })()

    const {tree} = renderToJSON(<ComposedDiv filterMe forwardMe />)

    expect(tree).to.eql({
      type: 'div',
      props: {forwardMe: true, className: ''},
      children: null
    })
  })

  it('should enable custom shouldForwardProp', () => {
    const Svg: StatelessFunctionalComponent<Props> = props => (
      <svg {...props}>
        <rect x="10" y="10" height="100" width="100" style={{stroke: '#ff0000'}} />
      </svg>
    )

    const StyledSvg = styled(Svg, {
      shouldForwardProp: prop => ['className', 'width', 'height'].indexOf(prop) !== -1
    })({
      fill: ({color}) => color
    })

    const {tree, css} = renderToJSON(<StyledSvg color="#0000ff" width="100px" height="100px" />)

    expect(css).to.be(stripIndent`
      .sc-0 {}
      .sc-d0-1 {
        fill: #0000ff;
      }
    `)
    expect(tree).to.eql({
      type: 'svg',
      props: {width: '100px', height: '100px', className: 'sc-0 sc-d0-1'},
      children: [
        {
          type: 'rect',
          props: {x: '10', y: '10', height: '100', width: '100', style: {stroke: '#ff0000'}},
          children: null
        }
      ]
    })
  })

  it('should inherit shouldForwardProp for wrapped styled components', () => {
    const Div1 = styled('div', {
      shouldForwardProp: prop => prop !== 'color'
    })({
      color: ({color}) => color
    })

    const Div2 = styled(Div1)()

    const {css, tree} = renderToJSON(
      <>
        <Div1 color="red" id="test-1" />
        <Div2 color="green" id="test-2" />
      </>
    )

    expect(css.trim()).to.be(stripIndent`
      .sc-0 {}
      .sc-d0-1 {
        color: red;
      }
      .sc-d1-2 {
        color: green;
      }
    `)
    expect(tree).to.eql([
      {type: 'div', props: {id: 'test-1', className: 'sc-0 sc-d0-1'}, children: null},
      {type: 'div', props: {id: 'test-2', className: 'sc-0 sc-d1-2'}, children: null}
    ])
  })

  it('prop filtering', () => {
    const Link = styled('a')({color: 'green'})
    const rest = {m: [3], pt: [4]}

    const {css, tree} = renderToJSON(
      <Link
        a
        b
        wow
        prop
        filtering
        is
        cool
        aria-label="some label"
        data-wow="value"
        href="link"
        {...rest}
      >
        hello world
      </Link>
    )

    expect(css).to.be(stripIndent`
      .sc-0 {
        color: green;
      }
    `)
    expect(tree).to.eql({
      type: 'a',
      props: {
        is: true,
        'aria-label': 'some label',
        'data-wow': 'value',
        href: 'link',
        className: 'sc-0'
      },
      children: ['hello world']
    })
  })

  it('should not filter on non string tags', () => {
    // eslint-disable-next-line jsx-a11y/anchor-has-content
    const Comp: StatelessFunctionalComponent<Props> = props => <a {...props} />
    const Link = styled(Comp)({color: 'green'})

    const {css, tree} = renderToJSON(
      <Link a b wow prop filtering is cool aria-label="some label" data-wow="value" href="link">
        hello world
      </Link>
    )
    expect(css).to.be(stripIndent`
      .sc-0 {
        color: green;
      }
    `)
    expect(tree).to.eql({
      type: 'a',
      props: {
        a: true,
        b: true,
        wow: true,
        prop: true,
        filtering: true,
        is: true,
        cool: true,
        'aria-label': 'some label',
        'data-wow': 'value',
        href: 'link',
        className: 'sc-0'
      },
      children: ['hello world']
    })
  })

  it.skip('no prop filtering on string tags started with upper case', () => {
    const Link = styled('SomeCustomLink')({color: 'green'})

    const {tree} = renderToJSON(
      <Link a b wow prop filtering is cool aria-label="some label" data-wow="value" href="link">
        hello world
      </Link>
    )

    expect(tree).to.eql({})
  })

  it('basic SVG attributes survive prop filtering', () => {
    const RedCircle = styled('circle')({
      fill: '#ff0000',
      strokeWidth: 0.26458332
    })

    const {tree} = renderToJSON(<RedCircle r="9.8273811" cy="49.047619" cx="65.011902" />)
    expect(tree).to.eql({
      type: 'circle',
      props: {r: '9.8273811', cy: '49.047619', cx: '65.011902', className: 'sc-0'},
      children: null
    })
  })

  it('all SVG attributes survive prop filtering', () => {
    const svgAttributes = {
      accentHeight: 'abcd',
      accumulate: 'abcd',
      additive: 'abcd',
      alignmentBaseline: 'abcd',
      allowReorder: 'abcd',
      alphabetic: 'abcd',
      amplitude: 'abcd',
      arabicForm: 'abcd',
      ascent: 'abcd',
      attributeName: 'abcd',
      attributeType: 'abcd',
      autoReverse: 'abcd',
      azimuth: 'abcd',
      baseFrequency: 'abcd',
      baselineShift: 'abcd',
      baseProfile: 'abcd',
      bbox: 'abcd',
      begin: 'abcd',
      bias: 'abcd',
      by: 'abcd',
      calcMode: 'abcd',
      capHeight: 'abcd',
      clip: 'abcd',
      clipPathUnits: 'abcd',
      clipPath: 'abcd',
      clipRule: 'abcd',
      colorInterpolation: 'abcd',
      colorInterpolationFilters: 'abcd',
      colorProfile: 'abcd',
      colorRendering: 'abcd',
      contentScriptType: 'abcd',
      contentStyleType: 'abcd',
      cursor: 'abcd',
      cx: 'abcd',
      cy: 'abcd',
      d: 'abcd',
      decelerate: 'abcd',
      descent: 'abcd',
      diffuseConstant: 'abcd',
      direction: 'abcd',
      display: 'abcd',
      divisor: 'abcd',
      dominantBaseline: 'abcd',
      dur: 'abcd',
      dx: 'abcd',
      dy: 'abcd',
      edgeMode: 'abcd',
      elevation: 'abcd',
      enableBackground: 'abcd',
      end: 'abcd',
      exponent: 'abcd',
      externalResourcesRequired: 'abcd',
      fill: 'abcd',
      fillOpacity: 'abcd',
      fillRule: 'abcd',
      filter: 'abcd',
      filterRes: 'abcd',
      filterUnits: 'abcd',
      floodColor: 'abcd',
      floodOpacity: 'abcd',
      fontFamily: 'abcd',
      fontSize: 'abcd',
      fontSizeAdjust: 'abcd',
      fontStretch: 'abcd',
      fontStyle: 'abcd',
      fontVariant: 'abcd',
      fontWeight: 'abcd',
      format: 'abcd',
      from: 'abcd',
      // fr: 'abcd', React doesn't seem to allow this on any element but it should be legal on radialGradients
      fx: 'abcd',
      fy: 'abcd',
      g1: 'abcd',
      g2: 'abcd',
      glyphName: 'abcd',
      glyphOrientationHorizontal: 'abcd',
      glyphOrientationVertical: 'abcd',
      glyphRef: 'abcd',
      gradientTransform: 'abcd',
      gradientUnits: 'abcd',
      hanging: 'abcd',
      horizAdvX: 'abcd',
      horizOriginX: 'abcd',
      ideographic: 'abcd',
      imageRendering: 'abcd',
      in: 'abcd',
      in2: 'abcd',
      intercept: 'abcd',
      k: 'abcd',
      k1: 'abcd',
      k2: 'abcd',
      k3: 'abcd',
      k4: 'abcd',
      kernelMatrix: 'abcd',
      kernelUnitLength: 'abcd',
      kerning: 'abcd',
      keyPoints: 'abcd',
      keySplines: 'abcd',
      keyTimes: 'abcd',
      lengthAdjust: 'abcd',
      letterSpacing: 'abcd',
      lightingColor: 'abcd',
      limitingConeAngle: 'abcd',
      local: 'abcd',
      markerEnd: 'abcd',
      markerMid: 'abcd',
      markerStart: 'abcd',
      markerHeight: 'abcd',
      markerUnits: 'abcd',
      markerWidth: 'abcd',
      mask: 'abcd',
      maskContentUnits: 'abcd',
      maskUnits: 'abcd',
      mathematical: 'abcd',
      mode: 'abcd',
      numOctaves: 'abcd',
      offset: 'abcd',
      opacity: 'abcd',
      operator: 'abcd',
      order: 'abcd',
      orient: 'abcd',
      orientation: 'abcd',
      origin: 'abcd',
      overflow: 'abcd',
      overlinePosition: 'abcd',
      overlineThickness: 'abcd',
      panose1: 'abcd',
      paintOrder: 'abcd',
      pathLength: 'abcd',
      patternContentUnits: 'abcd',
      patternTransform: 'abcd',
      patternUnits: 'abcd',
      pointerEvents: 'abcd',
      points: 'abcd',
      pointsAtX: 'abcd',
      pointsAtY: 'abcd',
      pointsAtZ: 'abcd',
      preserveAlpha: 'abcd',
      preserveAspectRatio: 'abcd',
      primitiveUnits: 'abcd',
      r: 'abcd',
      radius: 'abcd',
      refX: 'abcd',
      refY: 'abcd',
      renderingIntent: 'abcd',
      repeatCount: 'abcd',
      repeatDur: 'abcd',
      requiredExtensions: 'abcd',
      requiredFeatures: 'abcd',
      restart: 'abcd',
      result: 'abcd',
      rotate: 'abcd',
      rx: 'abcd',
      ry: 'abcd',
      scale: 'abcd',
      seed: 'abcd',
      shapeRendering: 'abcd',
      slope: 'abcd',
      spacing: 'abcd',
      specularConstant: 'abcd',
      specularExponent: 'abcd',
      speed: 'abcd',
      spreadMethod: 'abcd',
      startOffset: 'abcd',
      stdDeviation: 'abcd',
      stemh: 'abcd',
      stemv: 'abcd',
      stitchTiles: 'abcd',
      stopColor: 'abcd',
      stopOpacity: 'abcd',
      strikethroughPosition: 'abcd',
      strikethroughThickness: 'abcd',
      string: 'abcd',
      stroke: 'abcd',
      strokeDasharray: 'abcd',
      strokeDashoffset: 'abcd',
      strokeLinecap: 'abcd',
      strokeLinejoin: 'abcd',
      strokeMiterlimit: 'abcd',
      strokeOpacity: 'abcd',
      strokeWidth: 'abcd',
      surfaceScale: 'abcd',
      systemLanguage: 'abcd',
      tabIndex: 'abcd',
      tableValues: 'abcd',
      targetX: 'abcd',
      targetY: 'abcd',
      textAnchor: 'abcd',
      textDecoration: 'abcd',
      textRendering: 'abcd',
      textLength: 'abcd',
      to: 'abcd',
      transform: 'abcd',
      u1: 'abcd',
      u2: 'abcd',
      underlinePosition: 'abcd',
      underlineThickness: 'abcd',
      unicode: 'abcd',
      unicodeBidi: 'abcd',
      unicodeRange: 'abcd',
      unitsPerEm: 'abcd',
      vAlphabetic: 'abcd',
      vHanging: 'abcd',
      vIdeographic: 'abcd',
      vMathematical: 'abcd',
      values: 'abcd',
      version: 'abcd',
      vertAdvY: 'abcd',
      vertOriginX: 'abcd',
      vertOriginY: 'abcd',
      viewBox: 'abcd',
      viewTarget: 'abcd',
      visibility: 'abcd',
      widths: 'abcd',
      wordSpacing: 'abcd',
      writingMode: 'abcd',
      x: 'abcd',
      xHeight: 'abcd',
      x1: 'abcd',
      x2: 'abcd',
      xChannelSelector: 'abcd',
      xlinkActuate: 'abcd',
      xlinkArcrole: 'abcd',
      xlinkHref: 'abcd',
      xlinkRole: 'abcd',
      xlinkShow: 'abcd',
      xlinkTitle: 'abcd',
      xlinkType: 'abcd',
      xmlBase: 'abcd',
      xmlLang: 'abcd',
      xmlSpace: 'abcd',
      y: 'abcd',
      y1: 'abcd',
      y2: 'abcd',
      yChannelSelector: 'abcd',
      z: 'abcd',
      zoomAndPan: 'abcd'
    }

    const RedPath = styled('path')({
      strokeWidth: 0.26458332
    })

    const {tree} = renderToJSON(<RedPath {...svgAttributes} />)

    expect(tree).to.eql({
      type: 'path',
      props: {
        ...svgAttributes,
        className: 'sc-0'
      },
      children: null
    })
  })

  it('prop filtering on composed styled components that are string tags', () => {
    const BaseLink = styled('a')({background: 'red'})
    const Link = styled(BaseLink)({color: 'green'})

    const {css, tree} = renderToJSON(
      <Link
        wow
        prop
        filtering
        looks
        cool
        but
        is
        kind
        of
        a
        bad
        idea
        since
        the
        react
        warnings
        will
        not
        work
        and
        it="is"
        problematic
        for="other reasons"
        aria-label="some label"
        data-wow="value"
        href="link"
      >
        hello world
      </Link>
    )

    expect(css).to.be(stripIndent`
      .sc-1 {
        background: red;
      }
      .sc-0 {
        color: green;
      }
    `)
    expect(tree).to.eql({
      type: 'a',
      props: {
        is: true,
        kind: true,
        for: 'other reasons',
        'aria-label': 'some label',
        'data-wow': 'value',
        href: 'link',
        className: 'sc-0 sc-1'
      },
      children: ['hello world']
    })
  })
})
