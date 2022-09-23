module.exports = mongoose => {
    var schema = mongoose.Schema(
        {
          name: {type: String, required: true},
          email: {type: String, required: true, unique: true},
          password: {type: String, required: true},
          refresh_token: {type: String },
          is_admin: {type: Boolean, default: false}
        },
        { timestamps: true }
    );
    
    schema.method("toJSON", function() {
        const { __v, _id, ...object } = this.toObject();
        object.id = _id;
        return object;
    });
    
    const Users = mongoose.model("users", schema);
  
    return Users;
};