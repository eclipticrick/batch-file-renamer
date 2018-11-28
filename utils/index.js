const console = require('better-console');
const steps = require('./steps');

module.exports = {
    logInfo: () => console.info(`\nPossible commands: cancel / exit`),
    logError: (message) => console.warn(message + '\n'),
    logQuestion: (step) => console.log(steps[step].question()),
    action: (step, answer) => steps[step].action(answer)
};
