import jwt from "jsonwebtoken";
import { UserModel } from "../../../database/models/user.model.js";
import { catchError } from "../../middleware/catchError.js";
import { AppError } from "../../utils/AppError.js";
import bcrypt from 'bcrypt';


const signUp = catchError(async (req, res, next) => {
  let user = new UserModel(req.body); //new updates to user
  
  await user.save(); //save the user body after updating
  let token = jwt.sign({userId : user._id , role : user.role } , process.env.JWT_KEY);
  res.json({ message: "success" , token });
  
  // sendEmail(req.body.email);
});

const signin = catchError(async (req, res, next) => {
  let user = await UserModel.findOne({ email: req.body.email });
  if (user && bcrypt.compareSync(req.body.password, user.password)) {
    let token = jwt.sign({userId : user._id , email : user.email } , process.env.JWT_KEY);
    return res.json({ message: "Success", token });
  }
    // return res.json({ message: "Invalid Credentials" });

    next(new AppError('Invalid credentials', 401));
    //401 Unauthorized
});

const changePassword = catchError(async (req, res, next) => {
  if (req.user && bcrypt.compareSync(req.body.password, req.user.password)) {
    let token = jwt.sign({userId : req.user._id , email : req.user.email } , process.env.JWT_KEY);
   await UserModel.findByIdAndUpdate(req.user._id, {password : req.body.newPassword, 
    passwordChangedAt: Date.now()} )
    return res.json({ message: "Success", token });
  }
    next(new AppError('Invalid credentials', 401)); //401 Unauthorized
});

const protectedRoutes = catchError(async (req, res, next) => {
 //1- token is exist or not
const {token} = req.headers
if (!token) return next(new AppError('token is not provided' , 401)); //401
 //2-verfiy token
const decodedToken = jwt.verify(token, process.env.JWT_KEY) 
//3- userId -> exist or not
 const user = await UserModel.findById(decodedToken.userId)
 if (!user) return next(new AppError('user is not found' , 401)); 
//4- user token valid or not
if (user.passwordChangedAt) {
  let time = parseInt(user?.passwordChangedAt.getTime()/1000)
  if (time > decodedToken.iat) return next(new AppError('invalid token'))
}
req.user = user
next()
});

const allowedTo = (...roles) => {
return catchError(async (req, res, next) => {
if(!roles.includes(req.user.role)) return next(new AppError('you are not authorized'))

next()
}); 
}

export { signUp, signin, protectedRoutes, changePassword, allowedTo};
