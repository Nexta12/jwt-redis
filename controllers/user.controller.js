const User = require('../models/user.model');
const redis_client = require('../redis_connect')

async function Register(req, res){
    // encrypt password
    const user = new User({
        username: req.body.username,
        password: req.body.password
    });

    try {
        const saved_user = await user.save()
        res.json({status: true, message: 'User Registered Successflly', data: saved_user})
    } catch (error) {
        // 
         res.json({status: false, message: 'Something went Wrong in the Server', data: error})
    }
}

async function Login(req, res){
    const username = req.body.username;
    const password = req.body.password;

    try {
        const user = await User.findOne({username: username, password: password}).exec();
        if(user === null) res.status(401).json({status: false, message: 'username or password Invalid'})

         const accessToken = jwt.sign({ sub: user._id },process.env.JWT_ACCESS_SECRET,{ expiresIn: process.env.JWT_ACCESS_TIME });
         const refreshToken = GenerateRefreshToken(user._id);
         return res.json({ status: true, message: "login Success", data: { accessToken, refreshToken }});

    } catch (error) {
        res.json({status: false, message: 'Something went Wrong in the Server', data: error})
         
    }
}


 async function Logout(req, res) {
   const user_id = req.userData.sub;
   // remove the refresh token
   await redis_client.del(user_id.toString());
//    blacklist current access token
   await redis_client.set("BL_" + user_id.toString(), token);
   return res.json({ status: true, message: "success" });
 }


 function GetAccessToken(req, res){
     const user_id = req.userData.sub;
     // generate a new access Token
     const accessToken = jwt.sign(
       { sub: user_id },
       process.env.JWT_ACCESS_SECRET,
       { expiresIn: process.env.JWT_ACCESS_TIME }
     );
     const refreshToken = GenerateRefreshToken(user_id);
     return res.json({
       status: true,
       message: "Success",
       data: { accessToken, refreshToken },
     });
 }

//   generate RefreshToken
 function GenerateRefreshToken(user_id){
     const refreshToken = jwt.sign({ sub: user_id }, process.env.JWT_REFRESH_SECRET, { expiresIn: process.env.JWT_REFRESH_TIME } );


       redis_client.get(user_id.toString(), (err, data)=>{
           if(err)throw err;
            redis_client.set(user_id.toString(), JSON.stringify({token: refreshToken}));

       });

         return refreshToken
 }





module.exports = {
    Register,
    Login,
    Logout,
    GetAccessToken
}