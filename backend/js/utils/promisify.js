function promisify(fn, ...args) {
    return new Promise((resolve, reject) => {
        fn(...args, (error, data) => {
            if (error) {
                reject(error);
            } else {
                resolve(data);
            }
        });
    });
}

module.exports = promisify;