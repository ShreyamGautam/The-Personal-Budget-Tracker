const Group = require('../models/Group');
const User = require('../models/User');
const GroupExpense = require('../models/GroupExpense'); 

// --- GROUP MANAGEMENT FUNCTIONS ---

/**
 * @desc    Create a new group
 * @route   POST /api/v1/groups
 * @access  Private
 */
exports.createGroup = async (req, res) => {
    const { name, description } = req.body;
    try {
        const newGroup = new Group({
            name,
            description,
            createdBy: req.user.id,
            members: [req.user.id] // The creator is automatically a member
        });
        const group = await newGroup.save();
        res.status(201).json(group);
    } catch (error) {
        console.error("Error creating group:", error);
        res.status(500).json({ message: 'Server Error' });
    }
};

/**
 * @desc    Get all groups for the logged-in user
 * @route   GET /api/v1/groups
 * @access  Private
 */
exports.getGroups = async (req, res) => {
    try {
        const groups = await Group.find({ members: req.user.id })
            .populate('members', 'name email')
            .sort({ createdAt: -1 });
        res.status(200).json(groups);
    } catch (error) {
        console.error("Error fetching groups:", error);
        res.status(500).json({ message: 'Server Error' });
    }
};

/**
 * @desc    Get details for a single group
 * @route   GET /api/v1/groups/:id
 * @access  Private
 */
exports.getGroupDetails = async (req, res) => {
    try {
        const group = await Group.findById(req.params.id).populate('members', 'name email profilePicture');
        if (!group) {
            return res.status(404).json({ message: 'Group not found' });
        }
        // Ensure the user is a member of the group they are trying to view
        if (!group.members.some(member => member._id.equals(req.user.id))) {
            return res.status(403).json({ message: 'User not authorized to view this group' });
        }
        res.status(200).json(group);
    } catch (error) {
        console.error("Error fetching group details:", error);
        res.status(500).json({ message: 'Server Error' });
    }
};

/**
 * @desc    Edit a group's details (name, description)
 * @route   PUT /api/v1/groups/:id
 * @access  Private (Only creator can edit)
 */
exports.editGroup = async (req, res) => {
    const { name, description } = req.body;
    try {
        const group = await Group.findById(req.params.id);
        if (!group) return res.status(404).json({ message: 'Group not found' });

        // Only the user who created the group can edit it
        if (group.createdBy.toString() !== req.user.id) {
            return res.status(403).json({ message: 'User not authorized to edit this group' });
        }

        group.name = name || group.name;
        group.description = description || group.description;

        const updatedGroup = await group.save();
        res.status(200).json(updatedGroup);
    } catch (error) {
        console.error("Error editing group:", error);
        res.status(500).json({ message: 'Server Error' });
    }
};

/**
 * @desc    Delete a group
 * @route   DELETE /api/v1/groups/:id
 * @access  Private (Only creator can delete)
 */
exports.deleteGroup = async (req, res) => {
    try {
        const group = await Group.findById(req.params.id);
        if (!group) return res.status(404).json({ message: 'Group not found' });

        // Only the user who created the group can delete it
        if (group.createdBy.toString() !== req.user.id) {
            return res.status(403).json({ message: 'User not authorized to delete this group' });
        }

        // Before deleting the group, delete all associated expenses
        await GroupExpense.deleteMany({ group: req.params.id });
        await group.deleteOne();

        res.status(200).json({ message: 'Group and associated expenses deleted successfully' });
    } catch (error) {
        console.error("Error deleting group:", error);
        res.status(500).json({ message: 'Server Error' });
    }
};


// --- MEMBER MANAGEMENT FUNCTIONS ---

/**
 * @desc    Add a new member to a group
 * @route   PUT /api/v1/groups/:id/members
 * @access  Private
 */
exports.addMember = async (req, res) => {
    const { email } = req.body;
    try {
        const group = await Group.findById(req.params.id);
        const userToAdd = await User.findOne({ email });

        if (!group) return res.status(404).json({ message: 'Group not found' });
        if (!userToAdd) return res.status(404).json({ message: 'User with this email not found' });
        
        if (group.members.includes(userToAdd.id)) {
            return res.status(400).json({ message: 'User is already a member of this group' });
        }

        group.members.push(userToAdd.id);
        await group.save();
        const populatedGroup = await Group.findById(req.params.id).populate('members', 'name email profilePicture');
        res.status(200).json(populatedGroup);
    } catch (error) {
        console.error("Error adding member:", error);
        res.status(500).json({ message: 'Server Error' });
    }
};

/**
 * @desc    Remove a member from a group
 * @route   DELETE /api/v1/groups/:id/members/:memberId
 * @access  Private (Only creator can remove)
 */
exports.removeMember = async (req, res) => {
    try {
        const group = await Group.findById(req.params.id);
        if (!group) return res.status(404).json({ message: 'Group not found' });

        // Only the group creator can remove members
        if (group.createdBy.toString() !== req.user.id) {
            return res.status(403).json({ message: 'User not authorized to remove members' });
        }

        const memberIdToRemove = req.params.memberId;

        // The creator cannot remove themselves from the group
        if (group.createdBy.toString() === memberIdToRemove) {
            return res.status(400).json({ message: 'Group creator cannot be removed' });
        }

        group.members = group.members.filter(
            (member) => member.toString() !== memberIdToRemove
        );

        await group.save();
        const populatedGroup = await Group.findById(req.params.id).populate('members', 'name email profilePicture');
        res.status(200).json(populatedGroup);
    } catch (error) {
        console.error("Error removing member:", error);
        res.status(500).json({ message: 'Server Error' });
    }
};