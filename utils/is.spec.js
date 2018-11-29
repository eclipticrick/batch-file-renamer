const is = require('./is');
const { errorMessage } = is;

const expectedTypeErrors = (fn, values, typeOfError) => {
    values.forEach(value => expect(() => fn(value)).toThrow(TypeError));
    values.forEach(value => expect(() => fn(value)).toThrowError(errorMessage[typeOfError]()));
    values.forEach(value => expect(() => fn(value, null)).toThrowError(errorMessage[typeOfError]()));
    values.forEach(value => expect(() => fn(value, '')).toThrowError(errorMessage[typeOfError]()));
    values.forEach(value => expect(() => fn(value, 0)).toThrowError(errorMessage[typeOfError]()));
    values.forEach(value => expect(() => fn(value, 'path')).toThrowError(errorMessage[typeOfError]('path')));
    values.forEach(value => expect(() => fn(value, 1)).toThrowError(errorMessage[typeOfError]('1')));
};

describe('is.js', () => {
    describe('is.required(value: any, path?: string): void', () => {
        const fn = is.required;
        it('should throw an error with the correct message if the given value was not defined', () => {
            expect(() => fn()).toThrowError(errorMessage.required());
            expect(() => fn(null)).toThrowError(errorMessage.required());
            expect(() => fn(null, 'path')).toThrowError(errorMessage.required('path'));
        });
    });
    describe('is.string(value: any, path?: string): void', () => {
        const fn = is.string;
        it('should not throw an error when the first parameter is given and is a string', () => {
            const values = ['', ' ', '    ', 'abc', '!@#$%^&'];
            values.forEach(value => expect(fn(value)).toBeUndefined());
        });
        it('should throw a TypeError with the correct message if the given value was not a string', () => {
            const values = [null, 0, 1234, true, {}, [], { id: 0 }, [1, 2]];
            expectedTypeErrors(fn, values, 'string');
        });
    });
    describe('is.number(value: any, path?: string): void', () => {
        const fn = is.number;
        it('should not throw an error when the first parameter is given and is a number', () => {
            const values = [-9999999999, -1, 0, 1, 0.000009, 0.3, -0.7];
            values.forEach(value => expect(fn(value)).toBeUndefined());
        });
        it('should throw a TypeError with the correct message if the given value was not a number', () => {
            const values = ['0', '1234', true, {}, [], { id: 0 }, [1, 2]];
            expectedTypeErrors(fn, values, 'number');
        });
    });
    describe('is.boolean(value: any, path?: string): void', () => {
        const fn = is.boolean;
        it('should not throw an error when the first parameter is given and is a boolean', () => {
            const values = [true, false];
            values.forEach(value => expect(fn(value)).toBeUndefined());
        });
        it('should throw a TypeError with the correct message if the given value was not a number', () => {
            const values = ['0', '1234', -1, 0, 1, 0.3, {}, [], { id: 0 }, [1, 2]];
            expectedTypeErrors(fn, values, 'boolean');
        });
    });
    describe('is.array(value: any, path?: string): void', () => {
        const fn = is.array;
        it('should not throw an error when the first parameter is given and is a array', () => {
            const values = [ [], [{}, [], 1, 'a'], ['a', 'b'], [0, 1, 2, 3], new Array(9) ];
            values.forEach(value => expect(fn(value)).toBeUndefined());
        });
        it('should throw a TypeError with the correct message if the given value was not a array', () => {
            const values = ['0', '1234', true, {}, 12345, null, { id: 0 }];
            expectedTypeErrors(fn, values, 'array');
        });
    });
    describe('is.object(value: any, path?: string): void', () => {
        const fn = is.object;
        it('should not throw an error when the first parameter is given and is a object', () => {
            const values = [ {}, { a: ['a'] }, { [0]: 0 }, { a: { b: { a: {} } } } ];
            values.forEach(value => expect(fn(value)).toBeUndefined());
        });
        it('should throw a TypeError with the correct message if the given value was not a object', () => {
            const values = ['0', '1234', true, [], -1, 0, 1, 0.3, [1, 2]];
            expectedTypeErrors(fn, values, 'object');
        });
    });
    describe('is.stringOrNull(value: any, path?: string): void', () => {
        const fn = is.stringOrNull;
        it('should not throw an error when the first parameter is given and is a string or null', () => {
            const values = [null, '', ' ', '    ', 'abc', '!@#$%^&'];
            values.forEach(value => expect(fn(value)).toBeUndefined());
        });
        it('should throw a TypeError with the correct message if the given value was not a string or null', () => {
            const values = [0, 1234, true, {}, [], { id: 0 }, [1, 2]];
            expectedTypeErrors(fn, values, 'stringOrNull');
        });
    });
    describe('is.booleanOrNull(value: any, path?: string): void', () => {
        const fn = is.booleanOrNull;
        it('should not throw an error when the first parameter is given and is a boolean or null', () => {
            const values = [null, true, false];
            values.forEach(value => expect(fn(value)).toBeUndefined());
        });
        it('should throw a TypeError with the correct message if the given value was not a boolean or null', () => {
            const values = [0, 1234, '', 'abc', {}, [], { id: 0 }, [1, 2]];
            expectedTypeErrors(fn, values, 'booleanOrNull');
        });
    });

});
