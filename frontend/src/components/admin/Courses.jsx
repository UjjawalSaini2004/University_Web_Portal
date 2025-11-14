import React, { useEffect, useState } from 'react';
import Layout from '../common/Layout';
import adminService from '../../services/adminService';
import Modal from '../common/Modal';
import Input from '../common/Input';
import { FiEdit2, FiTrash2, FiPlus, FiSearch, FiBook } from 'react-icons/fi';
import { toast } from 'react-toastify';
import Loader from '../common/Loader';

const Courses = () => {
  const [courses, setCourses] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [faculty, setFaculty] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingCourse, setEditingCourse] = useState(null);
  const [formData, setFormData] = useState({
    code: '',
    name: '',
    description: '',
    credits: '',
    department: '',
    semester: '',
    type: '',
    maxStudents: '',
    faculty: '',
    syllabus: '',
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      console.log('🔄 Fetching courses, departments, and faculty from database...');
      setLoading(true);
      
      const [coursesRes, deptsRes, facultyRes] = await Promise.all([
        adminService.getCourses(),
        adminService.getDepartments(),
        adminService.getFaculty()
      ]);
      
      console.log('✅ Courses fetched:', coursesRes);
      console.log('✅ Departments fetched:', deptsRes);
      console.log('✅ Faculty fetched:', facultyRes);
      
      setCourses(coursesRes.data || []);
      setDepartments(deptsRes.data?.departments || []);
      setFaculty(facultyRes.data || []);
    } catch (error) {
      console.error('❌ Error fetching data:', error);
      toast.error('Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this course?')) return;
    
    try {
      console.log('🗑️ Deleting course:', id);
      await adminService.deleteCourse(id);
      toast.success('Course deleted successfully');
      await fetchData(); // Refresh all data
      console.log('✅ Course deleted and data refreshed');
    } catch (error) {
      console.error('❌ Error deleting course:', error);
      toast.error('Failed to delete course');
    }
  };

  const handleEdit = (course) => {
    console.log('✏️ Editing course:', course);
    setEditingCourse(course);
    setFormData({
      code: course.code || '',
      name: course.name || '',
      description: course.description || '',
      credits: course.credits || '',
      department: course.department?._id || '',
      semester: course.semester || '',
      type: course.type || '',
      maxStudents: course.maxStudents || '',
      faculty: course.faculty?._id || '',
      syllabus: course.syllabus || '',
      academicYear: course.academicYear || '',
    });
    setShowModal(true);
  };

  const handleAdd = () => {
    console.log('➕ Adding new course');
    setEditingCourse(null);
    setFormData({
      code: '',
      name: '',
      description: '',
      credits: '',
      department: '',
      semester: '',
      type: '',
      maxStudents: '',
      faculty: '',
      syllabus: '',
      academicYear: '2024-2025',
    });
    setShowModal(true);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('📝 Submitting course data:', formData);

    try {
      if (editingCourse) {
        await adminService.updateCourse(editingCourse._id, formData);
        toast.success('Course updated successfully');
        console.log('✅ Course updated');
      } else {
        await adminService.addCourse(formData);
        toast.success('Course added successfully');
        console.log('✅ Course added');
      }
      
      setShowModal(false);
      await fetchData(); // Refresh all data immediately
      console.log('✅ Data refreshed after save');
    } catch (error) {
      console.error('❌ Error saving course:', error);
      toast.error(error.response?.data?.message || 'Failed to save course');
    }
  };

  const filteredCourses = courses.filter(course => 
    course.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    course.code?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">Courses Management</h1>
          <button 
            onClick={handleAdd}
            className="btn btn-primary flex items-center space-x-2"
          >
            <FiPlus size={20} />
            <span>Add Course</span>
          </button>
        </div>

        {/* Search Bar */}
        <div className="card p-4">
          <div className="relative">
            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search courses by name or code..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input pl-10 w-full"
            />
          </div>
        </div>

        {/* Courses Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCourses.length === 0 ? (
            <div className="col-span-full card p-8 text-center text-gray-500">
              No courses found
            </div>
          ) : (
            filteredCourses.map((course) => (
              <div key={course._id} className="card hover:shadow-lg transition-shadow">
                <div className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div className="w-12 h-12 rounded-lg bg-purple-100 flex items-center justify-center">
                      <FiBook className="text-purple-600" size={24} />
                    </div>
                    <div className="flex space-x-2">
                      <button
                        className="text-primary-600 hover:text-primary-900"
                        onClick={() => handleEdit(course)}
                      >
                        <FiEdit2 size={18} />
                      </button>
                      <button
                        className="text-red-600 hover:text-red-900"
                        onClick={() => handleDelete(course._id)}
                      >
                        <FiTrash2 size={18} />
                      </button>
                    </div>
                  </div>
                  
                  <div className="mb-2">
                    <span className="text-sm font-semibold text-primary-600">{course.code}</span>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{course.name}</h3>
                  <p className="text-sm text-gray-600 mb-4 line-clamp-2">{course.description}</p>
                  
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-500">Department:</span>
                      <span className="text-gray-900">{course.department?.name || 'N/A'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Credits:</span>
                      <span className="text-gray-900">{course.credits}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Semester:</span>
                      <span className="text-gray-900">{course.semester}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Type:</span>
                      <span className="text-gray-900 capitalize">{course.type?.replace('_', ' ')}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Faculty:</span>
                      <span className="text-gray-900">{course.faculty?.firstName} {course.faculty?.lastName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Max Students:</span>
                      <span className="text-gray-900">{course.maxStudents}</span>
                    </div>
                  </div>
                  
                  <div className="mt-4 pt-4 border-t">
                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                      course.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                    }`}>
                      {course.status}
                    </span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Add/Edit Modal */}
      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title={editingCourse ? 'Edit Course' : 'Add New Course'}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Course Code"
              name="code"
              value={formData.code}
              onChange={handleInputChange}
              placeholder="CS101"
              required
            />
            <Input
              label="Credits"
              name="credits"
              type="number"
              value={formData.credits}
              onChange={handleInputChange}
              placeholder="3"
              required
            />
          </div>

          <Input
            label="Course Name"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            placeholder="Introduction to Computer Science"
            required
          />

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              rows="3"
              className="input"
              placeholder="Course description..."
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Department</label>
              <select
                name="department"
                value={formData.department}
                onChange={handleInputChange}
                className="input"
                required
              >
                <option value="">Select Department</option>
                {departments.map(dept => (
                  <option key={dept._id} value={dept._id}>
                    {dept.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Faculty</label>
              <select
                name="faculty"
                value={formData.faculty}
                onChange={handleInputChange}
                className="input"
              >
                <option value="">Select Faculty</option>
                {faculty.map(fac => (
                  <option key={fac._id} value={fac._id}>
                    {fac.firstName} {fac.lastName}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <Input
              label="Semester"
              name="semester"
              type="number"
              value={formData.semester}
              onChange={handleInputChange}
              placeholder="1"
              required
            />

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Type</label>
              <select
                name="type"
                value={formData.type}
                onChange={handleInputChange}
                className="input"
                required
              >
                <option value="">Select Type</option>
                <option value="theory">Theory</option>
                <option value="practical">Practical</option>
                <option value="theory_practical">Theory + Practical</option>
              </select>
            </div>

            <Input
              label="Max Students"
              name="maxStudents"
              type="number"
              value={formData.maxStudents}
              onChange={handleInputChange}
              placeholder="60"
            />
          </div>

          <Input
            label="Syllabus Link (optional)"
            name="syllabus"
            value={formData.syllabus}
            onChange={handleInputChange}
            placeholder="https://..."
          />

          <Input
            label="Academic Year"
            name="academicYear"
            value={formData.academicYear}
            onChange={handleInputChange}
            placeholder="2024-2025"
            required
          />

          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={() => setShowModal(false)}
              className="btn btn-secondary"
            >
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              {editingCourse ? 'Update' : 'Add'} Course
            </button>
          </div>
        </form>
      </Modal>
    </Layout>
  );
};

export default Courses;
