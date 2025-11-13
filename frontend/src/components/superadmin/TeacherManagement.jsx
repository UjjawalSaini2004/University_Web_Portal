import React, { useState, useEffect } from 'react';
import Table from '../common/Table';
import Modal from '../common/Modal';
import Button from '../common/Button';
import { Input, Select } from '../common/Input';
import Badge from '../common/Badge';
import superAdminService from '../../services/superAdminService';
import { toast } from 'react-toastify';

const TeacherManagement = () => {
  const [teachers, setTeachers] = useState([]);
  const [pendingTeachers, setPendingTeachers] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [pendingModalOpen, setPendingModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedTeacher, setSelectedTeacher] = useState(null);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    firstName: '',
    lastName: '',
    phoneNumber: '',
    dateOfBirth: '',
    gender: '',
    department: '',
    employeeId: '',
    qualification: '',
  });

  useEffect(() => {
    fetchTeachers();
    fetchPendingTeachers();
    fetchDepartments();
  }, []);

  const fetchTeachers = async () => {
    try {
      setLoading(true);
      const response = await superAdminService.getAllTeachers();
      if (response.success) {
        setTeachers(response.data);
      }
    } catch (error) {
      toast.error('Error fetching teachers');
    } finally {
      setLoading(false);
    }
  };

  const fetchPendingTeachers = async () => {
    try {
      const response = await superAdminService.getPendingTeachers();
      if (response.success) {
        setPendingTeachers(response.data);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const fetchDepartments = async () => {
    try {
      const response = await superAdminService.getAllDepartments();
      if (response.success) {
        setDepartments(response.data);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleCreateTeacher = async (e) => {
    e.preventDefault();
    try {
      const response = await superAdminService.createTeacher(formData);
      if (response.success) {
        toast.success('Teacher created successfully');
        setCreateModalOpen(false);
        resetForm();
        fetchTeachers();
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error creating teacher');
    }
  };

  const handleUpdateTeacher = async (e) => {
    e.preventDefault();
    if (!selectedTeacher) return;
    try {
      const response = await superAdminService.updateTeacher(selectedTeacher._id, formData);
      if (response.success) {
        toast.success('Teacher updated successfully');
        setEditModalOpen(false);
        setSelectedTeacher(null);
        resetForm();
        fetchTeachers();
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error updating teacher');
    }
  };

  const handleApprove = async (teacherId) => {
    try {
      const response = await superAdminService.approveTeacher(teacherId);
      if (response.success) {
        toast.success('Teacher approved successfully');
        fetchPendingTeachers();
        fetchTeachers();
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error approving teacher');
    }
  };

  const handleDeny = async (teacherId) => {
    try {
      const response = await superAdminService.denyTeacher(teacherId, 'Teacher approval denied');
      if (response.success) {
        toast.success('Teacher denied successfully');
        fetchPendingTeachers();
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error denying teacher');
    }
  };

  const handleDelete = async () => {
    if (!selectedTeacher) return;
    try {
      const response = await superAdminService.deleteUser(selectedTeacher._id);
      if (response.success) {
        toast.success('Teacher deleted successfully');
        setDeleteModalOpen(false);
        setSelectedTeacher(null);
        fetchTeachers();
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error deleting teacher');
    }
  };

  const resetForm = () => {
    setFormData({
      email: '',
      password: '',
      firstName: '',
      lastName: '',
      phoneNumber: '',
      dateOfBirth: '',
      gender: '',
      department: '',
      employeeId: '',
      qualification: '',
    });
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const openEditModal = (teacher) => {
    setSelectedTeacher(teacher);
    setFormData({
      email: teacher.email,
      firstName: teacher.firstName,
      lastName: teacher.lastName,
      phoneNumber: teacher.phoneNumber || '',
      dateOfBirth: teacher.dateOfBirth ? teacher.dateOfBirth.split('T')[0] : '',
      gender: teacher.gender || '',
      department: teacher.department?._id || teacher.department || '',
      employeeId: teacher.employeeId || '',
      qualification: teacher.qualification || '',
    });
    setEditModalOpen(true);
  };

  const teacherColumns = [
    {
      header: 'Name',
      accessor: 'fullName',
      render: (row) => (
        <div>
          <div className="font-medium text-gray-900">{row.firstName} {row.lastName}</div>
          <div className="text-sm text-gray-500">{row.email}</div>
        </div>
      ),
    },
    {
      header: 'Employee ID',
      accessor: 'employeeId',
      cellClassName: 'text-gray-600',
    },
    {
      header: 'Department',
      accessor: 'department',
      render: (row) => (
        <span className="text-gray-600">
          {row.department?.name || 'N/A'}
        </span>
      ),
    },
    {
      header: 'Phone',
      accessor: 'phoneNumber',
      cellClassName: 'text-gray-600',
    },
    {
      header: 'Status',
      accessor: 'isActive',
      render: (row) => (
        <Badge variant={row.isActive ? 'success' : 'danger'}>
          {row.isActive ? 'Active' : 'Inactive'}
        </Badge>
      ),
    },
    {
      header: 'Actions',
      accessor: 'actions',
      render: (row) => (
        <div className="flex space-x-2">
          <button
            onClick={() => openEditModal(row)}
            className="text-indigo-600 hover:text-indigo-800 font-medium text-sm"
          >
            Edit
          </button>
          <button
            onClick={() => {
              setSelectedTeacher(row);
              setDeleteModalOpen(true);
            }}
            className="text-red-600 hover:text-red-800 font-medium text-sm"
          >
            Delete
          </button>
        </div>
      ),
    },
  ];

  const pendingColumns = [
    {
      header: 'Name',
      accessor: 'fullName',
      render: (row) => (
        <div>
          <div className="font-medium text-gray-900">{row.firstName} {row.lastName}</div>
          <div className="text-sm text-gray-500">{row.email}</div>
        </div>
      ),
    },
    {
      header: 'Department',
      accessor: 'department',
      render: (row) => (
        <span className="text-gray-600">
          {row.department?.name || 'N/A'}
        </span>
      ),
    },
    {
      header: 'Submitted',
      accessor: 'submittedAt',
      render: (row) => (
        <span className="text-sm text-gray-500">
          {new Date(row.submittedAt || row.createdAt).toLocaleDateString()}
        </span>
      ),
    },
    {
      header: 'Actions',
      accessor: 'actions',
      render: (row) => (
        <div className="flex space-x-2">
          <Button variant="success" size="sm" onClick={() => handleApprove(row._id)}>
            Approve
          </Button>
          <Button variant="danger" size="sm" onClick={() => handleDeny(row._id)}>
            Deny
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Teacher Management</h1>
          <p className="mt-1 text-sm text-gray-600">Manage teacher accounts and approvals</p>
        </div>
        <div className="flex space-x-3">
          {pendingTeachers.length > 0 && (
            <Button variant="warning" onClick={() => setPendingModalOpen(true)}>
              Pending Approvals ({pendingTeachers.length})
            </Button>
          )}
          <Button
            variant="primary"
            onClick={() => setCreateModalOpen(true)}
            icon={
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
            }
          >
            Create Teacher
          </Button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">All Teachers</h2>
        </div>
        <div className="p-6">
          <Table columns={teacherColumns} data={teachers} loading={loading} emptyMessage="No teachers found" />
        </div>
      </div>

      {/* Create/Edit Teacher Modal */}
      <Modal
        isOpen={createModalOpen || editModalOpen}
        onClose={() => {
          setCreateModalOpen(false);
          setEditModalOpen(false);
          setSelectedTeacher(null);
          resetForm();
        }}
        title={editModalOpen ? 'Edit Teacher' : 'Create New Teacher'}
        size="lg"
      >
        <form onSubmit={editModalOpen ? handleUpdateTeacher : handleCreateTeacher}>
          <div className="grid grid-cols-2 gap-4">
            <Input label="First Name" name="firstName" value={formData.firstName} onChange={handleInputChange} required />
            <Input label="Last Name" name="lastName" value={formData.lastName} onChange={handleInputChange} required />
            <Input label="Email" name="email" type="email" value={formData.email} onChange={handleInputChange} required disabled={editModalOpen} className="col-span-2" />
            {!editModalOpen && (
              <Input label="Password" name="password" type="password" value={formData.password} onChange={handleInputChange} required className="col-span-2" />
            )}
            <Input label="Employee ID" name="employeeId" value={formData.employeeId} onChange={handleInputChange} />
            <Input label="Phone Number" name="phoneNumber" value={formData.phoneNumber} onChange={handleInputChange} />
            <Input label="Date of Birth" name="dateOfBirth" type="date" value={formData.dateOfBirth} onChange={handleInputChange} />
            <Select
              label="Gender"
              name="gender"
              value={formData.gender}
              onChange={handleInputChange}
              options={[
                { value: 'male', label: 'Male' },
                { value: 'female', label: 'Female' },
                { value: 'other', label: 'Other' },
              ]}
            />
            <Select
              label="Department"
              name="department"
              value={formData.department}
              onChange={handleInputChange}
              options={departments.map(dept => ({ value: dept._id, label: dept.name }))}
              className="col-span-2"
            />
            <Input label="Qualification" name="qualification" value={formData.qualification} onChange={handleInputChange} className="col-span-2" />
          </div>
          <div className="mt-6 flex justify-end space-x-3">
            <Button
              type="button"
              variant="secondary"
              onClick={() => {
                setCreateModalOpen(false);
                setEditModalOpen(false);
                setSelectedTeacher(null);
                resetForm();
              }}
            >
              Cancel
            </Button>
            <Button type="submit" variant="primary">
              {editModalOpen ? 'Update' : 'Create'} Teacher
            </Button>
          </div>
        </form>
      </Modal>

      {/* Pending Teachers Modal */}
      <Modal isOpen={pendingModalOpen} onClose={() => setPendingModalOpen(false)} title="Pending Teacher Approvals" size="xl">
        <Table columns={pendingColumns} data={pendingTeachers} emptyMessage="No pending teacher approvals" />
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal isOpen={deleteModalOpen} onClose={() => { setDeleteModalOpen(false); setSelectedTeacher(null); }} title="Delete Teacher" size="sm">
        <p className="text-gray-600 mb-6">
          Are you sure you want to delete <strong>{selectedTeacher?.firstName} {selectedTeacher?.lastName}</strong>? This action cannot be undone.
        </p>
        <div className="flex justify-end space-x-3">
          <Button variant="secondary" onClick={() => { setDeleteModalOpen(false); setSelectedTeacher(null); }}>Cancel</Button>
          <Button variant="danger" onClick={handleDelete}>Delete</Button>
        </div>
      </Modal>
    </div>
  );
};

export default TeacherManagement;
