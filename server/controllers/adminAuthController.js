import jwt from 'jsonwebtoken';

const getAdminCredentials = () => ({
    email: process.env.ADMIN_EMAIL || 'admin@mediconnect.com',
    password: process.env.ADMIN_PASSWORD || 'Admin@123'
});

const createAdminToken = (email) => jwt.sign(
    { email, role: 'admin' },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
);

const loginAdmin = async (req, res) => {
    try {
        const { email, password } = req.body;
        const adminCredentials = getAdminCredentials();

        if (!email || !password) {
            return res.status(400).json({ success: false, message: "Email and password are required" });
        }

        if (email.trim().toLowerCase() !== adminCredentials.email.toLowerCase() || password !== adminCredentials.password) {
            return res.status(401).json({ success: false, message: "Invalid admin credentials" });
        }

        const token = createAdminToken(adminCredentials.email);
        res.json({
            success: true,
            token,
            role: 'admin',
            admin: {
                name: 'Admin',
                email: adminCredentials.email
            }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: error.message });
    }
};

const getAdminProfile = async (req, res) => {
    try {
        const adminCredentials = getAdminCredentials();
        res.json({
            success: true,
            admin: {
                name: 'Admin',
                email: req.adminEmail || adminCredentials.email
            }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: error.message });
    }
};

export { loginAdmin, getAdminProfile };
