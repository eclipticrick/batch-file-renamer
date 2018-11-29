const is = require('./is');

const stringIsEmpty = (path) => {
    is.required(path, 'path');
    is.string(path, 'path');
    return !path.replace(/\s/g, '')
};

const confirm = (input) => {
    is.required(input, 'input');
    is.string(input, 'input');
    input = input.toLowerCase();
    if (['', 'y', 'yes'].includes(input)) {
        return true
    } else if (['n', 'no'].includes(input)) {
        return false
    } else {
        return null
    }
};
const levenshteinDistance = (source, target) => {
    is.required(source, 'source');
    is.required(target, 'target');
    is.string(source, 'source');
    is.string(target, 'target');
    if (source.length === 0) return target.length;
    if (target.length === 0) return source.length;
    const matrix = [];
    for (let i = 0; i <= target.length; i++){
        matrix[i] = [i];
    }
    for (let j = 0; j <= source.length; j++){
        matrix[0][j] = j;
    }
    for (let i = 1; i <= target.length; i++){
        for (let j = 1; j <= source.length; j++){
            if (target.charAt(i-1) === source.charAt(j-1)){
                matrix[i][j] = matrix[i-1][j-1];
            } else {
                matrix[i][j] = Math.min(matrix[i-1][j-1] + 1, Math.min(matrix[i][j-1] + 1, matrix[i-1][j] + 1));
            }
        }
    }
    return matrix[target.length][source.length];
};

module.exports = {
    stringIsEmpty,
    confirm,
    levenshteinDistance
};
