import joi from "joi";

const signUpSchemaValidation = joi.object({
  name: joi
    .string()
    .pattern(/[a-zA-Z]/)
    .min(2)
    .max(20)
    .required(),
  email: joi.string().email().required(),
  password: joi
    .string()
    .pattern(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/)
    .required(),
    confirmPassword: joi.valid(joi.ref("password")).required(),
  age: joi.number().integer().min(10).max(80).required(),
});

const signInSchemaValidation = joi.object({
  email: joi.string().email().required(),
  password: joi.string().pattern(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/)
    .required(),
});

const changePasswordVal = joi.object({
  password: joi.string().pattern(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/)
    .required(),
    newPassword: joi.string().pattern(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/)
    .required(),
});

export { signUpSchemaValidation, signInSchemaValidation, changePasswordVal };

//pattern matching
// abcs -> abcs : match , abcs -> ab : no match
// [] -> or , [abc] -> a or b or c : match , [abc] -> abh : no match
// [a-z] -> all char from a to z : match
// [0-9] -> 0 to 9 : match
// [@] , [_] , [$] -> @ or _ or $ : match
// [A-Za-z0-9$_@] -> a to z and A to Z and 0 to 9 and $ and _ and @ : match
//()
// ? zero or one
// + one or more
// * zero or more
//^(002|\+2)?01[0125][0-9]{8}$/  pattern(/^(002|\+2)?01[0125][0-9]{8}$/) +eg number
//^[a-z0-9A-Z]{2-50}@(gmail|yahoo).com$
