const express = require('express');
const router = express.Router();
const studentController = require('../controllers/studentController');

// Thống kê phải đặt TRƯỚC /:id để không bị bắt nhầm
router.get('/stats/class', studentController.getClassStats);
router.get('/stats', studentController.getStats);

router.get('/', studentController.getStudents);
router.get('/:id', studentController.getStudentById);
router.post('/', studentController.createStudent);
router.put('/:id', studentController.updateStudent);
router.delete('/:id', studentController.deleteStudent);

module.exports = router;
