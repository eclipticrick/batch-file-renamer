const helpers = require('./helpers');

const errorMessage = {
    required: (param) => `${param || 'param'} is required!`,
    string: (param) => `${param || 'param'} must be a string!`,
};

describe('helpers.js', () => {
    describe('stringIsEmpty(path: string): boolean', () => {
        const fn = helpers.stringIsEmpty;
        it('should be empty', () => {
            const values = ['', ' ', '    '];
            const emptyString = true;
            values.forEach(value => expect(fn(value)).toBe(emptyString));
        });
        it('should not be empty', () => {
            const values = ['0', 'a', ' a ', 'aaa', ' a a a '];
            const notEmptyString = false;
            values.forEach(value => expect(fn(value)).toBe(notEmptyString));
        });
        it('should throw an error is no value was given', () => {
            expect(() => fn()).toThrowError(errorMessage.required('path'));
            expect(() => fn(null)).toThrowError(errorMessage.required('path'));
        });
        it('should throw a TypeError with the correct message', () => {
            const values = [0, 1234, true, {}, [], { id: 0 }, [1, 2]];
            values.forEach(value => expect(() => fn(value)).toThrow(TypeError));
            values.forEach(value => expect(() => fn(value)).toThrowError(errorMessage.string('path')));
        });
    });
    describe('confirm(input: string): boolean', () => {
        const fn = helpers.confirm;
        it('should be YES (true)', () => {
            const values = ['y', 'yes', ''];
            const yes = true;
            values.forEach(value => expect(fn(value)).toBe(yes));
        });
        it('should be NO (false)', () => {
            const values = ['n', 'no'];
            const no = false;
            values.forEach(value => expect(fn(value)).toBe(no));
        });
        it('should be neither one (null)', () => {
            const values = [' ', 'adsadsadsad', ' no', 'no ', ' yes', 'yes '];
            const neither = null;
            values.forEach(value => expect(fn(value)).toBe(neither));
        });
        it('should throw an error is no value was given', () => {
            expect(() => fn()).toThrowError(errorMessage.required('input'));
            expect(() => fn(null)).toThrowError(errorMessage.required('input'));
        });
        it('should throw a TypeError with the correct message', () => {
            const values = [0, 1234, true, {}, [], { id: 0 }, [1, 2]];
            values.forEach(value => expect(() => fn(value)).toThrow(TypeError));
            values.forEach(value => expect(() => fn(value)).toThrowError(errorMessage.string('input')));
        });
    });
});
