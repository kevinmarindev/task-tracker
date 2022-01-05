const express = require('express')
const router = express.Router()
const toDosController = require('../controllers/todos')
const {ensureAuth} = require('../middleware/auth')

router.get('/', ensureAuth, toDosController.getToDos)

router.get('/getItemsWithProject/:project', toDosController.getProjectTodos)

router.get('/today', toDosController.getDueToday)

router.post('/newitem', toDosController.createOne)

router.post('/newproject', toDosController.createProject)

router.delete('/deleteTodo/:id', toDosController.deleteOne)

router.delete('/deleteProject', toDosController.deleteProject)

router.put('/completeIt', toDosController.completeOne)

router.put('/uncompleteIt', toDosController.uncompleteIt)

router.put('/updateItem', toDosController.updateItemm)

router.put('/updateDate', toDosController.updateDate)

module.exports = router;
