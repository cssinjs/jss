const regExp = /([A-Z])/g
const replace = str => `-${str.toLowerCase()}`

export default (str: string): string => str.replace(regExp, replace)
