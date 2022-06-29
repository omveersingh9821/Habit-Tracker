const User = require('../models/User');
//handle registration
module.exports.userRegistration = function(req,res){
    // console.log(req.body);
    const { name , email} = req.body;
    const errors = [];
    //check required fields
    if(!name || !email ){
        errors.push({msg:'Please fill in all fields'});
    }
    
    if(errors.length > 0){
        res.render('register',{
            errors,
            name,
            email,
            title:'Sign Up'
        });

    }else{
        //validation passed
        User.findOne({email:email})
        .then(user => {
            if(user){
                //user exists
                errors.push({msg:'Email is already registered'});
                res.render('register',{
                    errors,
                    name,
                    email,
                    title:'Sign Up'
                });
            }else{
                const newUser = new User({name,email});
                newUser.save()
                .then(user => {
                    req.flash('success_msg','You are now registered and can log in');
                    res.redirect('/users/login');

                })
                .catch(err => console.log(err));
                

                }
            
        })
    
    }

}

//login handle
module.exports.logIn = (req,res,next)=>{
    const { name, email } = req.body;
    //Checking user in database
    User.findOne({
        email: email
    }).then(user => {
        if (!user) {
            let errors = [];
            errors.push({ msg: 'This email is not registered' });
            res.render('login', {
                title:'Login',
                errors,
                name,
                email
            });
        }
        //Redirect to dashboard
        else {
            res.redirect(`/dashboard?user=${user.email}`);
        }
    });
   
}
