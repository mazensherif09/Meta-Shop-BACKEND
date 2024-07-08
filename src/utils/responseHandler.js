// JSDoc 
import httpStatus from "../assets/messages/httpStatus.js";

/**
 * @typedef {import('../assets/messages/httpStatus.js').HttpStatus} HttpStatus
 */

/**
 * @param {keyof typeof httpStatus} status - The status key
 * @param {string} key - The key to replace in the custom message
 * @param {string|null} [customMSG=null] - A custom message to use instead of the default
 * @returns {HttpStatus} The response object with the message
 */
const responseHandler = (status, key, customMSG = null) => {
  const response = { ...httpStatus[status] }; // Create a copy of the status object
  response.message = customMSG || response.customMessage.replace("{key}", key);
  return response;
};

export default responseHandler;