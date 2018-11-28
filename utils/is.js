const requiredString = (value, param) => {
    if (typeof value === 'undefined' || value === null) {
        throw new Error(`${param || 'param'} is required!`)
    } else if (typeof value !== 'string') {
        throw new TypeError(`${param || 'param'} must be a string!`);
    }
};

module.exports = {
    requiredString
};
