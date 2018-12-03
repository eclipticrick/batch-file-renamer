const questionHandler = require('./question');
const { setState, clearState } = require('../state');
const testPath = 'Z:/test/test/test';
const config = {
    default: {
        path: 'D:\\Projects\\npm\\batch-renamer\\tmp',
        renameFolders: false,
        renameFiles: false
    },
    actions: {
        replace: {
            fn: (oldName) => (replaceString, withString) => {
                const re = new RegExp(replaceString, 'g');
                return oldName.replace(re, withString);
            },
            args: ['string to replace', 'replacement string']
        },
        reverse: {
            fn: (oldName) => () => oldName.split('').reverse().join(''),
            args: []
        }
    }
};

describe('question.js', () => {
    const fn = questionHandler;
    describe('handler(stepNr: number): string', () => {
        describe('question 1', () => {
            it('should ask the user to specify a folder', () => {
                expect(fn(1, config)).toBe(`Specify a folder where you want to rename files (default: '${config.default.path}')`)
            });
        });
        describe('question 2', () => {
            it('should ask the user if the path in the state is correct', () => {
                clearState();
                setState({ path: testPath });
                expect(fn(2)).toBe(`Is this path correct? (y/n) '${testPath}'`)
            });
        });
        describe('question 3', () => {
            it('should ask the user to choose between naming files, folders or both (default should be both)', () => {
                const mockConfig = {
                    ...config,
                    default: {
                        ...config.default,
                        renameFolders: true,
                        renameFiles: true
                    }
                };
                expect(fn(3, mockConfig)).toBe(`Do you want to rename files or folders or both? (default: ${'both'})`)
            });
            it('should ask the user to choose between naming files, folders or both (default should be files)', () => {
                const mockConfig = {
                    ...config,
                    default: {
                        ...config.default,
                        renameFolders: false,
                        renameFiles: true
                    }
                };
                expect(fn(3, mockConfig)).toBe(`Do you want to rename files or folders or both? (default: ${'files'})`)
            });
            it('should ask the user to choose between naming files, folders or both (default should be folders)', () => {
                const mockConfig = {
                    ...config,
                    default: {
                        ...config.default,
                        renameFolders: true,
                        renameFiles: false
                    }
                };
                expect(fn(3, mockConfig)).toBe(`Do you want to rename files or folders or both? (default: ${'folders'})`)
            });
            it('should ask the user to choose between naming files, folders or both (default should be nothing)', () => {
                const mockConfig = {
                    ...config,
                    default: {
                        ...config.default,
                        renameFolders: false,
                        renameFiles: false
                    }
                };
                expect(fn(3, mockConfig)).toBe(`Do you want to rename files or folders or both? (default: ${'nothing'})`)
            });
        });
        describe('question 4', () => {
            it('should confirm renaming of both files and folders', () => {
                const expectedStr = 'both files and folders';
                clearState();
                setState({
                    path: testPath,
                    folders: true,
                    files: true
                });
                expect(fn(4)).toBe(`So you want to rename ${expectedStr} in ${testPath}? (y/n)`)
            });
            it('should confirm renaming of only the files', () => {
                const expectedStr = 'only the files';
                clearState();
                setState({
                    path: testPath,
                    files: true
                });
                expect(fn(4)).toBe(`So you want to rename ${expectedStr} in ${testPath}? (y/n)`);

                clearState();
                setState({
                    path: testPath,
                    folders: false,
                    files: true
                });
                expect(fn(4)).toBe(`So you want to rename ${expectedStr} in ${testPath}? (y/n)`);
            });
            it('should confirm renaming of only the folders', () => {
                const expectedStr = 'only the folders';
                clearState();
                setState({
                    path: testPath,
                    folders: true
                });
                expect(fn(4)).toBe(`So you want to rename ${expectedStr} in ${testPath}? (y/n)`);

                clearState();
                setState({
                    path: testPath,
                    folders: true,
                    files: null
                });
                expect(fn(4)).toBe(`So you want to rename ${expectedStr} in ${testPath}? (y/n)`);
            });
        });
        describe('question 5', () => {
            it('should', () => {
                const mockConfig = {
                    actions: {
                        abc: null,
                        def: null,
                        ghi: null
                    }
                };
                expect(fn(5, mockConfig)).toBe(`To rename you have certain actions you can perform on the name, choose one.\nactions: 'abc', 'def', 'ghi'`)
            });
        });
        describe('question 6', () => {
            it('should ask for the value of the first parameter', () => {
                const mockConfig = {
                    actions: {
                        abc: {
                            args: ['parameter1', 'parameter2']
                        }
                    }
                };
                clearState();
                setState({
                    action: 'abc',
                    args: []
                });
                expect(fn(6, mockConfig)).toBe(`The action 'abc' needs a 'parameter1'`)
            });
            it('should ask for the value of the second parameter', () => {
                const mockConfig = {
                    actions: {
                        abc: {
                            args: ['parameter1', 'parameter2']
                        }
                    }
                };
                clearState();
                setState({
                    action: 'abc',
                    args: ['first param']
                });
                expect(fn(6, mockConfig)).toBe(`The action 'abc' needs a 'parameter2'`)
            });
        });
        describe('question 7', () => {
            it('should ask for confirmation about the first parameter', () => {
                const mockConfig = {
                    actions: {
                        abc: {
                            args: ['parameter1', 'parameter2']
                        }
                    }
                };
                clearState();
                setState({
                    action: 'abc',
                    args: ['first param']
                });
                expect(fn(7, mockConfig)).toBe(`Is 'first param' the 'parameter1'? (y/n)`)
            });
            it('should ask for confirmation about the second parameter', () => {
                const mockConfig = {
                    actions: {
                        abc: {
                            args: ['parameter1', 'parameter2']
                        }
                    }
                };
                clearState();
                setState({
                    action: 'abc',
                    args: ['first param', 'second param']
                });
                expect(fn(7, mockConfig)).toBe(`Is 'second param' the 'parameter2'? (y/n)`)
            });
        });
        describe('question 8', () => {
            it('should show the new names after the replacement and confirm continuation', () => {
                expect(fn(8)).toBe(`These are the new names after the replacement, do you want to continue? (y/n)`)
            });
        });
        describe('question 9', () => {
            it('should show success for renaming both files and folders', () => {
                clearState();
                setState({
                    folders: true,
                    files: true
                });
                expect(fn(9)).toBe(`
The ${'files and folders'} have been successfully renamed!

Type 'undo' to revert the filenames back to what they were
Type 'restart' to rename more files or folders
Type 'exit' to stop this application`)
            });
            it('should show success for renaming folders', () => {
                clearState();
                setState({
                    folders: true
                });
                expect(fn(9)).toBe(`
The ${'folders'} have been successfully renamed!

Type 'undo' to revert the filenames back to what they were
Type 'restart' to rename more files or folders
Type 'exit' to stop this application`)
            });
            it('should show success for renaming files', () => {
                clearState();
                setState({
                    files: true
                });
                expect(fn(9)).toBe(`
The ${'files'} have been successfully renamed!

Type 'undo' to revert the filenames back to what they were
Type 'restart' to rename more files or folders
Type 'exit' to stop this application`)
            });
            it('should show success for renaming nothing (should never happen)', () => {
                clearState();
                expect(fn(9)).toBe(`
The ${null} have been successfully renamed!

Type 'undo' to revert the filenames back to what they were
Type 'restart' to rename more files or folders
Type 'exit' to stop this application`)
            });
        });
        describe('question 10', () => {
            it('should ask if the user meant to type undo', () => {
                expect(fn(10)).toBe(`Did you mean to type undo? (y/n)`)
            });
        });
        describe('question other', () => {
            it('should return an empty string', () => {
                expect(fn(11)).toBe('');
                expect(fn(999)).toBe('');
            });
        });
    });

});
