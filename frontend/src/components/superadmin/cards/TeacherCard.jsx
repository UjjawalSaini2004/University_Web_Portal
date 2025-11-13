import React, { useState, useEffect } from 'react';
import superAdminService from '../../../services/superAdminService';
import Badge from '../../common/Badge';
import Modal from '../../common/Modal';
import Input from '../../common/Input';
import Button from '../../common/Button';

const TeacherCard = ({ stats, loading, onRefresh, activeCard, setActiveCard }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [teachers, setTeachers] = useState([]);
  const [pendingTeachers, setPendingTeachers] = useState([]);
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
    employeeId: '',
    qualifications: '',
    specialization: '',
    experience: '',
    address: ''
  });
  const [submitting, setSubmitting] = useState(false);

  // Sync with activeCard prop
  useEffect(() => {
    const shouldExpand = activeCard === 'teachers';
    setIsExpanded(shouldExpand);
  }, [activeCard]);

  useEffect(() => {
    if (isExpanded) {
      fetchTeacherData();
    }
  }, [isExpanded]);

  const fetchTeacherData = async () => {
    try {
      setLoadingData(true);
      const [teachersRes, pendingRes] = await Promise.all([
        superAdminService.getAllTeachers({ page: 1, limit: 20 }),
        superAdminService.getPendingTeachers()
      ]);

      if (teachersRes.success) {
        setTeachers(teachersRes.data.users || teachersRes.data || []);
      }
      if (pendingRes.success) {
        setPendingTeachers(pendingRes.data || []);
      }
    } catch (error) {
      console.error('Error fetching teacher data:', error);
    } finally {
      setLoadingData(false);
    }
  };

  const handleApprove = async (teacherId) => {
    try {
      const result = await superAdminService.approveTeacher(teacherId);
      if (result.success) {
        fetchTeacherData();
        onRefresh();
      }
    } catch (error) {
      console.error('Error approving teacher:', error);
      alert('Failed to approve teacher');
    }
  };

  const handleDeny = async (teacherId) => {
    const reason = prompt('Enter reason for denial:');
    if (!reason) return;

    try {
      const result = await superAdminService.denyTeacher(teacherId, reason);
      if (result.success) {
        fetchTeacherData();
        onRefresh();
      }
    } catch (error) {
      console.error('Error denying teacher:', error);
      alert('Failed to deny teacher');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      const result = await superAdminService.createTeacher(formData);
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
          employeeId: '',
          qualifications: '',
          specialization: '',
          experience: '',
          address: ''
        });
        fetchTeacherData();
        onRefresh();
        alert('Teacher created successfully!');
      }
    } catch (error) {
      console.error('Error creating teacher:', error);
      alert('Failed to create teacher');
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
        className="bg-gradient-to-r from-green-500 to-green-600 px-6 py-5 cursor-pointer"
        onClick={() => {
          const newState = !isExpanded;
          setIsExpanded(newState);
          setActiveCard(newState ? 'teachers' : null);
        }}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            {/* Icon */}
            <div className="w-12 h-12 bg-white bg-opacity-20 rounded-lg flex items-center justify-center flex-shrink-0">
              <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            {/* Title */}
            <div>
              <h3 className="text-xl font-bold text-white">Teachers</h3>
              <p className="text-sm text-green-100 mt-0.5">Manage faculty members</p>
            </div>
          </div>
          {/* Expand/Collapse Button - Circular */}
          <button
            className="w-10 h-10 bg-white bg-opacity-20 hover:bg-opacity-30 rounded-full flex items-center justify-center transition-all duration-300 flex-shrink-0"
            onClick={(e) => {
              e.stopPropagation();
              const newState = !isExpanded;
              setIsExpanded(newState);
              setActiveCard(newState ? 'teachers' : null);
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
                <p className="text-sm text-gray-500 mt-0.5">Faculty statistics at a glance</p>
              </div>
            </div>
            <div className="h-px bg-gradient-to-r from-green-200 via-green-300 to-transparent mb-4"></div>
            <div className="bg-green-50 rounded-lg p-4 border border-green-100">
              <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-gray-500">Total Teachers</p>
                <p className="text-3xl font-bold text-gray-900">{stats?.users?.teachers || 0}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Pending Approvals</p>
                <p className="text-3xl font-bold text-yellow-600">{stats?.waitlist?.teachers || 0}</p>
              </div>
            </div>
            </div>
          </div>

          {/* SECTION B - MAIN LIST / TABLE */}
          <div>
            <div className="flex items-center mb-4">
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900">All Faculty Members</h3>
                <p className="text-sm text-gray-500 mt-0.5">Complete list of teaching staff</p>
              </div>
              <Badge variant="info">{teachers.length} total</Badge>
            </div>
            <div className="h-px bg-gradient-to-r from-green-200 via-green-300 to-transparent mb-4"></div>
            <div className="border border-gray-200 rounded-lg overflow-hidden">
              <div className="max-h-64 overflow-y-auto">
                {loadingData ? (
                  <div className="p-8 text-center text-gray-500">Loading teachers...</div>
                ) : teachers.length === 0 ? (
                  <div className="p-8 text-center text-gray-500">No teachers found</div>
                ) : (
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50 sticky top-0">
                      <tr>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Employee ID</th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {teachers.map((teacher) => (
                        <tr key={teacher._id} className="hover:bg-gray-50">
                          <td className="px-4 py-3 text-sm font-medium text-gray-900">
                            {teacher.firstName} {teacher.lastName}
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-600">{teacher.email}</td>
                          <td className="px-4 py-3 text-sm text-gray-600">{teacher.employeeId || 'N/A'}</td>
                          <td className="px-4 py-3">
                            <Badge variant={teacher.isActive ? 'success' : 'danger'}>
                              {teacher.isActive ? 'Active' : 'Inactive'}
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
                <p className="text-sm text-gray-500 mt-0.5">Faculty awaiting verification</p>
              </div>
              <Badge variant="warning">{pendingTeachers.length} pending</Badge>
            </div>
            <div className="h-px bg-gradient-to-r from-yellow-200 via-yellow-300 to-transparent mb-4"></div>
            <div className="space-y-3">
              {loadingData ? (
                <div className="p-4 text-center text-gray-500 text-sm">Loading pending teachers...</div>
              ) : pendingTeachers.length === 0 ? (
                <div className="p-4 text-center text-gray-500 text-sm bg-gray-50 rounded-lg">
                  No pending teacher approvals
                </div>
              ) : (
                pendingTeachers.map((teacher) => (
                  <div key={teacher._id} className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900">
                          {teacher.firstName} {teacher.lastName}
                        </p>
                        <p className="text-xs text-gray-600">{teacher.email}</p>
                        <p className="text-xs text-gray-500 mt-1">
                          Specialization: {teacher.specialization || 'Not specified'}
                        </p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => handleApprove(teacher._id)}
                          className="px-3 py-1 bg-green-600 text-white text-xs font-medium rounded hover:bg-green-700 transition-colors"
                        >
                          Approve
                        </button>
                        <button
                          onClick={() => handleDeny(teacher._id)}
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

          {/* SECTION D - ADD NEW TEACHER */}
          <div>
            <div className="flex items-center mb-4">
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900">Add New Teacher</h3>
                <p className="text-sm text-gray-500 mt-0.5">Register a new faculty member</p>
              </div>
            </div>
            <div className="h-px bg-gradient-to-r from-green-200 via-green-300 to-transparent mb-4"></div>
            <Button
              onClick={() => setShowAddModal(true)}
              variant="success"
              className="w-full"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              Add New Teacher
            </Button>
          </div>
        </div>
      </div>
    </div>
      )}

      {/* Add Teacher Modal */}
      <Modal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        title="Add New Teacher"
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
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Employee ID"
              name="employeeId"
              value={formData.employeeId}
              onChange={handleInputChange}
              required
            />
            <Input
              label="Experience (years)"
              name="experience"
              type="number"
              value={formData.experience}
              onChange={handleInputChange}
            />
          </div>
          <Input
            label="Qualifications"
            name="qualifications"
            value={formData.qualifications}
            onChange={handleInputChange}
            placeholder="e.g., Ph.D. in Computer Science"
          />
          <Input
            label="Specialization"
            name="specialization"
            value={formData.specialization}
            onChange={handleInputChange}
            placeholder="e.g., Machine Learning, Data Structures"
          />
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
              Create Teacher
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default TeacherCard;
