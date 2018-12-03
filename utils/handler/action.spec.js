const actionHandler = require('./action');
const { getState, setState, clearState } = require('../state');

global.console = {
    error: jest.fn(),
    warn: jest.fn(),
    info: jest.fn(),
    log: jest.fn()
};

describe('action.js', () => {
    describe('step 1 - setPath(givenPath: string, config?: dependency, fileSystem?: dependency): number', () => {
        const fn = actionHandler.setPath;
        const config = {
            default: {
                path: ''
            }
        };
        const fileSystem = {};
        it('should be able to call the function without injecting dependencies', () => {
            expect(() => fn('./utils')).not.toThrowError()
        });
        it('should set the path if the given path is not empty and is a valid folder', () => {
            const givenPath = 'test';
            fileSystem.pathIsAValidFolder = () => true;
            expect(fn(givenPath, config, fileSystem)).toBe(2);
            expect(getState().path).toBe(givenPath)
        });
        it('should set the default path if the given path is empty and the default path is not (and if its a valid folder)', () => {
            const givenPath = '';
            config.default.path = 'Z:\\test';
            fileSystem.pathIsAValidFolder = () => true;
            expect(fn(givenPath, config, fileSystem)).toBe(2);
            expect(getState().path).toBe(config.default.path)
        });
        it('should throw an error if the given and default path are empty', () => {
            const givenPath = '';
            config.default.path = '';
            expect(() => fn(givenPath, config, fileSystem)).toThrowError(`The specified default path in 'config.js' is empty`);
        });
        it('should throw an error if the given path is not a valid folder', () => {
            const givenPath = 'abc';
            fileSystem.pathIsAValidFolder = () => false;
            expect(() => fn(givenPath, config, fileSystem)).toThrowError(`The given path is not valid ('${givenPath}')`);
        });
        it('should throw an error if the given path is empty and the default path is not a valid folder', () => {
            const givenPath = '';
            config.default.path = 'abc';
            fileSystem.pathIsAValidFolder = () => false;
            expect(() => fn(givenPath, config, fileSystem)).toThrowError(`The specified default path in 'config.js' is not valid (${config.default.path})`);
        });
    });
    describe('step 2 - confirmPath(answer: string): number', () => {
        const fn = actionHandler.confirmPath;
        runConfirmationTests(fn, 3, 1);
    });
    describe('step 3 - setReplaceables(answer: string, config: dependency): number', () => {
        const fn = actionHandler.setReplaceables;
        const config = {
            default: {
                renameFolders: false,
                renameFiles: false
            }
        };

        it(`should return stepNr 4 and set the state.files to true if the answer was 'files', state.folders should be falsy`, () => {
            clearState();
            const answer = 'files';
            expect(fn(answer, config)).toBe(4);
            expect(getState().folders).toBeFalsy();
            expect(getState().files).toBe(true);
        });
        it(`should return stepNr 4 and set the state.folders to true if the answer was 'folders', state.files should be falsy`, () => {
            clearState();
            const answer = 'folders';
            expect(fn(answer, config)).toBe(4);
            expect(getState().folders).toBe(true);
            expect(getState().files).toBeFalsy();
        });
        it(`should return stepNr 4 and set the state.files and the state.folders to true if the answer was 'both'`, () => {
            clearState();
            const answer = 'both';
            expect(fn(answer, config)).toBe(4);
            expect(getState().folders).toBe(true);
            expect(getState().files).toBe(true);

        });
        it(`should return stepNr 4 and set the state.files & state.folders to their default values if the answer was empty'`, () => {
            clearState();
            const answer = '';
            const customConfig = {
                default: {
                    renameFolders: true,
                    renameFiles: false
                }
            };
            expect(fn(answer, customConfig)).toBe(4);
            expect(getState().folders).toBe(true);
            expect(getState().files).toBeFalsy();

            clearState();
            customConfig.default.renameFiles = true;
            expect(fn(answer, customConfig)).toBe(4);
            expect(getState().folders).toBe(true);
            expect(getState().files).toBe(true);

            clearState();
            customConfig.default.renameFolders = false;
            expect(fn(answer, customConfig)).toBe(4);
            expect(getState().folders).toBeFalsy();
            expect(getState().files).toBe(true);
        });
        it(`should throw an error when the answer was invalid'`, () => {
            const answer = 'asdasdsadasdas';
            expect(() => fn(answer, config)).toThrowError(`'${answer}' is not a valid answer, please answer with 'files', 'folders' or 'both'`);
        });
        it(`should throw an error when the answer was empty and the files and folders in the config.default are both falsy'`, () => {
            const answer = '';
            const customConfig = {
                default: {
                    renameFolders: false,
                    renameFiles: false
                }
            };
            expect(() => fn(answer, customConfig)).toThrowError(`the default action is to rename 'nothing'... please type 'files', 'folders' or 'both' so this program has something to do`);
        });

    });
    describe('step 4 - confirmReplaceables(answer: string): number', () => {
        const fn = actionHandler.confirmReplaceables;
        runConfirmationTests(fn, 5, 3);
    });

    describe('step 5 - setAction(answer: string, config: dependency): number', () => {
        const fn = actionHandler.setAction;
        const config = {
            actions: {
                reverse: {
                    fn: null,
                    args: []
                },
                append:  {
                    fn: null,
                    args: ['string to append']
                },
                toUpperCase: {
                    fn: null
                },
            }
        };

        it('should throw an error if the answer is empty', () => {
            const answer = '';
            expect(() => fn(answer, config)).toThrowError(`I'm sorry to tell you what to do.. but your action can't be nothing`)
        });
        it('should throw an error if the answer is not one of the defined actions', () => {
            const answer = 'dasdasdsad';
            expect(() => fn(answer, config)).toThrowError(`'${answer}' is not a valid action (be aware, it's case sensitive)`)
        });
        it('should set the action in the state if the answer is a valid action', () => {
            clearState();
            const answer = 'reverse';
            fn(answer, config);
            expect(getState().action).toBe(answer);
        });
        it('should return stepNr 6 if one or more arguments are required for the action', () => {
            const answer = 'append';
            expect(fn(answer, config)).toBe(6);
        });
        it('should return stepNr 8 if 0 arguments are required for the action', () => {
            const answer = 'reverse';
            expect(fn(answer, config)).toBe(8);
        });
        it('should return stepNr 8 if no arguments are required for the action', () => {
            const answer = 'toUpperCase';
            expect(fn(answer, config)).toBe(8);
        });
    });
    describe('step 6 - setParameterForAction(answer: string): number', () => {
        const fn = actionHandler.setParameterForAction;
        it('should push the given value to the args in the state and return stepNr 7', () => {
            clearState();
            const answer = 'something';
            expect(fn(answer)).toBe(7);
            expect(getState().args).toEqual([answer]);
            const answer2 = 'something else';
            expect(fn(answer2)).toBe(7);
            expect(getState().args).toEqual([answer, answer2]);
        })
    });
    describe('step 7 - confirmParameterForAction(answer: string, config?: dependency): number', () => {
        const fn = actionHandler.confirmParameterForAction;
        const config = {
            actions: {
                replace: {
                    fn: null,
                    args: ['string to replace', 'replacement string']
                }
            }
        };
        const yesAnswers = ['', 'y', 'yes', 'Y', 'YES', 'YeS'];
        const noAnswers = ['n', 'no', 'N', 'NO'];

        it('should return stepNr 6 if the user confirmed the param value and the action requires another param', () => {
            clearState();
            const action = 'replace';
            const args = ['first param value'];
            setState({ action, args });
            yesAnswers.forEach(yesAnswer => expect(fn(yesAnswer, config)).toBe(6));
        });
        it('should return stepNr 8 if the user confirmed the param value and the action requires no other params', () => {
            clearState();
            const action = 'replace';
            const args = ['first param value', 'second param value'];
            setState({ action, args });
            setState({ args });
            yesAnswers.forEach(yesAnswer => expect(fn(yesAnswer, config)).toBe(8));
        });
        it('should return stepNr 6 if the user rejected the param value, the value should also be popped from the state', () => {
            clearState();
            const action = 'replace';
            const args = ['first param value'];
            setState({ action, args });
            noAnswers.forEach(noAnswer => {
                expect(fn(noAnswer, config)).toBe(6);
                expect(getState().args).toEqual([]);
            });
        });
        it('should throw an error if the answer wasn\'t a valid confirmation', () => {
            clearState();
            const action = 'replace';
            const args = ['first param value'];
            setState({ action, args });
            const answer = 'asdffasd';
            expect(() => fn(answer, config)).toThrowError(`'${answer}' is not a valid answer, please answer with 'yes' or 'no'`);
        });
    });
    describe('step 8 - confirmReplacedNames(answer: string, config?: dependency, fileSystem?: dependency): number', () => {
        const fn = actionHandler.confirmReplacedNames;
        // TODO: after backup is refactored

    });
    describe('step 9 - undoRestartOrExit(answer: string): number', () => {
        const fn = actionHandler.undoRestartOrExit;

    });
    describe('step 10 - confirmUndo(answer: string): number', () => {
        const fn = actionHandler.confirmUndo;
        runConfirmationTests(fn, 1, 9);
        // todo: expect UNDO to be successful
    });
});


function runConfirmationTests(fn, expectedStepForYes, expectedStepForNo) {
    it('should return stepNr 3', () => {
        const yesAnswers = ['y', 'yes', ''];
        yesAnswers.forEach(answer => {
            expect(fn(answer)).toBe(expectedStepForYes)
        });
    });
    it('should return stepNr 1 ans should set state.path to null', () => {
        const noAnswers = ['n', 'no'];
        clearState();
        setState({
            path: 'something'
        });
        noAnswers.forEach(answer => {
            expect(fn(answer)).toBe(expectedStepForNo)
        });
    });
    it('should throw an error if the answer is not yes/y/no/n or nothing', () => {
        const otherAnswers = [' ', 'x', 'nee', 'ja', 'j', 'something', 'test'];
        clearState();
        setState({
            path: 'something'
        });
        otherAnswers.forEach(answer => {
            expect(() => fn(answer)).toThrowError(`'${answer}' is not a valid answer, please answer with 'yes' or 'no'`)
        });
    });
}