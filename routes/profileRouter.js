const express = require("express");
const router = express.Router();
const User = require("../models/User");
const Profile = require("../models/Profile");
const authenticate = require("../middlewares/auth");
/*
    @usage : to Update the name of the user in profile
    @url : /api/users/profiles/update-name
    @fields : name
    @method : post
    @access : PRIVATE
 */
router.post("/profiles/update-name", authenticate, async (req, res) => {
  const { newName } = req.body;
  const id = req.user.id;
  try {
    const updatedData = await Profile.findOneAndUpdate(
      { user: id },
      { $set: { name: newName } },
      { new: true }
    );
    return res.status(200).json({ userData: updatedData });
  } catch (error) {
    return res.status(201).json({ msg: error.message });
  }
});

/*
    @usage : to Update the number of the user in profile
    @url : /api/users/profiles/update-number
    @fields : number
    @method : post
    @access : PRIVATE
 */
router.post("/profiles/update-number", authenticate, async (req, res) => {
  const { newNumber } = req.body;
  const id = req.user.id;
  try {
    const updatedData = await Profile.findOneAndUpdate(
      { user: id },
      { $set: { contact: newNumber } },
      { new: true }
    );
    return res.status(200).json({ userData: updatedData });
  } catch (error) {
    return res.status(201).json({ msg: error.message });
  }
});

/*
    @usage : to add new address of the user in profile
    @url : /api/users/profiles/add-address
    @fields : address object
    @method : post
    @access : PRIVATE
 */

router.post("/profiles/add-address", authenticate, async (req, res) => {
  const { address } = req.body;
  const id = req.user.id;
  try {
    const updatedData = await Profile.findOneAndUpdate(
      { user: id },
      { $push: { address: address } },
      { new: true }
    );
    return res.status(200).json({ userData: updatedData });
  } catch (error) {
    return res.status(201).json({ msg: error.message });
  }
});

/*
    @usage : to update address of the user in profile
    @url : /api/users/profiles/update-address
    @fields : address object
    @method : put
    @access : PRIVATE
 */
router.put("/profiles/update-address", authenticate, async (req, res) => {
  const  addressObj  = req.body.formData;
  const id = req.user.id;
  const addressUid = addressObj.uid;
  try {
    const updatedData = await Profile.findOneAndUpdate(
      { user: id, "address.uid": addressUid },
      { $set: { "address.$": addressObj } },
      { new: true }
    );
    return res.status(200).json({ userData: updatedData });
  } catch (error) {
    return res.status(201).json({ msg: error.message });
  }
});

/*
    @usage : to delete  address of the user in profile
    @url : /api/users/profiles/delete-address
    @fields : addressUid
    @method : delete
    @access : PRIVATE
 */

router.delete("/profiles/delete-address", authenticate, async (req, res) => {
  const { addressUid } = req.body;
  const id = req.user.id;
  try {
    const updatedData = await Profile.findOneAndUpdate(
      { user: id },
      { $pull: { address: { uid: addressUid } } },
      { new: true }
    );
    return res.status(200).json({ userData: updatedData });
  } catch (error) {
    return res.status(201).json({ msg: error.message });
  }
});

module.exports = router;
