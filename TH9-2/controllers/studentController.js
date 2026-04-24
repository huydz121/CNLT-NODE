const students = require('../data');

const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

const getStats = (req, res) => {
    const total = students.length;
    const activeStudents = students.filter(s => !s.isDeleted);
    const active = activeStudents.length;
    const deleted = total - active;
    const averageAge = active > 0 ? (activeStudents.reduce((sum, s) => sum + s.age, 0) / active) : 0;
    
    res.json({ total, active, deleted, averageAge });
};

const getClassStats = (req, res) => {
    const activeStudents = students.filter(s => !s.isDeleted);
    const stats = activeStudents.reduce((acc, s) => {
        acc[s.class] = (acc[s.class] || 0) + 1;
        return acc;
    }, {});
    
    const result = Object.keys(stats).map(className => ({ class: className, count: stats[className] }));
    res.json(result);
};

const getStudents = (req, res) => {
    let result = students.filter(s => !s.isDeleted); // Bỏ qua user đã xóa mềm

    // Lọc theo name và class
    if (req.query.name) result = result.filter(s => s.name.toLowerCase().includes(req.query.name.toLowerCase()));
    if (req.query.class) result = result.filter(s => s.class === req.query.class);

    // Sắp xếp
    if (req.query.sort === 'age_desc') result.sort((a, b) => b.age - a.age);

    // Phân trang
    const page = parseInt(req.query.page);
    const limit = parseInt(req.query.limit);
    if (page && limit) {
        const start = (page - 1) * limit;
        const paginatedData = result.slice(start, start + limit);
        return res.json({ page, limit, total: result.length, data: paginatedData });
    }

    res.json(result);
};

const getStudentById = (req, res) => {
    const student = students.find(s => s.id === parseInt(req.params.id) && !s.isDeleted);
    if (!student) return res.status(404).json({ error: "Không tìm thấy hoặc đã bị xóa" });
    res.json(student);
};

const createStudent = (req, res) => {
    const { name, email, age, className } = req.body; // dùng className thay vì class do trùng từ khóa JS
    
    if (!name || name.length < 2) return res.status(400).json({ error: "Tên >= 2 ký tự" });
    if (!isValidEmail(email) || students.some(s => s.email === email)) return res.status(400).json({ error: "Email sai hoặc trùng" });
    if (!age || age < 16 || age > 60) return res.status(400).json({ error: "Tuổi từ 16 - 60" });

    const newStudent = { id: students.length + 1, name, email, age, class: className, isDeleted: false };
    students.push(newStudent);
    res.status(201).json(newStudent);
};

const updateStudent = (req, res) => {
    const student = students.find(s => s.id === parseInt(req.params.id) && !s.isDeleted);
    if (!student) return res.status(404).json({ error: "Không tìm thấy" });

    Object.assign(student, req.body); // Cập nhật nhanh
    res.json(student);
};

const deleteStudent = (req, res) => {
    const student = students.find(s => s.id === parseInt(req.params.id) && !s.isDeleted);
    if (!student) return res.status(404).json({ error: "Không tìm thấy" });

    student.isDeleted = true; // SOFT DELETE
    res.json({ message: "Đã xóa mềm sinh viên" });
};

module.exports = { getStats, getClassStats, getStudents, getStudentById, createStudent, updateStudent, deleteStudent };