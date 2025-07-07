const jwt = require('jsonwebtoken');

exports.protect = (req, res, next) => {
    const auth = req.headers.authorization;

    if(!auth || !auth.startsWith("Bearer ")) {
        return res.status(401).json({ message: "No token provided" });
    }

    const token = auth.split(" ")[1];

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log('🔐 Decoded token:', decoded);
        req.user = decoded;
        next();
    } catch (error) {
        return res.status(403).json({ message: "Invalid or expired token" });
    }

};

exports.authorize = (...roles) => {
    return ( req, res, next ) => {
        if(!roles.includes(req.user.role)){
            return res.status(403).json({ message: "Forbidden: Access denied" });
        }
        next();
    };
};