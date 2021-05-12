const arg = require('arg');
const inquirer = require('inquirer');

// slice arguments
function parseArgumentsIntoOptions(rawArgs) {
    console.log('start')
    const args = arg({
        '--git': Boolean,
        '--yes': Boolean,
        '--install': Boolean,
        '-g': '--git',
        '-y': '--yes',
        '-i': '--install',
    }, {
        argv: rawArgs,
    });
    return {
        skipPrompts: args['--yes'] || false,
        git: args['--git'] || false,
        template: args._[0],
        runInstall: args['--install'] || false,
    };
}

const argsss = process.argv.slice(2);
//console.log(argsss);

console.log(parseArgumentsIntoOptions(argsss));