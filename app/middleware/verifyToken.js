const jwt = require('jsonwebtoken');

exports.verify = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (token == null) res.sendStatus(401);
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
        if(err) res.sendStatus(403);
        req.email = decoded.email
        req.is_admin = decoded.is_admin
        next();
    })
}