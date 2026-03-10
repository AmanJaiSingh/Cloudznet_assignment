
const jwt = require("jsonwebtoken");

module.exports = (req,res,next)=>{
  let token = req.headers.authorization;
  
  if (!token && req.query.token) {
    token = `Bearer ${req.query.token}`;
  }

  if(!token) return res.status(401).json({message:"Unauthorized"});

  try{
    const decoded = jwt.verify(token.split(" ")[1], process.env.JWT_SECRET);
    req.user = decoded;
    next();
  }catch(err){
    res.status(401).json({message:"Invalid token"});
  }
};
