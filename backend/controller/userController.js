import User from '../models/user.js'; // ✅ correct import

export async function getUsers(req, res) {
    try {
        const users = await User.find().select('-password').sort('-createdAt');
        res.status(200).json({ success: true, count: users.length, data: users });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
}

export async function getEmployees(req, res) {
    try {
        const employees = await User.find({ role: 'employee' }).select('-password').sort('-createdAt'); // ✅ add 'employee' to model enum
        res.status(200).json({ success: true, count: employees.length, data: employees });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
}

export async function getUser(req, res) {
    try {
        const user = await User.findById(req.params.id).select('-password');
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }
        res.status(200).json({ success: true, data: user });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
}

export async function updateUser(req, res) {
    try {
        delete req.body.password;

        const user = await User.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true,
        }).select('-password');

        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        res.status(200).json({ success: true, data: user });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
}

export async function deleteUser(req, res) {
    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }
        await user.deleteOne();
        res.status(200).json({ success: true, data: {} });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
}