const express = require("express");
const router = express.Router();

const collaboratorController = require("../controllers/collaboratorController");

router.post("/wikis/:id/collaborator/create", collaboratorController.create);
router.post("/wikis/:id/collaborator/:id/destroy", collaboratorController.destroy);

module.exports = router;