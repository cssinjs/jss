// @flow

import {StylePropertyMap} from './cssom'

export type DOMString = string

export interface HTMLElementWithStyleMap extends HTMLElement {
  +attributeStyleMap?: StylePropertyMap;
}
