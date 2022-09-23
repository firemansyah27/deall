const jwt = require('jsonwebtoken');

exports.refresh = async (req, res) => {
    const refreshToken = req.cookies.refreshToken;
    if (refreshToken == null) res.sendStatus(401);

    await Users.find({ refresh_token: refreshToken })
        .then(async (data )=> {
            if(data.length == 0){
                res.sendStatus(403);
            } else {
                jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, decoded) => {
                    if(err) res.sendStatus(403);
                    const userId = data[0].id
                    const name = data[0].name
                    const email = data[0].email
                    const isAdmin = data[0].is_admin

                    const accessToken = jwt.sign({ userId, name, email, isAdmin }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '1d'})
                    res.json({ accessToken })
                })
            }
        })
        .catch(err => {
            res.status(500).send({
                message:
                err.message || "Some error occurred while verifying token."
            });
        });
}