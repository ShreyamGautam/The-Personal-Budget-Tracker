const multer = require('multer');
const path = require('path');

// Set up storage for uploaded files
const storage = multer.diskStorage({
    destination: './uploads/',
    filename: function(req, file, cb){
        cb(null, 'profile-' + Date.now() + path.extname(file.originalname));
    }
});

// Initialize upload variable
const upload = multer({
    storage: storage,
    limits: { fileSize: 1000000 }, // 1MB file size limit
    fileFilter: function(req, file, cb){
        checkFileType(file, cb);
    }
});

// Check File Type
function checkFileType(file, cb){
    const filetypes = /jpeg|jpg|png|gif/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);

    if(mimetype && extname){
        return cb(null, true);
    } else {
        cb('Error: Only images are allowed!');
    }
}

module.exports = upload;