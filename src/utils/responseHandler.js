import httpStatus from "../assets/messages/httpStatus.js";

const responseHandler = (status = "NotFound", key, customMSG = null) => {
  let respone = httpStatus[status];
  respone.message = customMSG || respone.customMessage.replace("{key}", key);
  return respone;
};

export default responseHandler;
