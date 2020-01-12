// @flow
import {type Plugin} from 'jss'
import parse from './parse'

const onProcessRule = rule => {
  if (typeof rule.style === 'string') {
    // $FlowFixMe: We can safely assume that rule has the style property
    rule.style = parse(rule.style)
  }
}

const onProcessStyle = style => {
    if (typeof style === 'string') {
        return parse(style);
    }
    return style;
}

export default function templatePlugin(): Plugin {
  return {onProcessRule, onProcessStyle}
}
