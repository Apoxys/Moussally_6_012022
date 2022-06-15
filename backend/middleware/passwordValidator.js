const passwordValidator = require('password-validator');

const passwordSchema = new passwordValidator();

passwordSchema
.is().min(3)
.is().max(100)
.has().uppercase()
.has().digits(2);


module.exports = (req, res, next) => {
    console.log(req.body.password)
    if(passwordSchema.validate(req.body.password)){
        res.status(201).json({message: 'password ok'})
        next;
    }
    else {
        res.status(400).json({error: "password failed those specifics : "+passwordSchema.validate('req.body.password', { list: true })})
    }
}