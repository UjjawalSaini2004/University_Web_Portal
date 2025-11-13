import React, { useState, useEffect } from 'react';
import Table from '../common/Table';
import Modal from '../common/Modal';
import Button from '../common/Button';
import { Input, Select } from '../common/Input';
import Badge from '../common/Badge';
import superAdminService from '../../services/superAdminService';
import { toast } from 'react-toastify';

const AdminManagement = () => {
  const [admins, setAdmins] = useState([]);
  const [pendingAdmins, setPendingAdmins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [pendingModalOpen, setPendingModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedAdmin, setSelectedAdmin] = useState(null);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    firstName: '',
    lastName: '',
    phoneNumber: '',
    dateOfBirth: '',
    gender: '',
  });

  useEffect(() => {
    fetchAdmins();
    fetchPendingAdmins();
  }, []);

  const fetchAdmins = async () => {
    try {
      setLoading(true);
      const response = await superAdminService.getAllUsers({ role: 'admin' });
      if (response.success) {
        setAdmins(response.data);
      }
    } catch (error) {
      toast.error('Error fetching admins');
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchPendingAdmins = async () => {
    try {
      const response = await superAdminService.getPendingAdmins();
      if (response.success) {
        setPendingAdmins(response.data);
      }
    } catch (error) {
      console.error('Error fetching pending admins:', error);
    }
  };

  const handleCreateAdmin = async (e) => {
    e.preventDefault();
    try {
      const response = await superAdminService.createAdmin(formData);
      if (response.success) {
        toast.success('Admin created successfully');
        setCreateModalOpen(false);
        resetForm();
        fetchAdmins();
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error creating admin');
    }
  };

  const handleApprove = async (adminId) => {
    try {
      const response = await superAdminService.approveAdmin(adminId);
      if (response.success) {
        toast.success('Admin approved successfully');
        fetchPendingAdmins();
        fetchAdmins();
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error approving admin');
    }
  };

  const handleDeny = async (adminId, reason) => {
    try {
      const response = await superAdminService.denyAdmin(adminId, reason);
      if (response.success) {
        toast.success('Admin denied successfully');
        fetchPendingAdmins();
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error denying admin');
    }
  };

  const handleDelete = async () => {
    if (!selectedAdmin) return;
    try {
      const response = await superAdminService.deleteUser(selectedAdmin._id);
      if (response.success) {
        toast.success('Admin deleted successfully');
        setDeleteModalOpen(false);
        setSelectedAdmin(null);
        fetchAdmins();
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error deleting admin');
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
    });
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const adminColumns = [
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
      header: 'Verified',
      accessor: 'isVerified',
      render: (row) => (
        <Badge variant={row.isVerified ? 'success' : 'warning'}>
          {row.isVerified ? 'Yes' : 'No'}
        </Badge>
      ),
    },
    {
      header: 'Actions',
      accessor: 'actions',
      render: (row) => (
        <div className="flex space-x-2">
          <button
            onClick={() => {
              setSelectedAdmin(row);
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
      header: 'Phone',
      accessor: 'phoneNumber',
      cellClassName: 'text-gray-600',
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
          <Button
            variant="success"
            size="sm"
            onClick={() => handleApprove(row._id)}
          >
            Approve
          </Button>
          <Button
            variant="danger"
            size="sm"
            onClick={() => handleDeny(row._id, 'Admin approval denied')}
          >
            Deny
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Admin Management</h1>
          <p className="mt-1 text-sm text-gray-600">
            Manage administrator accounts and approvals
          </p>
        </div>
        <div className="flex space-x-3">
          {pendingAdmins.length > 0 && (
            <Button
              variant="warning"
              onClick={() => setPendingModalOpen(true)}
            >
              Pending Approvals ({pendingAdmins.length})
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
            Create Admin
          </Button>
        </div>
      </div>

      {/* Admins Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">All Admins</h2>
        </div>
        <div className="p-6">
          <Table
            columns={adminColumns}
            data={admins}
            loading={loading}
            emptyMessage="No admins found"
          />
        </div>
      </div>

      {/* Create Admin Modal */}
      <Modal
        isOpen={createModalOpen}
        onClose={() => {
          setCreateModalOpen(false);
          resetForm();
        }}
        title="Create New Admin"
        size="lg"
      >
        <form onSubmit={handleCreateAdmin}>
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
            <Input
              label="Email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleInputChange}
              required
              className="col-span-2"
            />
            <Input
              label="Password"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleInputChange}
              required
              className="col-span-2"
            />
            <Input
              label="Phone Number"
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleInputChange}
            />
            <Input
              label="Date of Birth"
              name="dateOfBirth"
              type="date"
              value={formData.dateOfBirth}
              onChange={handleInputChange}
            />
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
              className="col-span-2"
            />
          </div>
          <div className="mt-6 flex justify-end space-x-3">
            <Button
              type="button"
              variant="secondary"
              onClick={() => {
                setCreateModalOpen(false);
                resetForm();
              }}
            >
              Cancel
            </Button>
            <Button type="submit" variant="primary">
              Create Admin
            </Button>
          </div>
        </form>
      </Modal>

      {/* Pending Admins Modal */}
      <Modal
        isOpen={pendingModalOpen}
        onClose={() => setPendingModalOpen(false)}
        title="Pending Admin Approvals"
        size="xl"
      >
        <Table
          columns={pendingColumns}
          data={pendingAdmins}
          emptyMessage="No pending admin approvals"
        />
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={deleteModalOpen}
        onClose={() => {
          setDeleteModalOpen(false);
          setSelectedAdmin(null);
        }}
        title="Delete Admin"
        size="sm"
      >
        <p className="text-gray-600 mb-6">
          Are you sure you want to delete <strong>{selectedAdmin?.firstName} {selectedAdmin?.lastName}</strong>? This action cannot be undone.
        </p>
        <div className="flex justify-end space-x-3">
          <Button
            variant="secondary"
            onClick={() => {
              setDeleteModalOpen(false);
              setSelectedAdmin(null);
            }}
          >
            Cancel
          </Button>
          <Button variant="danger" onClick={handleDelete}>
            Delete
          </Button>
        </div>
      </Modal>
    </div>
  );
};

export default AdminManagement;
