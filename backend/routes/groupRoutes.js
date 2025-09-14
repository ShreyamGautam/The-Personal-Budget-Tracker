const express = require('express');
const auth = require('../middleware/auth');
const { 
    createGroup, 
    getGroups, 
    getGroupDetails, 
    addMember,
    editGroup,
    deleteGroup,
    removeMember
} = require('../controllers/groupController');
const router = express.Router();

// Groups
router.route('/groups')
    .post(auth, createGroup)
    .get(auth, getGroups);

// Single Group
router.route('/groups/:id')
    .get(auth, getGroupDetails)
    .put(auth, editGroup)
    .delete(auth, deleteGroup);

// Group Members
router.route('/groups/:id/members')
    .put(auth, addMember);

router.route('/groups/:id/members/:memberId')
    .delete(auth, removeMember);

module.exports = router;