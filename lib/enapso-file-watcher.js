// Innotrade Enapso File Watcher
// (C) Copyright 2019 Innotrade GmbH, Herzogenrath, NRW, Germany
// Author(s):  Alexander Schulze, Ashesh Goplani and Muhammad Yasir

const chokidar = require('chokidar');
const pathp = require('path');
const fs = require('fs');

const watcher = chokidar.watch('file, dir, glob, or array', {
    ignored: /(^|[\/\\])\../, // ignore dotfiles
    persistent: true,
    atomic: false
});

let data = [];
let alreadySeen = [];

const waitForWatcher = (watcher) => {
    return new Promise((resolve, reject) => {
        watcher.on('error', reject);
        watcher.on('ready', resolve);
    });
};

const EnapsoFileWatcher = {
    add: async function (option) {
        return new Promise(async (resolve, reject) => {
            if (!Array.isArray(option)) {
                return reject({
                    statusCode: 400,
                    message: 'Please Input correct JSON Format',
                    success: false
                });
            }

            for (let i = 0; i < option.length; i++) {
                if (!option[i]['path'] || !option[i]['id']) {
                    return reject({
                        statusCode: 400,
                        message: `${JSON.stringify(option[i])} Wrong Format`,
                        success: false
                    });
                }

                if (alreadySeen[option[i].id]) {
                    return reject({
                        statusCode: 400,
                        message: `${JSON.stringify(
                            option[i]
                        )} ID already exists`,
                        success: false
                    });
                } else {
                    alreadySeen[option[i].id] = option[i];
                }
            }

            // for (let i = 0; i < data.length; i++) {
            //     if (alreadySeen[data[i].id]) {
            //         return reject({
            //             statusCode: 400,
            //             message: `${JSON.stringify(data[i])} ID already exists`,
            //             success: false
            //         });
            //     } else {
            //         alreadySeen[data[i].id] = data[i];
            //     }
            // }

            try {
                let path = [];

                option.forEach((element) => {
                    path.push(element.path);
                    data.push(element);
                });

                for (let i = 0; i < path.length; i++) {
                    let check = fs.existsSync(path[i]);

                    if (!check) {
                        return reject({
                            statusCode: 400,
                            message: `${path[i]} does not exists`,
                            success: false
                        });
                    }
                }
                // await watcher.on('ready', async () => {

                await watcher.add(path);
                setTimeout(function () {
                    return resolve({
                        statusCode: 200,
                        message: 'Successfully Added',
                        success: true
                    });
                }, 20);
                // });
                // await waitForWatcher(watcher);
                // setTimeout(function () {
                // return resolve({
                //     statusCode: 200,
                //     message: 'Successfully Added',
                //     success: true
                // });
                // }, 20);
            } catch (e) {
                return reject({
                    statusCode: 400,
                    message: e.message,
                    success: false
                });
            }
        });
    },

    remove: async function (option) {
        return new Promise(async (resolve, reject) => {
            if (!Array.isArray(option)) {
                return reject({
                    statusCode: 400,
                    message: 'Please Input correct JSON Format',
                    success: false
                });
            }

            for (let i = 0; i < option.length; i++) {
                if (!option[i]['path'] && !option[i]['id']) {
                    return reject({
                        statusCode: 400,
                        message: `${JSON.stringify(option[i])} Wrong Format`,
                        success: false
                    });
                }

                if (option[i]['path'] && option[i]['id']) {
                    let file = data.filter(
                        (item) => item.path == option[i].path
                    );

                    if (
                        option[i].id !== file[0].id ||
                        option[i].path != file[0].path
                    ) {
                        return reject({
                            statusCode: 400,
                            message: `${JSON.stringify(
                                option[i]
                            )} Path and id doest not match`,
                            success: false
                        });
                    }
                }
            }

            try {
                let path = [];

                option.forEach((element) => {
                    if (!element.path) {
                        let file = data.filter((item) => item.id == element.id);
                        path.push(file[0].path);
                    } else {
                        path.push(element.path);
                    }
                });

                option.forEach((element) => {
                    let path = element.path || '';
                    let id = element.id || '';
                    data = data.filter(
                        (item) => item.path !== path && item.id !== id
                    );
                    alreadySeen = alreadySeen.filter((item) => item.id !== id);
                });

                // watcher.on('unlink', async (path) => {
                //     console.log(`File ${path} has been removed`);
                //     return resolve({
                //         statusCode: 200,
                //         message: 'Successfully Removed',
                //         success: true
                //     });
                // });
                for (let i = 0; i < path.length; i++) {
                    let check = fs.existsSync(path[i]);

                    if (!check) {
                        return reject({
                            statusCode: 400,
                            message: `${path[i]} does not exists`,
                            success: false
                        });
                    }
                }
                // await watcher.on('ready', async () => {
                // await waitForWatcher(watcher);
                await watcher.unwatch(path);
                // await waitForWatcher(watcher);
                // let check = await watcher.getWatched();
                // console.log(check);

                // await watcher.add('./watchfile/ashesh.txt');
                // });

                return resolve({
                    statusCode: 200,
                    message: 'Successfully Removed',
                    success: true
                });
            } catch (e) {
                return reject({
                    statusCode: 400,
                    message: e.message,
                    success: false
                });
            }
        });
    },
    on: async function (subscribes, callback) {
        watcher.on('change', (path, stats) => {
            if (stats) {
                let fileID, filePath;
                data.forEach((element) => {
                    // path.parse(element.path);
                    // console.log(pathp.parse(element.path).base);
                    if (
                        pathp.parse(element.path).base ===
                        pathp.parse(path).base
                    ) {
                        filePath = element.path;
                    }
                    if (
                        pathp.parse(element.path).base ===
                        pathp.parse(path).base
                    ) {
                        fileID = element.id;
                    }
                });

                // console.log(filePath);
                callback({
                    fileName: filePath,
                    id: fileID,
                    changeTimeStamp: stats.mtime
                });
            }
        });
    },
    removeAll: async function () {
        // console.log('here is data ', data.length);
        return new Promise(async (resolve, reject) => {
            try {
                // await watcher.close();
                let path = [];
                for (let i = 0; i < data.length; i++) {
                    let check = fs.existsSync(data[i].path);
                    if (!check) {
                        return reject({
                            statusCode: 400,
                            message: `${data[i]} does not exists`,
                            success: false
                        });
                    } else {
                        path.push(data[i].path);
                    }
                }
                // console.log(path);

                await watcher.unwatch(path);

                data = [];
                alreadySeen = [];

                return resolve({
                    statusCode: 200,
                    message: 'Successfully Removed All files from watcher',
                    success: true
                });
            } catch (e) {
                return reject({
                    statusCode: 400,
                    message: e.message,
                    success: false
                });
            }
        });
    },
    close: async function () {
        return new Promise(async (resolve, reject) => {
            try {
                await watcher.close();
                data = [];
                alreadySeen = [];
                return resolve({
                    statusCode: 200,
                    message: 'Successfully Removed All',
                    success: true
                });
            } catch (e) {
                return reject({
                    statusCode: 400,
                    message: e.message,
                    success: false
                });
            }
        });
    },
    getWatched: async function () {
        return new Promise(async (resolve, reject) => {
            try {
                // await watcher.on('ready', async () => {
                // await waitForWatcher(watcher);
                let check = await watcher.getWatched();

                // console.log(check);
                return resolve({
                    statusCode: 200,
                    Record: check,
                    success: true
                });
                // });
            } catch (e) {
                return reject({
                    statusCode: 400,
                    message: e.message,
                    success: false
                });
            }
        });
    }
};

module.exports = EnapsoFileWatcher;
