/** @jsx jsx */
import expect from 'expect.js'
import TestRenderer from 'react-test-renderer'
import {create as createJss} from 'jss'
import {create as createCss} from 'css-jss'
import {create as createJsx} from './jsx'
import {createGenerateId} from '../../../tests/utils'

let currJsx

const jsx = (...args) => currJsx(...args)

describe('React-JSS: jsx', () => {
  beforeEach(() => {
    const jss = createJss({createGenerateId})
    const css = createCss(jss)
    currJsx = createJsx(css)
  })

  it('should render', () => {
    const renderer = TestRenderer.create(
      <div className="test" css={{color: 'red'}}>
        <span>test1</span>
        <span>test2</span>
      </div>
    )
    expect(renderer.toJSON()).to.eql({
      type: 'div',
      props: {
        className: 'test css-0-id'
      },
      children: [
        {
          type: 'span',
          props: {},
          children: ['test1']
        },
        {
          type: 'span',
          props: {},
          children: ['test2']
        }
      ]
    })
  })
})
