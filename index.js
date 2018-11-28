const readline = require('readline');
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

const { log, info, warn } = require('better-console');
const { clearState } = require('./utils/state');
const { getStep } = require('./utils/steps');

info('Type ? to see a list of commands');
const readLine = (step = 1) => {

    log(getStep(step).question());

    rl.question('', (answer) => {
        if (answer === 'exit') {
            rl.close();
            process.exit();
        } else if (answer === 'cancel') {
            clearState();
            readLine();
        } else if (answer === '?') {
            info(`\nPossible commands: cancel / exit`);
            readLine(step);
        } else {
            const errorMsg = getStep(step).action(answer);
            if (typeof errorMsg === 'number') {
                readLine(errorMsg);
            } else if (errorMsg) {
                warn(errorMsg + '\n');
                readLine(step);
            } else {
                readLine(step + 1);
            }
        }
    });
};

readLine();
