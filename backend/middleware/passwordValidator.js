const passwordValidator = require('password-validator');

const passwordSchema = new passwordValidator();

passwordSchema
    .is().min(8)
    .is().max(64)
    .has().not().spaces()
    .has().uppercase()
    .has().lowercase()
    .has().digits();


module.exports = (req, res, next) => {
    //console.log(req.body.password)
    if (passwordSchema.validate(req.body.password)) {      
        next();
    }
    else {
        window.alert("Votre Mot de passe ne respecte pas les critères suivants :" + passwordSchema.validate(req.body.password, { list: true }))
        res.status(400).json({ error: "password failed those specifics : " + passwordSchema.validate(req.body.password, { list: true }) })
    }
}