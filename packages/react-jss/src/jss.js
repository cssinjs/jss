// @flow
import {create, type JssOptions} from 'jss'
import preset from 'jss-preset-default'

export const createJss = (options?: Partial<JssOptions>) => {
  return create({
    ...preset(),
    ...(options || {})
  })
}

export default create(preset())
