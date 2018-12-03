
// Handlers
const beforeHandler = require('./handler/before');
const questionHandler = require('./handler/question');
const actionHandler = require('./handler/action');

// Dependencies for the handlers
const console = require('better-console');
const config = require('../config');
const fileSystem = require('./fileSystem');

const steps = {
    [1]: {
        question: () => questionHandler(1, config),
        action: (answer) => actionHandler.setPath(answer, config, fileSystem)
    },
    [2]: {
        question: () => questionHandler(2, config),
        action: (answer) => actionHandler.confirmPath(answer)
    },
    [3]: {
        before: () => beforeHandler.showListOfFilesAndFoldersBeforeReplacement(console, fileSystem),
        question: () => questionHandler(3, config),
        action: (answer) => actionHandler.setReplaceables(answer, config)
    },
    [4]: {
        question: () => questionHandler(4, config),
        action: (answer) => actionHandler.confirmReplaceables(answer)
    },
    [5]: {
        question: () => questionHandler(5, config),
        action: (answer) => actionHandler.setAction(answer, config)
    },
    [6]: {
        question: () => questionHandler(6, config),
        action: (answer) => actionHandler.setParameterForAction(answer)
    },
    [7]: {
        question: () => questionHandler(7, config),
        action: (answer) => actionHandler.confirmParameterForAction(answer, config)
    },
    [8]: {
        before: () => beforeHandler.showListOfReplacedNames(config, console, fileSystem),
        question: () => questionHandler(8, config),
        action: (answer) => actionHandler.confirmReplacedNames(answer, config, fileSystem)
    },
    [9]: {
        question: () => questionHandler(9, config),
        action: (answer) => actionHandler.undoRestartOrExit(answer, console, fileSystem)
    },
    [10]: {
        question: () => questionHandler(10, config),
        action: (answer) => actionHandler.confirmUndo(answer, console, fileSystem)
    },
    [999]: {
        action: () => process.exit()
    },
};

const getStep = (nr) => {
    if (steps[nr]) {
        return steps[nr];
    } else {
        return steps[999];
    }
};

module.exports = { steps, getStep };
