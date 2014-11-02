#!/usr/bin/env node

var css = require('css')
var fs = require('fs')
var path = require('path')
var program = require('commander')

/**
 * Convert rules from css ast to jss style.
 *
 * @param {Array} cssRules
 * @return {Object}
 */
function toJss(cssRules) {
    var jssRules = {}

    function addRule(rule, rules) {
        var key, style = {}
        key = rule.selectors.join(', ')
        rule.declarations.forEach(function (decl) {
            style[decl.property] = decl.value
        })
        rules[key] = style
    }

    cssRules.forEach(function (rule) {
        switch (rule.type) {
            case 'rule':
                addRule(rule, jssRules)
                break
            case 'media':
                var key = '@media ' + rule.media
                var value = {}
                rule.rules.forEach(function(rule) {
                    addRule(rule, value)
                })
                jssRules[key] = value
                break
            case 'font-face':
                var key = '@' + rule.type
                var value = {}
                rule.declarations.forEach(function (decl) {
                    value[decl.property] = decl.value
                })
                jssRules[key] = value
                break
            case 'keyframes':
                var key = '@' + rule.type + ' ' + rule.name
                var value = {}
                rule.keyframes.forEach(function (keyframe) {
                    var frameKey = keyframe.values.join(', ')
                    var frameValue = {}
                    keyframe.declarations.forEach(function (decl) {
                        frameValue[decl.property] = decl.value
                    })
                    value[frameKey] = frameValue
                })
                jssRules[key] = value
        }
    })

    return jssRules;
}

program
    .version(require('../package.json').version)
    .option('<source>', 'path to the source file')
    .option('-p, --pretty', 'prettify result')
    .option('-e, --export [export]', 'string to add before the json to make it accessible, defaults to "module.exports = "', String, 'module.exports = ')

program
    .command('*')
    .description('path to the source file')
    .action(function (path) {
        program.sourcePath = path
    })

program.parse(process.argv)

if (!program.args.length) return program.help()

var source = {
    path: program.sourcePath
}
if (source.path[0] != '/') source.path = path.resolve(process.cwd(), source.path)

source.code = fs.readFileSync(source.path, 'utf-8')
source.ast = css.parse(source.code)
if (source.ast && source.ast.stylesheet && source.ast.stylesheet && source.ast.stylesheet.rules) {
    var jss = toJss(source.ast.stylesheet.rules)
    var space = program.pretty ? '  ' : ''
    var output = JSON.stringify(jss, null, space)
    output = program.export + output + ';'
    console.log(output)
}

