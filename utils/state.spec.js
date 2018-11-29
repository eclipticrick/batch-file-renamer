const state = require('./state');

let defaultState;

const { errorMessage } = require('./is');

describe('state.js', () => {

    beforeEach(() => {
        state.clearState();
        defaultState = state.getState();
    });

    describe('clearState(): void', () => {
        it('should revert back to the initial state', () => {
            const editedState = {
                path: 'something',
                files: true,
                folders: false,
                action: 'something',
                args: ['asdsad'],
                backup: {
                    files: ['sadasd'],
                    folders: ['dsfs']
                }
            };

            state.setState(editedState);
            expect(state.getState()).toEqual(editedState);

            state.clearState();
            expect(state.getState()).toEqual(defaultState)
        });
    });


    describe('getState(): State', () => {
        it('should be the default state', () => {
            const expectedState = {
                path: null,
                files: null,
                folders: null,
                action: null,
                args: [],
                backup: {
                    files: [],
                    folders: []
                }
            };
            expect(state.getState()).toEqual(expectedState)
        });
    });

    describe('setState(): void', () => {
        it('should throw an error if an unknown property is given to setState', () => {
            const invalidKeys = ['', 'FILES', 'backop', 'dir', 'directory', 'hello', 'world'];
            const errMessage = key => `'${key}' is not a valid state param!`;
            const errMessageBackup = key => `'backup.${key}' is not a valid state param!`;
            invalidKeys.forEach(key => {
                expect(() => state.setState({ [key]: true })).toThrowError(errMessage(key))
            });
            invalidKeys.forEach(key => {
                expect(() => state.setState({ backup: { [key]: true } })).toThrowError(errMessageBackup(key))
            })
        });
        it('should throw an error with the correct message is an invalid property is given as a value for a state key', () => {
            expect(() => state.setState({ path: true })).toThrowError(errorMessage.stringOrNull('path'));
            expect(() => state.setState({ path: 0 })).toThrowError(errorMessage.stringOrNull('path'));
            expect(() => state.setState({ files: '' })).toThrowError(errorMessage.booleanOrNull('files'));
            expect(() => state.setState({ files: 0 })).toThrowError(errorMessage.booleanOrNull('files'));
            expect(() => state.setState({ action: false })).toThrowError(errorMessage.stringOrNull('action'));
            expect(() => state.setState({ folders: [] })).toThrowError(errorMessage.booleanOrNull('folders'));
            expect(() => state.setState({ folders: {} })).toThrowError(errorMessage.booleanOrNull('folders'));
        });
        it('should not throw an error if the param is set to its initial value', () => {
            expect(state.setState({ path: null })).toBeUndefined();
            expect(state.setState({ files: null })).toBeUndefined();
            expect(state.setState({ folders: null })).toBeUndefined();
            expect(state.setState({ action: null })).toBeUndefined();
            expect(state.setState({ args: [] })).toBeUndefined();
            expect(state.setState({ backup: {} })).toBeUndefined();
            expect(state.setState({ backup: { files: [] } })).toBeUndefined();
            expect(state.setState({ backup: { folders: [] } })).toBeUndefined();
        });
        it('if the initial value should be an object or array, setting it to null should throw an error', () => {
            expect(() => state.setState({ args: null })).toThrowError(errorMessage.array('args'));
            expect(() => state.setState({ backup: null })).toThrowError(errorMessage.object('backup'));
            expect(() => state.setState({ backup: { files: 0 } })).toThrowError(errorMessage.array('files'));
            expect(() => state.setState({ backup: { folders: 0 } })).toThrowError(errorMessage.array('folders'));
        });
        it('should be able to edit the state without giving the backup as param', () => {
            const path = 'path';
            const action = 'action';
            state.setState({ path });
            state.setState({ action });

            const expectedState = {
                path: 'path',
                files: null,
                folders: null,
                action: 'action',
                args: [],
                backup: {
                    files: [],
                    folders: []
                }
            };
            expect(state.getState()).toEqual(expectedState)
        });

        it('should not edit the backup object if an empty object was given', () => {
            const backup = {};
            state.setState({ backup });

            expect(state.getState(defaultState)).toEqual(defaultState)
        });

        it('should be the edited state', () => {
            const path = 'path';
            const files = true;
            const action = 'action';
            const backup = {
                files: ['abc', 'def', 'ghi', 'jkl']
            };
            state.setState({ path, files, action, backup });

            const expectedState = {
                path: 'path',
                files: true,
                folders: null,
                action: 'action',
                args: [],
                backup: {
                    files: ['abc', 'def', 'ghi', 'jkl'],
                    folders: []
                }
            };
            expect(state.getState()).toEqual(expectedState)
        });

        it('should be the fully edited state', () => {
            const path = 'path';
            const files = true;
            const folders = true;
            const action = 'action';
            const args = ['arg1', 'arg2', 'arg3'];
            const backup = {
                files: ['abc', 'def', 'ghi', 'jkl'],
                folders: ['abc', 'def', 'ghi', 'jkl']
            };
            state.setState({ path, files, folders, action, args, backup });

            const expectedState = {
                path: 'path',
                files: true,
                folders: true,
                action: 'action',
                args: ['arg1', 'arg2', 'arg3'],
                backup: {
                    files: ['abc', 'def', 'ghi', 'jkl'],
                    folders: ['abc', 'def', 'ghi', 'jkl']
                }
            };
            expect(state.getState()).toEqual(expectedState)
        });
    });

});
