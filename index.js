const readline = require('readline');
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

const { log, info, warn } = require('better-console');
const { clearState } = require('./utils/state');
const { getStep } = require('./utils/steps');

info('Type ? to see a list of commands');
const readLine = (stepNr = 1, showBefore = true) => {
    const step = getStep(stepNr);
    if (showBefore && step.before) {
        step.before();
    }
    if(step.question) {
        log(step.question());
    }
    rl.question('', (answer) => {
        if (answer === 'exit') {
            rl.close();
            process.exit();
        } else if (answer === 'cancel') {
            clearState();
            readLine();
        } else if (answer === '?') {
            info(`\nPossible commands: cancel / exit`);
            readLine(stepNr);
        } else {
            try {
                const goToStepNr = step.action(answer);
                readLine(goToStepNr);
            } catch (e) {
                readLine(stepNr, false);
                warn(e.message + '\n');
            }
        }
    });
};

readLine();
