
const its = {
    null: v => v === null,
    nullOrUndefined: v => typeof v === 'undefined' || v === null,
    string: v => typeof v === 'string' || v instanceof String,
    number: v => typeof v === 'number' && isFinite(v),
    boolean: v => typeof v === 'boolean',
    array: v => v && typeof v === 'object' && v.constructor === Array,
    object: v => v && typeof v === 'object' && v.constructor === Object
};
const errorMessage = {
    required: (param) => `${param || 'param'} is required!`,
    string: (param) => `${param || 'param'} must be a string!`,
    stringOrNull: (param) => `${param || 'param'} must be a string or null!`,
    number: (param) => `${param || 'param'} must be a number!`,
    array: (param) => `${param || 'param'} must be an array!`,
    object: (param) => `${param || 'param'} must be an object!`,
    boolean: (param) => `${param || 'param'} must be a boolean!`,
    booleanOrNull: (param) => `${param || 'param'} must be a boolean or null!`
};
const required = (value, param) => {
    if (its.nullOrUndefined(value)) {
        throw new Error(errorMessage.required(param))
    }
};
const string = (value, param) => {
    if (!its.string(value)) {
        throw new TypeError(errorMessage.string(param))
    }
};
const stringOrNull = (value, param) => {
    if (!its.string(value) && !its.null(value)) {
        throw new TypeError(errorMessage.stringOrNull(param))
    }
};
const number = (value, param) => {
    if(!its.number(value)) {
        throw new TypeError(errorMessage.number(param))
    }
};
const boolean = (value, param) => {
    if(!its.boolean(value)) {
        throw new TypeError(errorMessage.boolean(param))
    }
};
const booleanOrNull = (value, param) => {
    if (!its.boolean(value) && !its.null(value)) {
        throw new TypeError(errorMessage.booleanOrNull(param))
    }
};
const array = (value, param) => {
    if(!its.array(value)) {
        throw new TypeError(errorMessage.array(param))
    }
};
const object = (value, param) => {
    if(!its.object(value)) {
        throw new TypeError(errorMessage.object(param))
    }
};

module.exports = {
    errorMessage,
    required,
    string,
    number,
    array,
    object,
    boolean,
    stringOrNull,
    booleanOrNull
};
