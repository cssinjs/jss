// @flow
/* eslint-disable react/prop-types */
import expect from 'expect.js'
import React, {type StatelessFunctionalComponent} from 'react'
import TestRenderer from 'react-test-renderer'
import {stripIndent} from 'common-tags'
import {styled, SheetsRegistry, JssProvider, ThemeProvider} from '.'

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

describe('React-JSS: styled', () => {
  it('should render static styles', () => {
    const Div = styled('div')({color: 'red'})
    const {css, tree} = renderToJSON(<Div />)
    expect(css).to.be(stripIndent`
      .sc-0 {
        color: red;
      }
    `)
    expect(tree).to.eql({
      type: 'div',
      props: {className: 'sc-0'},
      children: null
    })
  })

  it('should render dynamic values', () => {
    const Div = styled('div')({
      color: 'red',
      width: props => props.width
    })
    const {css, tree} = renderToJSON(<Div width={10} />)

    expect(css).to.be(stripIndent`
      .sc-0 {
        color: red;
      }
      .sc-d0-1 {
        width: 10px;
      }
    `)

    expect(tree).to.eql({
      type: 'div',
      props: {
        width: 10,
        className: 'sc-0 sc-d0-1'
      },
      children: null
    })
  })

  it('should render dynamic rules', () => {
    const Div = styled('div')(props => ({
      color: 'red',
      width: props.width
    }))
    const {css, tree} = renderToJSON(<Div width={10} />)
    expect(css).to.be(stripIndent`
      .scd-0 {}
      .scd-d0-1 {
        color: red;
        width: 10px;
      }
    `)
    expect(tree).to.eql({
      type: 'div',
      props: {
        width: 10,
        className: 'scd-0 scd-d0-1'
      },
      children: null
    })
  })

  it('should accept multiple static style rules', () => {
    // TODO add a template string case
    const Div = styled('div')({color: 'red'}, {border: '1px solid red'})
    const {css, tree} = renderToJSON(<Div />)
    expect(css).to.be(stripIndent`
      .sc-0 {
        color: red;
        border: 1px solid red;
      }
    `)
    expect(tree).to.eql({
      type: 'div',
      props: {
        className: 'sc-0'
      },
      children: null
    })
  })

  it('should filter empty values instead of rules', () => {
    const Div = styled('div')('', {color: 'red'}, null, {border: '1px solid red'}, undefined)
    const {css, tree} = renderToJSON(<Div />)
    expect(css).to.be(stripIndent`
      .sc-0 {
        color: red;
        border: 1px solid red;
      }
    `)
    expect(tree).to.eql({
      type: 'div',
      props: {
        className: 'sc-0'
      },
      children: null
    })
  })

  it('should accept multiple dynamic style rules', () => {
    const Div = styled('div')(props => ({width: props.width}), props => ({height: props.height}))
    const {css, tree} = renderToJSON(<Div width={10} height={10} />)
    expect(css).to.be(stripIndent`
      .scd-0 {}
      .scd-d0-1 {
        width: 10px;
        height: 10px;
      }
    `)
    expect(tree).to.eql({
      type: 'div',
      props: {
        width: 10,
        height: 10,
        className: 'scd-0 scd-d0-1'
      },
      children: null
    })
  })

  it('should filter empty values returned from dynamic rules', () => {
    const Div = styled('div')(() => null, () => '', () => undefined, {color: 'red'})
    const {css, tree} = renderToJSON(<Div />)
    expect(css).to.be(stripIndent`
      .sc-0 {
        color: red;
      }
      .scd-1 {}
      .scd-d0-2 {}
    `)
    expect(tree).to.eql({
      type: 'div',
      props: {
        className: 'sc-0 scd-1 scd-d0-2'
      },
      children: null
    })
  })

  it('should accept multiple dynamic and static style rules', () => {
    const Div = styled('div')(
      {color: 'red'},
      props => ({width: props.width}),
      {border: '1px solid red'},
      props => ({height: props.height})
    )
    const {css, tree} = renderToJSON(<Div width={10} height={10} />)
    expect(css).to.be(stripIndent`
      .sc-0 {
        color: red;
        border: 1px solid red;
      }
      .scd-1 {}
      .scd-d0-2 {
        width: 10px;
        height: 10px;
      }
    `)
    expect(tree).to.eql({
      type: 'div',
      props: {
        width: 10,
        height: 10,
        className: 'sc-0 scd-1 scd-d0-2'
      },
      children: null
    })
  })

  it('should accept template string', () => {})

  it('should merge with user class name', () => {
    const Div = styled('div')({color: 'red'})
    const {css, tree} = renderToJSON(<Div className="my-class" />)
    expect(css).to.be(stripIndent`
      .sc-0 {
        color: red;
      }
    `)
    expect(tree).to.eql({
      type: 'div',
      props: {
        className: 'my-class sc-0'
      },
      children: null
    })
  })

  it('should use "as" prop', () => {
    const Div = styled('div')({color: 'red'})
    const {css, tree} = renderToJSON(
      <Div as="button">
        <span />
      </Div>
    )
    expect(css).to.be(stripIndent`
      .sc-0 {
        color: red;
      }
    `)
    expect(tree).to.eql({
      type: 'button',
      props: {
        className: 'sc-0'
      },
      children: [
        {
          type: 'span',
          props: {},
          children: null
        }
      ]
    })
  })

  it('should not use "as" prop for tag name when component was passed', () => {
    const Comp: StatelessFunctionalComponent<Props> = () => <div />
    const Div = styled(Comp)({color: 'red'})
    const {css, tree} = renderToJSON(
      <Div as="button">
        <span />
      </Div>
    )
    expect(css).to.be(stripIndent`
      .sc-0 {
        color: red;
      }
    `)
    expect(tree).to.eql({type: 'div', props: {}, children: null})
  })

  it('should compose with styled component', () => {
    const BaseDiv = styled('div')({color: 'red'})
    const Div = styled(BaseDiv)({width: 10})
    const {css, tree} = renderToJSON(<Div />)
    expect(css).to.be(stripIndent`
      .sc-1 {
        color: red;
      }
      .sc-0 {
        width: 10px;
      }
    `)
    expect(tree).to.eql({
      type: 'div',
      props: {
        className: 'sc-0 sc-1'
      },
      children: null
    })
  })

  it('should pass className to a user component', () => {
    const BaseDiv: StatelessFunctionalComponent<Props> = ({className}: Props) => (
      <div className={className} />
    )
    const Div = styled(BaseDiv)({width: 10})
    const {css, tree} = renderToJSON(<Div />)
    expect(css).to.be(stripIndent`
      .sc-0 {
        width: 10px;
      }
    `)
    expect(tree).to.eql({
      type: 'div',
      props: {
        className: 'sc-0'
      },
      children: null
    })
  })

  it.skip('should target another styled component (not sure if we really need this)', () => {
    const Span = styled('span')({color: 'red'})
    const Div = styled('div')({
      // $FlowFixMe
      [Span]: {
        color: 'green'
      }
    })

    const {css, tree} = renderToJSON(<Div />)
    expect(css).to.be(stripIndent`
      .sc-0 {
        width: 10px;
      }
    `)
    expect(tree).to.eql({})
    // expect(renderer.root.findByType('div').props.className).to.be('XXX')
    // expect(renderer.root.findByType('span').props.className).to.be('XXX')
  })

  it('should render theme', () => {
    const Div = styled('div')({
      color: 'red',
      margin: props => props.theme.spacing
    })
    const {css} = renderToJSON(
      <ThemeProvider theme={({spacing: 10}: Object)}>
        <Div />
      </ThemeProvider>
    )
    expect(css).to.be(stripIndent`
      .sc-0 {
        color: red;
      }
      .sc-d0-1 {
        margin: 10px;
      }
    `)
  })

  it.skip('should override theme over props', () => {})

  it('should render label', () => {
    const Div = styled('div')({label: 'my-div', color: 'red'})
    const {css, tree} = renderToJSON(<Div />)
    expect(css).to.be(stripIndent`
      .my-div-0 {
        color: red;
      }
    `)
    expect(tree).to.eql({
      type: 'div',
      props: {
        className: 'my-div-0'
      },
      children: null
    })
  })

  it('should merge labels', () => {
    const Div = styled('div')(
      {label: 'labela', color: 'red'},
      {label: 'labelb', background: 'red'},
      {label: 'labela', float: 'left'}
    )
    const {css, tree} = renderToJSON(<Div />)
    expect(css).to.be(stripIndent`
      .labela-labelb-0 {
        color: red;
        float: left;
        background: red;
      }
    `)
    expect(tree).to.eql({
      type: 'div',
      props: {
        className: 'labela-labelb-0'
      },
      children: null
    })
  })
})
