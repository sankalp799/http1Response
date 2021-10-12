const path = require('path');
const fs = require('fs');

let controller = {};

controller.index = (data, callback) => {
    let indexFile = path.join(__dirname, '/./template/index.html');
    fs.readFile(indexFile, 'utf8', (err, data) => {
        if(!err && data){
            callback(200, data, 'html');
        }else{
            controller.notFound(data, callback);
        }
    })
};

controller.public = (data, callback) => {
    let publicFilePath = data.path;
    publicFilePath = publicFilePath.replace('public', '');

    let staticPath = path.join(__dirname, publicFilePath);
    fs.readFile(staticPath, (err, data) => {
        if(!err && data){
            let ext = publicFilePath.split('/');
            ext = ext[ext.length - 1].split('.');
            ext = ext[ext.length - 1];
            
            callback(200, data, ext);
        }else{
            callback(404, {'error':'Not Found'});
        }
    })
};

controller.notFound = (data, callback) => {
    callback(404, {'error':'page not found'}, 'json');
};

module.exports = controller;