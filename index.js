const readline = require('readline');
const console = require('better-console');
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

const utils = require('./utils');

console.info('Type ? to see a list of commands');
const readLine = (step = 1) => {

    utils.logQuestion(step);

    rl.question('', (answer) => {
        if (answer === 'exit') {
            rl.close();
            process.exit();
        } else if (answer === 'cancel') {
            utils.clearState();
            readLine();
        } else if (answer === '?') {
            utils.logInfo();
            readLine(step);
        } else {
            const errorMessage = utils.action(step, answer);
            if (typeof errorMessage === 'number') {
                readLine(errorMessage);
            } else if (errorMessage) {
                utils.logError(errorMessage);
                readLine(step);
            } else {
                readLine(step + 1);
            }
        }
    });
};

readLine();
