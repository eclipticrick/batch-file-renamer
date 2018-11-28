const is = require('./is');

const errorMessage = {
    required: (param) => `${param || 'param'} is required!`,
    string: (param) => `${param || 'param'} must be a string!`,
};

describe('helpers.js', () => {
    describe('stringIsEmpty(path: string): boolean', () => {
        const fn = is.requiredString;
        it('should not throw an error when the first parameter is given and is a string', () => {
            const values = ['', ' ', '    ', 'abc', '!@#$%^&'];
            values.forEach(value => expect(fn(value)).toBeUndefined());
        });
        it('should throw an error with the correct message if the given value was not defined', () => {
            expect(() => fn()).toThrowError(errorMessage.required());
            expect(() => fn(null)).toThrowError(errorMessage.required());
            expect(() => fn(null, 'path')).toThrowError(errorMessage.required('path'));
        });
        it('should throw a TypeError with the correct message if the given value was not a string', () => {
            const values = [0, 1234, true, {}, [], { id: 0 }, [1, 2]];
            values.forEach(value => expect(() => fn(value)).toThrow(TypeError));
            values.forEach(value => expect(() => fn(value)).toThrowError(errorMessage.string()));
            values.forEach(value => expect(() => fn(value, 'path')).toThrowError(errorMessage.string('path')));
            values.forEach(value => expect(() => fn(value, '')).toThrowError(errorMessage.string()));
            values.forEach(value => expect(() => fn(value, 0)).toThrowError(errorMessage.string()));
            values.forEach(value => expect(() => fn(value, 1)).toThrowError(errorMessage.string('1')));
            values.forEach(value => expect(() => fn(value, -1)).toThrowError(errorMessage.string('-1')));
            values.forEach(value => expect(() => fn(value, null)).toThrowError(errorMessage.string()));
        });
    });

});
