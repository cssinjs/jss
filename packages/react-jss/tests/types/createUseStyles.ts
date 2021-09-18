import {createUseStyles} from '../../src'

type DefaultTheme = Jss.Theme

interface MyProps {
  property: string
}

interface MyTheme {
  color: 'red'
}

const expectedCustomProps = {property: ''}
const expectedDefaultTheme: DefaultTheme = {defaultFontSize: 0, themeColour: ''}
const expectedCustomTheme: MyTheme = {color: 'red'}

/* -------------------- THEME ARGUMENT -------------------- */
// Regular, static styles work fine
const themeArg1 = createUseStyles((theme) => ({
  someClassName: '',
  anotherClassName: {
    fontWeight: 'bold'
  }
}))
const themeArg1ClassesPass = themeArg1()

// Theme type assumed to be the default
// Nested theme declaration banned
// @ts-expect-error
const themeArg2 = createUseStyles((theme) => ({
  themeNotAllowed: ({theme: innerTheme}) => ({
    fontWeight: 'bold'
  })
}))
// @ts-expect-error
const themeArg2ClassesFail = themeArg2({theme: {}})
// @ts-expect-error
const themeArg2ClassesFail2 = themeArg2({theme: expectedCustomTheme})
const themeArg2ClassesPass = themeArg2({theme: expectedDefaultTheme})

// Props declaration is allowed
const themeArg3 = createUseStyles<string, MyProps>((theme) => ({
  onlyPropsAllowed: ({...props}) => ({
    fontWeight: 'bold'
  })
}))
// @ts-expect-error
const themeArg3ClassesFail = themeArg3({property: 0})
// @ts-expect-error
const themeArg3ClassesFail2 = themeArg3({...expectedCustomProps, theme: expectedCustomTheme})
const themeArg3ClassesPass = themeArg3(expectedCustomProps)
const themeArg3ClassesPass2 = themeArg3({...expectedCustomProps, theme: expectedDefaultTheme})

// Nested props declaration banned
const themeArg4 = createUseStyles<string, MyProps>((theme) => ({
  onlyPropsAllowed: ({...props}) => ({
    fontWeight: 'bold',
    // @ts-expect-error
    propsNotAllowed: ({...innerProps}) => ''
  })
}))

// Supplied theme type is acknowledged
const themeArg5 = createUseStyles<string, unknown, MyTheme>((theme) => ({}))
// @ts-expect-error
const themeArg5ClassesFail = themeArg5({theme: {}})
// @ts-expect-error
const themeArg5ClassesFail2 = themeArg5({theme: expectedDefaultTheme})
const themeArg5ClassesPass = themeArg5({theme: expectedCustomTheme})

// Custom theme can be determined from argument
const themeArg6 = createUseStyles((theme: MyTheme) => ({
  someClassName: {
    fontWeight: 'bold'
  }
}))
// @ts-expect-error
const themeArg6ClassesFail = themeArg6({theme: {}})
// @ts-expect-error
const themeArg6ClassesFail2 = themeArg6({theme: expectedDefaultTheme})
const themeArg6ClassesPass = themeArg6({theme: expectedCustomTheme})

// Props can be determined implicitly
const themeArg7 = createUseStyles((theme) => ({
  checkbox: ({property}: MyProps) => ({
    borderColor: property
  })
}))

// @ts-expect-error invalid props
const themeArg7ClassesFail = themeArg7({colour: 'green'})
// @ts-expect-error extraneous props
const themeArg7ClassesFail2 = themeArg7({...expectedCustomProps, someUnTypedProp: 1})
const themeArg7ClassesPass = themeArg7(expectedCustomProps)

// Classes check
const themeArgClasses7String: string = themeArg7ClassesPass.checkbox
// @ts-expect-error invalid className
themeArg7ClassesPass.doesntExist

/* -------------------- NO THEME ARGUMENT -------------------- */
// Regular, static styles work fine
const noThemeArg1 = createUseStyles({
  someClassName: '',
  anotherClassName: {
    fontWeight: 'bold'
  }
})
const noThemeArg1ClassesPass = noThemeArg1()

// Theme declaration is allowed, but not nested theme declaration
// Theme type assumed to be the default
const noThemeArg2 = createUseStyles({
  themeOnly: ({theme}) => ({
    fontWeight: 'bold',
    // @ts-expect-error
    themeNotAllowed: ({theme: innerTheme}) => '',
    '& > *': {
      color: 'red',
      // @ts-expect-error
      themeNotAllowed: ({theme: innerMostTheme}) => ''
    }
  })
})
// @ts-expect-error
const noThemeArg2ClassesFail = noThemeArg2({theme: {}})
// @ts-expect-error
const noThemeArg2ClassesFail2 = noThemeArg2({theme: expectedCustomTheme})
const noThemeArg2ClassesPass = noThemeArg2({theme: expectedDefaultTheme})

// Props declaration is allowed, but not nested props declaration
const noThemeArg3 = createUseStyles<string, MyProps>({
  propsAndTheme: ({property, theme}) => ({
    fontWeight: 'bold',
    // @ts-expect-error
    nothingAllowed: ({property: innerProperty}) => '',
    '& > *': {
      color: 'red',
      // @ts-expect-error
      nothingAllowed: ({property: innerMostProperty}) => ''
    }
  })
})
// @ts-expect-error
const noThemeArg3ClassesFail = noThemeArg3({property: 0})
// @ts-expect-error
const noThemeArg3ClassesFail2 = noThemeArg3({...expectedCustomProps, theme: expectedCustomTheme})
const noThemeArg3ClassesPass = noThemeArg3(expectedCustomProps)
const noThemeArg3ClassesPass2 = noThemeArg3({...expectedCustomProps, theme: expectedDefaultTheme})

// Props and Theme types are properly acknowledged when supplied
const noThemeArg4 = createUseStyles<string, MyProps, MyTheme>({
  propsAndTheme: ({property, theme}) => ({
    fontWeight: 'bold',
    // @ts-expect-error
    nothingAllowed: ({theme: innerTheme, ...innerProps}) => '',
    '& > *': {
      color: 'red',
      // @ts-expect-error
      nothingAllowed: ({theme: innerMostTheme, ...innerMostProps}) => ''
    }
  })
})
// @ts-expect-error
const noThemeArg4ClassesFail = noThemeArg4({property: 0})
// @ts-expect-error
const noThemeArg4ClassesFail2 = noThemeArg4({...expectedCustomProps, theme: expectedDefaultTheme})
const noThemeArg4ClassesPass = noThemeArg4(expectedCustomProps)
const noThemeArg4ClassesPass2 = noThemeArg4({...expectedCustomProps, theme: expectedCustomTheme})

// Nested declarations are banned (single nest test)
const noThemeArg5 = createUseStyles<string, MyProps, MyTheme>({
  singleNest: {
    fontWeight: 'bold',
    singleValue: ({property, theme}) => '',
    nestOne: ({property, theme}) => ({
      color: 'red',
      // @ts-expect-error
      nothingAllowed: ({theme: innerTheme, ...innerProps}) => ''
    })
  }
})

// Nested declarations are banned (double nest test)
const noThemeArg6 = createUseStyles<string, MyProps, MyTheme>({
  doubleNest: {
    fontWeight: 'bold',
    singleValue: ({property, theme}) => '',
    firstNest: {
      color: 'red',
      innerSingleValue: ({property, theme}) => '',
      secondNest: ({property, theme}) => ({
        backgroundColor: 'blue',
        // @ts-expect-error
        nothingAllowed: ({theme: innerTheme, ...innerProps}) => ''
      })
    }
  }
})

// Nested declarations are banned (triple nest test)
const noThemeArg7 = createUseStyles<string, MyProps, MyTheme>({
  tripleNest: {
    fontWeight: 'bold',
    singleValue: ({property, theme}) => '',
    firstNest: {
      color: 'red',
      innerSingleValue: ({property, theme}) => '',
      secondNest: {
        backgroundColor: 'blue',
        innerMostSingleValue: ({property, theme}) => '',
        thirdNest: ({property, theme}) => ({
          display: 'block',
          // @ts-expect-error
          nothingAllowed: ({theme: innerMostTheme, ...innerMostProps}) => ''
        })
      }
    }
  }
})

// Props can be determined implicitly
const noThemeArg8 = createUseStyles({
  checkbox: ({property}: MyProps) => ({
    borderColor: property
  })
})

// @ts-expect-error invalid props
const noThemeArg8ClassesFail = noThemeArg8({colour: 'green'})
// @ts-expect-error extraneous props
const noThemeArg8ClassesFail2 = noThemeArg8({...expectedCustomProps, someUnTypedProp: 1})
const noThemeArg8ClassesPass = noThemeArg8(expectedCustomProps)

// Classes check
const noThemeArg8ClassesString: string = noThemeArg8ClassesPass.checkbox
// @ts-expect-error invalid className
noThemeArg8ClassesPass.doesntExist
