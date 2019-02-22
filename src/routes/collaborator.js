const express = require("express");
const router = express.Router();

const collaboratorController = require("../controllers/collaboratorController");

router.post("/wikis/:id/collaborator/create", collaboratorController.create);

module.exports = router;