const express = require('express');
const router = express.Router();
const PersonaController = require('../controllers/personacontrollers');

router.post('/', PersonaController.createPersona );
router.get('/', PersonaController.getAllPersonas);

module.exports = router;