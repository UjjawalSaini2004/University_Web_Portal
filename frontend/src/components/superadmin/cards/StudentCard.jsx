import React, { useState, useEffect } from 'react';
import superAdminService from '../../../services/superAdminService';
import Badge from '../../common/Badge';
import Modal from '../../common/Modal';
import Input from '../../common/Input';
import Button from '../../common/Button';

const StudentCard = ({ stats, loading, onRefresh, activeCard, setActiveCard }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [students, setStudents] = useState([]);
  const [pendingStudents, setPendingStudents] = useState([]);
  const [loadingData, setLoadingData] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    firstName: '',
    lastName: '',
    phoneNumber: '',
    dateOfBirth: '',
    gender: '',
    enrollmentNumber: '',
    semester: '',
    batch: '',
    address: ''
  });
  const [submitting, setSubmitting] = useState(false);

  // Sync with activeCard prop
  useEffect(() => {
    const shouldExpand = activeCard === 'students';
    setIsExpanded(shouldExpand);
  }, [activeCard]);

  useEffect(() => {
    if (isExpanded) {
      fetchStudentData();
    }
  }, [isExpanded]);

  const fetchStudentData = async () => {
    try {
      setLoadingData(true);
      const [studentsRes, pendingRes] = await Promise.all([
        superAdminService.getAllStudents({ page: 1, limit: 20 }),
        superAdminService.getPendingStudents()
      ]);

      if (studentsRes.success) {
        setStudents(studentsRes.data.users || studentsRes.data || []);
      }
      if (pendingRes.success) {
        setPendingStudents(pendingRes.data || []);
      }
    } catch (error) {
      console.error('Error fetching student data:', error);
    } finally {
      setLoadingData(false);
    }
  };

  const handleApprove = async (studentId) => {
    try {
      const result = await superAdminService.approveStudent(studentId);
      if (result.success) {
        fetchStudentData();
        onRefresh();
      }
    } catch (error) {
      console.error('Error approving student:', error);
      alert('Failed to approve student');
    }
  };

  const handleDeny = async (studentId) => {
    const reason = prompt('Enter reason for denial:');
    if (!reason) return;

    try {
      const result = await superAdminService.denyStudent(studentId, reason);
      if (result.success) {
        fetchStudentData();
        onRefresh();
      }
    } catch (error) {
      console.error('Error denying student:', error);
      alert('Failed to deny student');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      const result = await superAdminService.createStudent(formData);
      if (result.success) {
        setShowAddModal(false);
        setFormData({
          email: '',
          password: '',
          firstName: '',
          lastName: '',
          phoneNumber: '',
          dateOfBirth: '',
          gender: '',
          enrollmentNumber: '',
          semester: '',
          batch: '',
          address: ''
        });
        fetchStudentData();
        onRefresh();
        alert('Student created successfully!');
      }
    } catch (error) {
      console.error('Error creating student:', error);
      alert('Failed to create student');
    } finally {
      setSubmitting(false);
    }
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden transition-all duration-300 hover:shadow-lg">
      {/* Card Header - Gradient */}
      <div 
        className="bg-gradient-to-r from-blue-500 to-blue-600 px-6 py-5 cursor-pointer"
        onClick={() => {
          const newState = !isExpanded;
          setIsExpanded(newState);
          setActiveCard(newState ? 'students' : null);
        }}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            {/* Icon */}
            <div className="w-12 h-12 bg-white bg-opacity-20 rounded-lg flex items-center justify-center flex-shrink-0">
              <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            </div>
            {/* Title */}
            <div>
              <h3 className="text-xl font-bold text-white">Students</h3>
              <p className="text-sm text-blue-100 mt-0.5">Manage student accounts</p>
            </div>
          </div>
          {/* Expand/Collapse Button - Circular */}
          <button
            className="w-10 h-10 bg-white bg-opacity-20 hover:bg-opacity-30 rounded-full flex items-center justify-center transition-all duration-300 flex-shrink-0"
            onClick={(e) => {
              e.stopPropagation();
              const newState = !isExpanded;
              setIsExpanded(newState);
              setActiveCard(newState ? 'students' : null);
            }}
          >
            <svg
              className={`w-6 h-6 text-white transform transition-transform duration-300 ${
                isExpanded ? 'rotate-180' : 'rotate-0'
              }`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
        </div>
      </div>

      {/* Expanded Content - White Panel */}
      {isExpanded && (
      <div
        className="transition-all duration-500 ease-in-out"
      >
        <div className="bg-gray-50 p-6">
          <div className="bg-white rounded-lg shadow-sm p-6 space-y-8">
          
          {/* SECTION A - OVERVIEW */}
          <div>
            <div className="flex items-center mb-4">
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900">Overview</h3>
                <p className="text-sm text-gray-500 mt-0.5">Student statistics at a glance</p>
              </div>
            </div>
            <div className="h-px bg-gradient-to-r from-blue-200 via-blue-300 to-transparent mb-4"></div>
            <div className="bg-blue-50 rounded-lg p-4 border border-blue-100">
              <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-gray-500">Total Students</p>
                <p className="text-3xl font-bold text-gray-900">{stats?.users?.students || 0}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Pending Approvals</p>
                <p className="text-3xl font-bold text-yellow-600">{stats?.waitlist?.students || 0}</p>
              </div>
            </div>
            </div>
          </div>

          {/* SECTION B - MAIN LIST / TABLE */}
          <div>
            <div className="flex items-center mb-4">
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900">All Students</h3>
                <p className="text-sm text-gray-500 mt-0.5">Complete list of registered students</p>
              </div>
              <Badge variant="info">{students.length} total</Badge>
            </div>
            <div className="h-px bg-gradient-to-r from-blue-200 via-blue-300 to-transparent mb-4"></div>
            <div className="border border-gray-200 rounded-lg overflow-hidden">
              <div className="max-h-64 overflow-y-auto">
                {loadingData ? (
                  <div className="p-8 text-center text-gray-500">Loading students...</div>
                ) : students.length === 0 ? (
                  <div className="p-8 text-center text-gray-500">No students found</div>
                ) : (
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50 sticky top-0">
                      <tr>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Enrollment</th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {students.map((student) => (
                        <tr key={student._id} className="hover:bg-gray-50">
                          <td className="px-4 py-3 text-sm font-medium text-gray-900">
                            {student.firstName} {student.lastName}
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-600">{student.email}</td>
                          <td className="px-4 py-3 text-sm text-gray-600">{student.enrollmentNumber || 'N/A'}</td>
                          <td className="px-4 py-3">
                            <Badge variant={student.isActive ? 'success' : 'danger'}>
                              {student.isActive ? 'Active' : 'Inactive'}
                            </Badge>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            </div>
          </div>

          {/* SECTION C - PENDING APPROVALS */}
          <div>
            <div className="flex items-center mb-4">
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900">Pending Approvals</h3>
                <p className="text-sm text-gray-500 mt-0.5">Students awaiting verification</p>
              </div>
              <Badge variant="warning">{pendingStudents.length} pending</Badge>
            </div>
            <div className="h-px bg-gradient-to-r from-yellow-200 via-yellow-300 to-transparent mb-4"></div>
            <div className="space-y-3">
              {loadingData ? (
                <div className="p-4 text-center text-gray-500 text-sm">Loading pending students...</div>
              ) : pendingStudents.length === 0 ? (
                <div className="p-4 text-center text-gray-500 text-sm bg-gray-50 rounded-lg">
                  No pending student approvals
                </div>
              ) : (
                pendingStudents.map((student) => (
                  <div key={student._id} className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900">
                          {student.firstName} {student.lastName}
                        </p>
                        <p className="text-xs text-gray-600">{student.email}</p>
                        <p className="text-xs text-gray-500 mt-1">
                          Enrollment: {student.enrollmentNumber || 'Pending'}
                        </p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => handleApprove(student._id)}
                          className="px-3 py-1 bg-green-600 text-white text-xs font-medium rounded hover:bg-green-700 transition-colors"
                        >
                          Approve
                        </button>
                        <button
                          onClick={() => handleDeny(student._id)}
                          className="px-3 py-1 bg-red-600 text-white text-xs font-medium rounded hover:bg-red-700 transition-colors"
                        >
                          Deny
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* SECTION D - ADD NEW STUDENT */}
          <div>
            <div className="flex items-center mb-4">
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900">Add New Student</h3>
                <p className="text-sm text-gray-500 mt-0.5">Register a new student account</p>
              </div>
            </div>
            <div className="h-px bg-gradient-to-r from-green-200 via-green-300 to-transparent mb-4"></div>
            <Button
              onClick={() => setShowAddModal(true)}
              variant="primary"
              className="w-full"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              Add New Student
            </Button>
          </div>
        </div>
      </div>
    </div>
      )}

      {/* Add Student Modal */}
      <Modal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        title="Add New Student"
        size="lg"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="First Name"
              name="firstName"
              value={formData.firstName}
              onChange={handleInputChange}
              required
            />
            <Input
              label="Last Name"
              name="lastName"
              value={formData.lastName}
              onChange={handleInputChange}
              required
            />
          </div>
          <Input
            label="Email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleInputChange}
            required
          />
          <Input
            label="Password"
            name="password"
            type="password"
            value={formData.password}
            onChange={handleInputChange}
            required
          />
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Phone Number"
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleInputChange}
              required
            />
            <Input
              label="Date of Birth"
              name="dateOfBirth"
              type="date"
              value={formData.dateOfBirth}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="grid grid-cols-3 gap-4">
            <Input
              label="Enrollment Number"
              name="enrollmentNumber"
              value={formData.enrollmentNumber}
              onChange={handleInputChange}
              required
            />
            <Input
              label="Semester"
              name="semester"
              type="number"
              value={formData.semester}
              onChange={handleInputChange}
              required
            />
            <Input
              label="Batch"
              name="batch"
              value={formData.batch}
              onChange={handleInputChange}
              placeholder="2024"
              required
            />
          </div>
          <Input
            label="Gender"
            name="gender"
            value={formData.gender}
            onChange={handleInputChange}
            required
          />
          <Input
            label="Address"
            name="address"
            value={formData.address}
            onChange={handleInputChange}
          />
          <div className="flex justify-end space-x-3 pt-4">
            <Button
              type="button"
              variant="secondary"
              onClick={() => setShowAddModal(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="success"
              loading={submitting}
            >
              Create Student
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default StudentCard;
