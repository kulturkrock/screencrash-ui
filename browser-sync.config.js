
const path = require('path');

module.exports = {
    files: path.resolve(__dirname, './dist/**/*'),
    injectChanges: true,
    logFileChanges: true,
    logLevel: 'info',
    notify: true,
    reloadDelay: 200,
    server: {
        baseDir: path.resolve(__dirname, './dist')
    }
}
