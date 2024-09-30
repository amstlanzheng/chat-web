// server/api/get-images.js
import fs from 'fs';
import path from 'path';

export default defineEventHandler((event) => {
    const directoryPath = path.join(process.cwd(), 'static/images');

    return new Promise((resolve, reject) => {
        fs.readdir(directoryPath, (err, files) => {
            if (err) {
                reject(err);
            } else {
                resolve(files);
            }
        });
    });
});
