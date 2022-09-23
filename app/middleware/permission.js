exports.isAdmin = (req, res, next) => {
    if(req.is_admin) {
        next() 
    } else {
        res.sendStatus(403);
    }
}