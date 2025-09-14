const express = require('express');
const { registerUser, loginUser, getUser, updateProfilePicture } = require('../controllers/userController'); 
const auth = require('../middleware/auth'); 
const upload = require('../middleware/upload');
const router = express.Router();

router.post('/register', upload.single('profilePicture'), registerUser);
router.post('/login', loginUser);
router.get('/user', auth, getUser);
router.put('/user/picture', auth, upload.single('profilePicture'), updateProfilePicture);
module.exports = router;