const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const rondas = 10;

const UserSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    pasword: {
        type: String,
        require: true
    }
});
UserSchema.pre('save', function() {
    if (this.isNew || this.isModified('pasword')) {
        const documento = this;
        bcrypt.hash(documento.pasword, rondas, (err, hashpasword) => {
            if (err) {
                return err
            } else {
                documento.pasword = hashpasword;
                return
            }
        })
    } else {
        next();
    }
})

UserSchema.method.isCorrectPassword = function(pasword, callback) {
    bcrypt.compare(pasword, this.pasword, function(err, same) {
        if (err) {
            callback(err);
        } else {
            callback(err, same)
        }
    });
}
module.exports = mongoose.model('User', UserSchema);