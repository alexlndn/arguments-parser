module.exports = {
    input: 'src/main.js',
    output: [
        {
            file: 'dist/cjs/main.js',
            format: 'cjs',
        },
        {
            file: 'dist/esm/main.mjs',
            format: 'esm',
        },
    ]
};