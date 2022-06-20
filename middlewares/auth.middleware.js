const jwt = require('jsonwebtoken')
const redis_client = require('../redis_connect')


// custome middleware to verify Access Token
function verifyToken(req, res, next) {
  try {
    const token = req.headers.authorization.split(" ")[1];

    const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
    req.userData = decoded;
    next();
  } catch (error) {
    return res.json({
      status: false,
      message: "Your Session is not Valid",
      data: error,
    });
  }
}

//  custome Middleware to verify Refresh Token

function verifyRefreshToken(req, res, next) {
  const token = req.body.token;
  if (token === null)
    return res.json({ status: false, message: "Invalid Reques" });
  try {
    const decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET);
    req.userData = decoded;

    //    verify if token is in store or not.
     
    redis_client.get(decoded.sub.toString(), (err, data)=>{
        if(err)throw err;
        if(data === null) res.status(401).json({ status: false, message: "Invalid Request, Token is not in Store" });
        if (JSON.parse(data).token != token)return res.json({status: false, message: "Token is not same in the Store"});
        
      next();
    })
  } catch (error) {
      return res.json({
      status: false,
      message: "Your Session is not Valid",
      data: error,
    });
  }
}

module.exports = { verifyRefreshToken , verifyToken};