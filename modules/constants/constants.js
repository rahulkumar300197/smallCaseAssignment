const define = (obj, name, value) => {
    Object.defineProperty(obj, name, {
        value: value,
        enumerable: true,
        writable: false,
        configurable: true
    });
};

exports.responseMessages = {};
define(exports.responseMessages, 'PARAMETER_MISSING', 'Insufficient information was supplied. Please check and try again.');
define(exports.responseMessages, 'ERROR_IN_EXECUTION', 'Some error occurred while executing. Please try again.');
define(exports.responseMessages, 'ACTION_COMPLETE', 'Successful.');
define(exports.responseMessages, 'USER_NOT_FOUND', 'User is not registered with us.');
define(exports.responseMessages, 'INVALID_PASSWORD', 'Invalid username or password.');

exports.responseFlags = {};
define(exports.responseFlags, 'PARAMETER_MISSING', 100);
define(exports.responseFlags, 'ERROR_IN_EXECUTION', 400);
define(exports.responseFlags, 'ACTION_COMPLETE', 200);
define(exports.responseFlags, 'SHOW_ERROR_MESSAGE', 400);
define(exports.responseFlags, 'INVALID_ACCESS_TOKEN', 404);
