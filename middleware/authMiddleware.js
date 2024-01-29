const jwt = require('jsonwebtoken');

module.exports = async (req, res, next) => {
    
    try {
        const token = req.headers["authorisation"].split(" ")[1]
        jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
            if (err) {
                return res.status(401).send({
                    message: "Auth failed: 2",
                    success: false,
                })
            } else {
                req.body.userId = decoded.id;
                next();
            }
        })
    } catch (e) {
        return res.status(401).send({
            message: "Auth failed",
            success: false,
        })
    }
}