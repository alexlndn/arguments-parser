module.exports = {
    'env': {
        'es2021': true,
        'node': true
    },
    'extends': 'eslint:recommended',
    'parserOptions': {
        'ecmaVersion': 'latest',
        'sourceType': 'module'
    },
    'rules': {
        'indent': [
            'error',
            4,
            {
                'SwitchCase': 1,
            }
        ],
        'linebreak-style': [
            'error',
            'unix'
        ],
        'quotes': [
            'error',
            'single'
        ],
        'semi': [
            'error',
            'always'
        ],
        'no-console': 1,
        'no-unused-vars': [
            'warn', {
                'vars': 'all',
                'args': 'none',
                'ignoreRestSiblings': false
            }
        ],
        'no-var': [
            'error'
        ],
        'prefer-const': [
            'error',
            {
                'destructuring': 'all',
                'ignoreReadBeforeAssign': false
            }
        ],
        'object-shorthand': ['error', 'always'],
        'no-shadow': ['error', { 'builtinGlobals': false, 'hoist': 'functions', 'allow': [] }],
    }
};
