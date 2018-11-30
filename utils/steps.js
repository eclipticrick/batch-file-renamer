const beforeHandler = require('./handler/before');
const questionHandler = require('./handler/question');
const actionHandler = require('./handler/action');

const steps = {
    [1]: {
        question: () => questionHandler(1),
        action: (answer) => actionHandler.setPath(answer)
    },
    [2]: {
        question: () => questionHandler(2),
        action: (answer) => actionHandler.confirmPath(answer)
    },
    [3]: {
        before: () => beforeHandler.showListOfFilesAndFoldersBeforeReplacement(),
        question: () => questionHandler(3),
        action: (answer) => actionHandler.setReplaceables(answer)
    },
    [4]: {
        question: () => questionHandler(4),
        action: (answer) => actionHandler.confirmReplaceables(answer)
    },
    [5]: {
        question: () => questionHandler(5),
        action: (answer) => actionHandler.setAction(answer)
    },
    [6]: {
        question: () => questionHandler(6),
        action: (answer) => actionHandler.setParameterForAction(answer)
    },
    [7]: {
        question: () => questionHandler(7),
        action: (answer) => actionHandler.confirmParameterForAction(answer)
    },
    [8]: {
        before: () => beforeHandler.showListOfReplacedNames(),
        question: () => questionHandler(8),
        action: (answer) => actionHandler.confirmReplacedNames(answer)
    },
    [9]: {
        question: () => questionHandler(9),
        action: (answer) => actionHandler.undoRestartOrExit(answer)
    },
    [10]: {
        question: () => questionHandler(10),
        action: (answer) => actionHandler.confirmUndo(answer)
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
