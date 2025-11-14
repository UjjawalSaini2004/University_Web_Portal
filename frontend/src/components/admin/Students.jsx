import React, { useEffect, useState } from 'react';
import Layout from '../common/Layout';
import adminService from '../../services/adminService';
import Modal from '../common/Modal';
import Input from '../common/Input';
import { FiEdit2, FiTrash2, FiPlus, FiSearch } from 'react-icons/fi';
import { toast } from 'react-toastify';
import Loader from '../common/Loader';

const Students = () => {
  const [students, setStudents] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingStudent, setEditingStudent] = useState(null);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    firstName: '',
    lastName: '',
    phoneNumber: '',
    dateOfBirth: '',
    gender: '',
    department: '',
    semester: '',
    admissionYear: '',
    enrollmentNumber: '',
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      console.log('🔄 Fetching students and departments from database...');
      setLoading(true);
      
      const [studentsRes, deptsRes] = await Promise.all([
        adminService.getStudents(),
        adminService.getDepartments()
      ]);
      
      console.log('✅ Students fetched:', studentsRes);
      console.log('✅ Departments fetched:', deptsRes);
      
      // Handle response structure: response.data is the array
      setStudents(studentsRes.data || []);
      setDepartments(deptsRes.data?.departments || []);
    } catch (error) {
      console.error('❌ Error fetching data:', error);
      const errorMessage = error.response?.data?.message || 'Failed to load data';
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      console.log('📝 Submitting student data:', formData);
      
      if (editingStudent) {
        await adminService.updateStudent(editingStudent._id, formData);
        toast.success('Student updated successfully');
        console.log('✅ Student updated, refetching data...');
      } else {
        await adminService.addStudent(formData);
        toast.success('Student added successfully');
        console.log('✅ Student created, refetching data...');
      }
      
      // Immediately refetch fresh data from database
      await fetchData();
      
      // Reset form and close modal
      setShowModal(false);
      setEditingStudent(null);
      setFormData({
        email: '',
        password: '',
        firstName: '',
        lastName: '',
        phoneNumber: '',
        dateOfBirth: '',
        gender: '',
        department: '',
        semester: '',
        admissionYear: '',
        enrollmentNumber: '',
      });
    } catch (error) {
      console.error('❌ Error saving student:', error);
      const errorMessage = error.response?.data?.message || 'Failed to save student';
      toast.error(errorMessage);
    }
  };

  const handleEdit = (student) => {
    setEditingStudent(student);
    setFormData({
      email: student.email || '',
      password: '', // Don't populate password for security
      firstName: student.firstName || '',
      lastName: student.lastName || '',
      phoneNumber: student.phoneNumber || '',
      dateOfBirth: student.dateOfBirth?.split('T')[0] || '',
      gender: student.gender || '',
      department: student.department?._id || '',
      semester: student.semester || '',
      admissionYear: student.admissionYear || '',
      enrollmentNumber: student.enrollmentNumber || '',
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to deactivate this student?')) return;
    
    try {
      console.log('🗑️ Deleting student:', id);
      await adminService.deleteStudent(id);
      toast.success('Student deactivated successfully');
      console.log('✅ Student deleted, refetching data...');
      
      // Immediately refetch fresh data from database
      await fetchData();
    } catch (error) {
      console.error('❌ Error deleting student:', error);
      const errorMessage = error.response?.data?.message || 'Failed to delete student';
      toast.error(errorMessage);
    }
  };

  const handleAdd = () => {
    setEditingStudent(null);
    setFormData({
      email: '',
      password: '',
      firstName: '',
      lastName: '',
      phoneNumber: '',
      dateOfBirth: '',
      gender: '',
      department: '',
      semester: '',
      admissionYear: '',
      enrollmentNumber: '',
    });
    setShowModal(true);
  };

  const filteredStudents = students.filter(student => 
    student.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.lastName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.enrollmentNumber?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return <Loader />;
  }

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">Students Management</h1>
          <button onClick={handleAdd} className="btn btn-primary flex items-center space-x-2">
            <FiPlus size={20} />
            <span>Add Student</span>
          </button>
        </div>

        {/* Search Bar */}
        <div className="card p-4">
          <div className="relative">
            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search students by name, email, or enrollment number..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input pl-10 w-full"
            />
          </div>
        </div>

        {/* Students Table */}
        <div className="card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Student
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Enrollment No.
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Department
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Semester
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredStudents.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="px-6 py-4 text-center text-gray-500">
                      No students found
                    </td>
                  </tr>
                ) : (
                  filteredStudents.map((student) => (
                    <tr key={student._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center">
                            <span className="text-primary-600 font-semibold">
                              {student.firstName?.[0]}{student.lastName?.[0]}
                            </span>
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">
                              {student.firstName} {student.lastName}
                            </div>
                            <div className="text-sm text-gray-500">{student.email}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {student.enrollmentNumber}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {student.department?.name || 'N/A'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        Semester {student.semester}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          student.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {student.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button
                          className="text-primary-600 hover:text-primary-900 mr-4"
                          onClick={() => handleEdit(student)}
                        >
                          <FiEdit2 size={18} />
                        </button>
                        <button
                          className="text-red-600 hover:text-red-900"
                          onClick={() => handleDelete(student._id)}
                        >
                          <FiTrash2 size={18} />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Add/Edit Modal */}
        {showModal && (
          <Modal
            isOpen={showModal}
            onClose={() => {
              setShowModal(false);
              setEditingStudent(null);
            }}
            title={editingStudent ? 'Edit Student' : 'Add New Student'}
          >
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <Input
                  label="First Name"
                  type="text"
                  required
                  value={formData.firstName}
                  onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                />
                <Input
                  label="Last Name"
                  type="text"
                  required
                  value={formData.lastName}
                  onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                />
              </div>

              <Input
                label="Email"
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                disabled={editingStudent !== null}
              />

              {!editingStudent && (
                <Input
                  label="Password"
                  type="password"
                  required
                  minLength={6}
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                />
              )}

              <div className="grid grid-cols-2 gap-4">
                <Input
                  label="Phone Number"
                  type="tel"
                  required
                  value={formData.phoneNumber}
                  onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                />
                <Input
                  label="Date of Birth"
                  type="date"
                  required
                  value={formData.dateOfBirth}
                  onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Gender</label>
                <select
                  required
                  value={formData.gender}
                  onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                  className="input"
                >
                  <option value="">Select Gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Department</label>
                <select
                  required
                  value={formData.department}
                  onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                  className="input"
                >
                  <option value="">Select Department</option>
                  {departments.map((dept) => (
                    <option key={dept._id} value={dept._id}>
                      {dept.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <Input
                  label="Semester"
                  type="number"
                  required
                  min="1"
                  max="8"
                  value={formData.semester}
                  onChange={(e) => setFormData({ ...formData, semester: e.target.value })}
                />
                <Input
                  label="Admission Year"
                  type="number"
                  required
                  min="2000"
                  max="2099"
                  value={formData.admissionYear}
                  onChange={(e) => setFormData({ ...formData, admissionYear: e.target.value })}
                />
              </div>

              {editingStudent && (
                <Input
                  label="Enrollment Number"
                  type="text"
                  value={formData.enrollmentNumber}
                  onChange={(e) => setFormData({ ...formData, enrollmentNumber: e.target.value })}
                  disabled
                />
              )}

              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false);
                    setEditingStudent(null);
                  }}
                  className="btn btn-secondary"
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  {editingStudent ? 'Update Student' : 'Add Student'}
                </button>
              </div>
            </form>
          </Modal>
        )}
      </div>
    </Layout>
  );
};

export default Students;
