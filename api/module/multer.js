const multer = require('multer'),path = require('path');

let storage = multer.diskStorage({
    destination: path.join(process.cwd(),'public/upload'),
    filename (req,file,cb) {
        let filename = (file.originalname).split(".");
        cb(null,`${Date.now()}${parseInt(1000*Math.random()).toString()}.${filename[filename.length-1]}`)
    }
});
let upload = multer({
   storage: storage,
    limits: {
        fieldSize: 5*1024
    }
});

module.exports = upload;
