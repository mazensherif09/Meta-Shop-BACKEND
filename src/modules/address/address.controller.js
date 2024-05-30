import { UserModel } from "../../../database/models/user.model.js";
import { AsyncHandler } from "../../middleware/AsyncHandler.js";


const addToAddress = AsyncHandler(async (req, res, next) => {
  let address = await UserModel.findByIdAndUpdate(req.user._id, {$addToSet: {addresses: req.body}},
    { new: true })

  !address && res.status(404).json({ message: "address not found" }); //case not found address
  address && res.json({ message: "success", address: address.addresses }); //address after update
});

const removeFromAddress = AsyncHandler(async (req, res, next) => {
  let address = await UserModel.findByIdAndUpdate(req.user._id, 
    {$pull: {addresses:{_id:req.params.id}}},{ new: true }) 

  !address && res.status(404).json({ message: "address not found" }); //case not found address
  address && res.json({ message: "success", address: address.addresses }); //address after update
});

const getLoggedAddress = AsyncHandler(async (req, res, next) => {
  let {addresses} = await UserModel.findById(req.user._id)

  addresses && res.json({ message: "success", addresses }); //address after update
});

export { addToAddress, removeFromAddress, getLoggedAddress };
