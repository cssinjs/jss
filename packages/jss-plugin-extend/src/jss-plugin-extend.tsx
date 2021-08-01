// jss   (builds css  using javascript):
import type {
    Plugin,
    JssStyle,

    Rule,
    StyleSheet,
}                           from 'jss'           // base technology of our nodestrap components

// others:
import warning              from 'tiny-warning'



// utilities:
type LiteralObject      = { [key: string]: any }
const isLiteralObject   = (object: any): object is LiteralObject => object && (typeof(object) === 'object') && !Array.isArray(object);

// upgrade `JssStyle` definition:
type Optional<T>        = T|null|undefined
type ExtendableObject   = JssStyle|string // extend using a JssStyle object or using a rule name
type SingleExtend       = Optional<ExtendableObject>
type Extend             = SingleExtend|SingleExtend[]
type Style              = JssStyle & { extend?: Optional<Extend> } // add `extend` prop into `JssStyle`
// export the upgraded `JssStyle`:
export type { Style, Style as ExtendableStyle, Style as JssStyle }
const isStyle           = (object: any): object is Style => isLiteralObject(object);



const mergeExtend       = (style: Style, rule?: Rule, sheet?: StyleSheet): void => {
    const extend = style.extend;
    if (!extend) return; // nothing to extend


    
    // if `extend` is an `Array` => loop it
    // otherwise => convert to single `Array` => loop it
    for (const singleExtend of (Array.isArray(extend) ? extend : [extend])) {
        if (!singleExtend) continue; // null & undefined => skip
        
        
        
        //#region extend using a `Style`
        if (isStyle(singleExtend)) {
            mergeStyle(style, singleExtend, rule, sheet);
        } // if
        //#endregion extend using a `Style`
        
        
        
        //#region extend using a rule name
        else if (typeof(singleExtend) === 'string') {
            if (sheet) {
                const refRule = sheet.getRule(singleExtend) as Optional<Rule>;
                if (refRule) {
                    if (refRule === rule) {
                        warning(false, `[JSS] A rule tries to extend itself \n${rule.toString()}`);
                        
                        // TODO: detect circular ref, causing infinite recursive
                    }
                    else {
                        // now it seems the `refRule` is not `rule` nor circular ref
                        // warning: calling `mergeStyle` might causing infinite recursive if the `refRule` is `rule` or circular ref
                        
                        const ruleStyle = (refRule.options?.parent as any)?.rules?.raw?.[singleExtend] as Optional<Style>;
                        if (ruleStyle) {
                            mergeStyle(style, ruleStyle, rule, sheet);
                        } // if
                    } // if
                } // if
            } // if
        } // if
        //#endregion extend using a rule name
    } // for



    // the `extend` operation has been completed => remove unused `extend` prop:
    // delete style.extend;
    style.extend = null; // maybe it's safer not to remove the `style`'s prop, instead set it to `null`
}
const mergeLiteral      = (style: Style & LiteralObject, newStyle: Style, rule?: Rule, sheet?: StyleSheet): void => {
    for (const [name, newValue] of Object.entries(newStyle)) { // loop through `newStyle`'s props
        // `extend` is a special prop that we don't handle here:
        if (name === 'extend') continue; // skip `extend` prop



        if (!isStyle(newValue)) {
            // `newValue` is not a `Style` => unmergeable => add/overwrite `newValue` into `style`:
            style[name] = newValue; // add/overwrite
        }
        else {
            // `newValue` is a `Style` => possibility to merge with `currentValue`

            const currentValue = style[name];
            if (!isStyle(currentValue)) {
                // `currentValue` is not a `Style` => unmergeable => add/overwrite `newValue` into `style`:
                style[name] = newValue; // add/overwrite
            }
            else {
                // both `newValue` & `currentValue` are `Style` => merge them recursively (deeply):

                const currentValueClone = {...currentValue} as Style; // clone the `currentValue` to avoid side effect, because the `currentValue` is not **the primary object** we're working on
                mergeStyle(currentValueClone, newValue, rule, sheet);
                style[name] = currentValueClone; // set the mutated `currentValueClone` back to `style`
            } // if
        } // if
    } // for
}
// we export `mergeStyle` so it reusable:
export const mergeStyle = (style: Style, newStyle: Style, rule?: Rule, sheet?: StyleSheet): void => {
    const newStyleClone = {...newStyle} as Style; // clone the `newStyle` to avoid side effect, because the `newStyle` is not **the primary object** we're working on
    mergeExtend(newStyleClone, rule, sheet);

    mergeLiteral(style, newStyleClone, rule, sheet);
}



export default function pluginExtend(): Plugin { return {
    onProcessStyle: (style: Style, rule: Rule, sheet?: StyleSheet): Style => {
        mergeExtend(style, rule, sheet);



        return style;
    },

    onChangeValue: (value: any, prop: string, rule: Rule): string|null|false => {
        if (prop !== 'extend') return value; // do not modify any props other than `extend`



        const __prevObject = '__prevObject';
        if (typeof(value) === 'object') {
            const ruleProp = (rule as any).prop;
            if (typeof(ruleProp) === 'function') {
                for (const [propName, propVal] of Object.entries(value)) {
                    ruleProp(propName, propVal);
                } // for


                
                // store the object to the rule, so we can remove all props we've set later:
                (rule as any)[__prevObject] = value;
            } // if
        }
        else if ((value === null) || (value === false)) {
            // remove all props we've set before (if any):
            const prevObject = (rule as any)[__prevObject];
            if (prevObject) {
                const ruleProp = (rule as any).prop;
                if (typeof(ruleProp) === 'function') {
                    for (const propName of Object.keys(prevObject)) {
                        ruleProp(propName, null);
                    } // for
                } // if



                // clear the stored object:
                delete (rule as any)[__prevObject];
            } // if
        } // if

        
        
        return null; // do not set the value in the core
    },
}}