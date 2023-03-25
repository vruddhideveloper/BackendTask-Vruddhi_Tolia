const express = require("express");
const router = express.Router();
const {
  getContacts,
  createContacts,
  updateContacts,
  deleteContacts,
} = require("../controllers/crudControllers");

router.post("/getContact", getContacts);

router.post("/createContact", createContacts);

router.post("/updateContact", updateContacts);

router.post("/deleteContact", deleteContacts);

module.exports = router;
