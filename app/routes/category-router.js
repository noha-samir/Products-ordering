var router = require('express').Router();
var CategoryController = require('../controllers/category-controller');
var CategoryValidation = require('../validations/category-validation');

router.get('/', CategoryValidation.validInputsForListCategory, CategoryController.controllerListCategories);

module.exports = router;