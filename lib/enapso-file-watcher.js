const chokidar = require('chokidar');
const path = require('path');
const fs = require('fs');

const watcher = chokidar.watch('file, dir, glob, or array', {
    ignored: /(^|[\/\\])\../, // ignore dotfiles
    persistent: true
});

let data = [];
let alreadySeen = [];

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
            // option.forEach((element) => {
            //     if (!element['path'] || !element['id']) {
            //         return reject({
            //             statusCode: 400,
            //             message: `${JSON.stringify(element)} Wrong Format`,
            //             success: false
            //         });
            //     }

            //     if (alreadySeen[element.id]) {
            //         return reject({
            //             statusCode: 400,
            //             message: `${JSON.stringify(element)} ID already exists`,
            //             success: false
            //         });
            //     } else {
            //         alreadySeen[element.id] = element;
            //     }
            // });

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
                // path.forEach((element) => {
                //     let check = fs.existsSync(element);

                //     if (!check) {
                //         return reject({
                //             statusCode: 400,
                //             message: `${element} does not exists`,
                //             success: false
                //         });
                //     }
                // });
                await watcher.add(path);
                return resolve({
                    statusCode: 200,
                    message: 'Successfully Added',
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
            // await option.forEach((element) => {
            //     if (!element['path'] && !element['id']) {
            //         return reject({
            //             statusCode: 400,
            //             message: `${JSON.stringify(element)} Wrong Format`,
            //             success: false
            //         });
            //     }

            //     if (element['path'] && element['id']) {
            //         let file = data.filter((item) => item.path == element.path);

            //         if (
            //             element.id !== file[0].id ||
            //             element.path != file[0].path
            //         ) {
            //             return reject({
            //                 statusCode: 400,
            //                 message: `${JSON.stringify(
            //                     element
            //                 )} Path and id doest not match`,
            //                 success: false
            //             });
            //         }
            //     }
            // });

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
                });

                await watcher.on('ready', async () => {
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
                    // path.forEach((element) => {
                    //     let check = fs.existsSync(element);

                    //     if (!check) {
                    //         return reject({
                    //             statusCode: 400,
                    //             message: `${element} does not exists`,
                    //             success: false
                    //         });
                    //     }
                    // });

                    await watcher.unwatch(path);
                    return resolve({
                        statusCode: 200,
                        message: 'Successfully Removed',
                        success: true
                    });
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
                    if (
                        element.path.split('/').pop() === path.split('\\').pop()
                    ) {
                        filePath = element.path;
                    }

                    if (
                        element.path.split('/').pop() === path.split('\\').pop()
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
        return new Promise(async (resolve, reject) => {
            try {
                await watcher.close();
                data = null;
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
                await watcher.on('ready', async () => {
                    let check = await watcher.getWatched();
                    // console.log(check);
                    return resolve({
                        statusCode: 200,
                        Record: check,
                        success: true
                    });
                });
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
