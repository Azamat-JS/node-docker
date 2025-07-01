const router = require('express').Router();
const authController = require('../controllers/auth.controller');


router.post('/signUp', authController.signUp)
router.post('/login', authController.login);

module.exports = router;