const bcrypt = require("bcrypt");
const db = require("../models");
const jwt = require("jsonwebtoken");
const Users = db.users;

exports.authentication = async (req, res) => {
    const { email, password } = req.body
    if (!email || !password) {
      res.status(400).send({ message: "Please enter email and password" });
      return;
    }
    
    await Users.find({ email })
        .then(async (data )=> {
            if(data.length == 0){
                res.status(400).send({ message: "Email Tidak ditemukan" });
            } else {
                const match = await bcrypt.compare(req.body.password, data[0].password)
                if(!match) res.status(400).send({ message: "Password salah" });
                const userId = data[0].id
                const name = data[0].name
                const email = data[0].email
                const is_admin = data[0].is_admin

                const accessToken = jwt.sign({ id: userId, name, email, is_admin }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '1d'})
                const refreshToken = jwt.sign({ id: userId, name, email, is_admin }, process.env.REFRESH_TOKEN_SECRET, { expiresIn: '30d'})
                
                await Users.findByIdAndUpdate(userId, { refresh_token: refreshToken}, { useFindAndModify: false })
                    .then(data => {
                        if (data.length == 0) {
                            res.status(404).send({
                            message: `Cannot update User with id=${id}. Maybe User was not found!`
                            });
                        } else {
                            res.cookie('refreshToken', refreshToken, {httpOnly: true, maxAge: 30 * 24 * 60 * 60 * 1000 })
                            res.json({ accessToken })
                        }
                    })
                    .catch(err => {
                        res.status(500).send({
                            message: "Error updating User with id=" + id
                        });
                    });
            }
        })
        .catch(err => {
            res.status(500).send({
                message:
                err.message || "Some error occurred while creating the User."
            });
        });
};

exports.register = async (req, res) => {
    const { name, email, password, confirm_password } = req.body
    if (!name || !email || !password  || !confirm_password) {
      res.status(400).send({ message: "Please enter all required fields." });
      return;
    }
  
    if (password !== confirm_password) {
        res.status(400).send({ message: "Password and confirm password does not match." });
        return;
    }
    
    await Users.find({ email })
        .then(data => {
            if(data.length !== 0){
                res.status(400).send({ message: data });
            }
        })
        .catch(err => {
            res.status(500).send({
                message:
                err.message || "Some error occurred while creating the User."
            });
        });

    const salt = await bcrypt.genSalt();
    const passwordHash = await bcrypt.hash(password, salt);
  
    const user = new Users({
      name: name,
      email: email,
      password: passwordHash
    });
  
    await user.save(user)
      .then(data => {
        res.send(data);
      })
      .catch(err => {
        res.status(500).send({
          message:
            err.message || "Some error occurred while creating the User."
        });
      });
};


exports.me = async (req, res) => {
    await Users.find({ email: req.email })
        .then(data => {
            res.send(data)
        })
        .catch(err => {
            res.status(500).send({
                message:
                err.message || "Some error occurred while creating the User."
            });
        });
};

exports.findAll = async (req, res) => {
    await Users.find({})
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
            message:
                err.message || "Some error occurred while retrieving Users."
            });
        });
};

exports.update = async (req, res) => {
    if (!req.body) {
        return res.status(400).send({
          message: "Data to update can not be empty!"
        });
      }
    
    const id = req.params.id;

    await Users.findByIdAndUpdate(id, req.body, { useFindAndModify: false })
        .then(data => {
            if (data.length == 0) {
                res.status(404).send({
                message: `Cannot update User with id=${id}. Maybe User was not found!`
                });
            } else {
                res.send({ message: "User was updated successfully.", success: true });
            }
        })
        .catch(err => {
            res.status(500).send({
                message: "Error updating User with id=" + id
            });
        });
};

exports.delete = async (req, res) => {
    const id = req.params.id;
    await Users.findByIdAndRemove(id)
      .then(data => {
        if (data.length == 0) {
          res.status(404).send({
            message: `Cannot delete User with id=${id}. Maybe User was not found!`
          });
        } else {
          res.send({
            message: "User was deleted successfully!"
          });
        }
      })
      .catch(err => {
        res.status(500).send({
          message: "Could not delete User with id=" + id
        });
      });
};