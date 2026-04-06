import jwt from 'jsonwebtoken';

const authDoctor = async (req, res, next) => {
    try {
        const headerToken = req.headers.token;
        const authHeader = req.headers.authorization;
        const bearerToken = authHeader?.startsWith('Bearer ')
            ? authHeader.slice(7)
            : authHeader;
        const token = String(headerToken || bearerToken || '').trim();

        if (!token) {
            return res.status(401).json({ success: false, message: "Doctor not authorized" });
        }

        if (!process.env.JWT_SECRET) {
            return res.status(500).json({ success: false, message: "JWT secret is not configured" });
        }

        const tokenDecode = jwt.verify(token, process.env.JWT_SECRET);

        if (tokenDecode.role !== 'doctor') {
            return res.status(403).json({ success: false, message: "Doctor access required" });
        }

        req.doctorId = tokenDecode.id;
        next();
    } catch (error) {
        console.error("Doctor JWT Verification Failed:", error.message);
        return res.status(401).json({ success: false, message: error.message });
    }
};

export default authDoctor;
