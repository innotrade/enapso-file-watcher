const chokidar = require('chokidar');
const path = require('path');

const watcher = chokidar.watch('file, dir, glob, or array', {
    // ignored: /(^|[\/\\])\../, // ignore dotfiles
    persistent: true
});

let data;

const EnapsoFileWatcher = {
    add: async function (option) {
        if (!Array.isArray(option)) {
            return {
                status: 400,
                message: 'not a valid inpout'
            };
        }
        // try {
        //     data = option;
        //     let path = [];

        //     option.forEach((element) => {
        //         path.push(element.path);
        //         // console.log(element.path);
        //     });
        // } catch (e) {
        //     // return {error}
        //     return e.message;
        // }

        // watcher.add(path);
    },

    remove: async function () {},
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
            // console.log(
            //     `File ${path} changed size to ${JSON.stringify(stats)}`
            // );
        });
    }
};

module.exports = EnapsoFileWatcher;
