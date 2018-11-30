const questionHandler = require('./question');
const config = require('../../config');
const { setState, clearState } = require('../state');
const testPath = 'Z:/test/test/test';

describe('question.js', () => {
    const fn = questionHandler;
    describe('handler(stepNr: number): string', () => {
        describe('question 1', () => {
            it('should ask the user to specify a folder', () => {
                expect(fn(1)).toBe(`Specify a folder where you want to rename files (default: '${config.default.path}')`)
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

    });

});
