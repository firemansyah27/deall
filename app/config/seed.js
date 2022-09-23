const bcrypt = require("bcrypt");
const db = require("../models");
const Users = db.users;

module.exports = async () => {
    console.log('Initialize default user.')
    await Users.find({ is_admin: true })
        .then(async ( data ) => {
            if(data.length == 0){
                const salt = await bcrypt.genSalt();
                const passwordHash = await bcrypt.hash(process.env.DEFAULT_ADMIN_USERNAME || "password", salt);
            
                const user = new Users({
                    name: process.env.DEFAULT_ADMIN_NAME || "admin",
                    email: process.env.DEFAULT_ADMIN_EMAIL || "admin@admin.com",
                    password: passwordHash,
                    is_admin: true
                });
            
                await user.save(user)
                .then(data => {
                    // User admin created
                })
                .catch(err => {
                    throw err;
                });
            } else {
                // User admin already exist
            }

        })
        .catch(err => {
            throw err;
        });

}