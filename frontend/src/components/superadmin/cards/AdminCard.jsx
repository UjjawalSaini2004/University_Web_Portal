import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import superAdminService from '../../../services/superAdminService';
import Badge from '../../common/Badge';
import Modal from '../../common/Modal';
import Input from '../../common/Input';
import Button from '../../common/Button';

const AdminCard = ({ stats, loading, onRefresh, activeCard, setActiveCard }) => {
  const navigate = useNavigate();
  const [isExpanded, setIsExpanded] = useState(false);
  const [admins, setAdmins] = useState([]);
  const [pendingAdmins, setPendingAdmins] = useState([]);
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
    address: '',
    department: ''
  });
  const [submitting, setSubmitting] = useState(false);

  // Sync with activeCard prop
  useEffect(() => {
    const shouldExpand = activeCard === 'admins';
    setIsExpanded(shouldExpand);
  }, [activeCard]);

  useEffect(() => {
    if (isExpanded) {
      fetchAdminData();
    }
  }, [isExpanded]);

  const fetchAdminData = async () => {
    try {
      setLoadingData(true);
      const [adminsRes, pendingRes] = await Promise.all([
        superAdminService.getAllUsers({ role: 'admin', page: 1, limit: 20 }),
        superAdminService.getPendingAdmins()
      ]);

      if (adminsRes.success) {
        setAdmins(adminsRes.data.users || adminsRes.data || []);
      }
      if (pendingRes.success) {
        setPendingAdmins(pendingRes.data || []);
      }
    } catch (error) {
      console.error('Error fetching admin data:', error);
    } finally {
      setLoadingData(false);
    }
  };

  const handleApprove = async (adminId) => {
    try {
      const result = await superAdminService.approveAdmin(adminId);
      if (result.success) {
        fetchAdminData();
        onRefresh();
        alert('Admin approved successfully!');
      }
    } catch (error) {
      console.error('Error approving admin:', error);
      alert('Failed to approve admin');
    }
  };

  const handleDeny = async (adminId) => {
    const reason = prompt('Enter reason for denial:');
    if (!reason) return;

    try {
      const result = await superAdminService.denyAdmin(adminId, reason);
      if (result.success) {
        fetchAdminData();
        onRefresh();
        alert('Admin denied successfully!');
      }
    } catch (error) {
      console.error('Error denying admin:', error);
      alert('Failed to deny admin');
    }
  };

  const handleDelete = async (adminId) => {
    if (!window.confirm('Are you sure you want to permanently delete this admin? This action cannot be undone.')) {
      return;
    }

    try {
      const result = await superAdminService.deleteAdmin(adminId);
      if (result.success) {
        fetchAdminData();
        onRefresh();
        alert('Admin deleted successfully!');
      }
    } catch (error) {
      console.error('Error deleting admin:', error);
      alert('Failed to delete admin: ' + (error.response?.data?.message || error.message));
    }
  };

  const handleDeactivate = async (adminId) => {
    if (!window.confirm('Are you sure you want to deactivate this admin account? They will not be able to login until reactivated.')) {
      return;
    }

    try {
      const result = await superAdminService.deactivateAdmin(adminId);
      if (result.success) {
        fetchAdminData();
        onRefresh();
        alert('Admin deactivated successfully!');
      }
    } catch (error) {
      console.error('Error deactivating admin:', error);
      alert('Failed to deactivate admin: ' + (error.response?.data?.message || error.message));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      const result = await superAdminService.createAdmin(formData);
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
          address: '',
          department: ''
        });
        fetchAdminData();
        onRefresh();
        alert('Admin created successfully!');
      }
    } catch (error) {
      console.error('Error creating admin:', error);
      alert('Failed to create admin');
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
        className="bg-gradient-to-r from-indigo-500 to-indigo-600 px-6 py-5 cursor-pointer"
        onClick={() => {
          const newState = !isExpanded;
          setIsExpanded(newState);
          setActiveCard(newState ? 'admins' : null);
        }}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            {/* Icon */}
            <div className="w-12 h-12 bg-white bg-opacity-20 rounded-lg flex items-center justify-center flex-shrink-0">
              <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            {/* Title */}
            <div>
              <h3 className="text-xl font-bold text-white">Admins</h3>
              <p className="text-sm text-indigo-100 mt-0.5">Manage administrators</p>
            </div>
          </div>
          {/* Expand/Collapse Button - Circular */}
          <button
            className="w-10 h-10 bg-white bg-opacity-20 hover:bg-opacity-30 rounded-full flex items-center justify-center transition-all duration-300 flex-shrink-0"
            onClick={(e) => {
              e.stopPropagation();
              const newState = !isExpanded;
              setIsExpanded(newState);
              setActiveCard(newState ? 'admins' : null);
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
      <div className="transition-all duration-500 ease-in-out">
        <div className="bg-gray-50 p-6">
          <div className="bg-white rounded-lg shadow-sm p-6 space-y-8">
          
          {/* SECTION A - OVERVIEW */}
          <div>
            <div className="flex items-center mb-4">
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900">Overview</h3>
                <p className="text-sm text-gray-500 mt-0.5">Administrator statistics at a glance</p>
              </div>
            </div>
            <div className="h-px bg-gradient-to-r from-indigo-200 via-indigo-300 to-transparent mb-4"></div>
            <div className="bg-indigo-50 rounded-lg p-4 border border-indigo-100">
              <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-gray-500">Total Admins</p>
                <p className="text-3xl font-bold text-gray-900">{stats?.users?.admins || 0}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Pending Approvals</p>
                <p className="text-3xl font-bold text-yellow-600">{stats?.waitlist?.admins || 0}</p>
              </div>
            </div>
            </div>
          </div>

          {/* SECTION B - MAIN LIST / TABLE */}
          <div>
            <div className="flex items-center mb-4">
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900">All Administrators</h3>
                <p className="text-sm text-gray-500 mt-0.5">Complete list of admin accounts</p>
              </div>
              <Badge variant="info">{admins.length} total</Badge>
            </div>
            <div className="h-px bg-gradient-to-r from-indigo-200 via-indigo-300 to-transparent mb-4"></div>
            <div className="border border-gray-200 rounded-lg overflow-hidden">
              <div className="max-h-64 overflow-y-auto">
                {loadingData ? (
                  <div className="p-8 text-center text-gray-500">Loading admins...</div>
                ) : admins.length === 0 ? (
                  <div className="p-8 text-center text-gray-500">No admins found</div>
                ) : (
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50 sticky top-0">
                      <tr>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Department</th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                        <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {admins.map((admin) => (
                        <tr key={admin._id} className="hover:bg-gray-50">
                          <td className="px-4 py-3 text-sm font-medium text-gray-900">
                            {admin.firstName} {admin.lastName}
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-600">{admin.email}</td>
                          <td className="px-4 py-3 text-sm text-gray-600">{admin.department?.name || 'N/A'}</td>
                          <td className="px-4 py-3">
                            <Badge variant={admin.adminStatus === 'deactivated' ? 'danger' : admin.isActive ? 'success' : 'danger'}>
                              {admin.adminStatus === 'deactivated' ? 'Deactivated' : admin.isActive ? 'Active' : 'Inactive'}
                            </Badge>
                          </td>
                          <td className="px-4 py-3 text-right">
                            <div className="flex items-center justify-end space-x-2">
                              <button
                                onClick={() => navigate(`/superadmin/admins/${admin._id}`)}
                                className="text-indigo-600 hover:text-indigo-800 font-medium text-xs"
                                title="View details"
                              >
                                View
                              </button>
                              {admin.adminStatus !== 'deactivated' && (
                                <>
                                  <span className="text-gray-300">|</span>
                                  <button
                                    onClick={() => handleDeactivate(admin._id)}
                                    className="text-orange-600 hover:text-orange-800 font-medium text-xs"
                                    title="Deactivate admin"
                                  >
                                    Deactivate
                                  </button>
                                </>
                              )}
                              <span className="text-gray-300">|</span>
                              <button
                                onClick={() => handleDelete(admin._id)}
                                className="text-red-600 hover:text-red-800 font-medium text-xs"
                                title="Delete admin"
                              >
                                Delete
                              </button>
                            </div>
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
                <p className="text-sm text-gray-500 mt-0.5">Administrators awaiting verification</p>
              </div>
              <Badge variant="warning">{pendingAdmins.length} pending</Badge>
            </div>
            <div className="h-px bg-gradient-to-r from-yellow-200 via-yellow-300 to-transparent mb-4"></div>
            <div className="space-y-3">
              {loadingData ? (
                <div className="p-4 text-center text-gray-500 text-sm">Loading pending admins...</div>
              ) : pendingAdmins.length === 0 ? (
                <div className="p-4 text-center text-gray-500 text-sm bg-gray-50 rounded-lg">
                  No pending admin approvals
                </div>
              ) : (
                pendingAdmins.map((admin) => (
                  <div key={admin._id} className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900">
                          {admin.firstName} {admin.lastName}
                        </p>
                        <p className="text-xs text-gray-600">{admin.email}</p>
                        <p className="text-xs text-gray-500 mt-1">
                          Department: {admin.department || 'Not assigned'}
                        </p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => navigate(`/superadmin/admins/pending/${admin._id}`)}
                          className="px-3 py-1 bg-indigo-600 text-white text-xs font-medium rounded hover:bg-indigo-700 transition-colors"
                        >
                          View
                        </button>
                        <button
                          onClick={() => handleApprove(admin._id)}
                          className="px-3 py-1 bg-green-600 text-white text-xs font-medium rounded hover:bg-green-700 transition-colors"
                        >
                          Approve
                        </button>
                        <button
                          onClick={() => handleDeny(admin._id)}
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

          {/* SECTION D - ADD NEW ADMIN */}
          <div>
            <div className="flex items-center mb-4">
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900">Add New Administrator</h3>
                <p className="text-sm text-gray-500 mt-0.5">Create a new admin account</p>
              </div>
            </div>
            <div className="h-px bg-gradient-to-r from-indigo-200 via-indigo-300 to-transparent mb-4"></div>
            <Button
              onClick={() => setShowAddModal(true)}
              variant="primary"
              className="w-full"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              Add New Admin
            </Button>
          </div>
        </div>
      </div>
      </div>
      )}

      {/* Add Admin Modal */}
      <Modal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        title="Add New Admin"
        size="lg"
      >
        <form onSubmit={handleSubmit} className="space-y-4" autoComplete="off">
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="First Name"
              name="firstName"
              value={formData.firstName}
              onChange={handleInputChange}
              autoComplete="off"
              required
            />
            <Input
              label="Last Name"
              name="lastName"
              value={formData.lastName}
              onChange={handleInputChange}
              autoComplete="off"
              required
            />
          </div>
          <Input
            label="Email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleInputChange}
            autoComplete="new-email"
            required
          />
          <Input
            label="Password"
            name="password"
            type="password"
            value={formData.password}
            onChange={handleInputChange}
            autoComplete="new-password"
            minLength={6}
            helperText="Minimum 6 characters"
            required
          />
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Phone Number"
              name="phoneNumber"
              type="tel"
              value={formData.phoneNumber}
              onChange={handleInputChange}
              autoComplete="off"
              maxLength={10}
              pattern="[0-9]{10}"
              helperText="10 digits required"
              required
            />
            <Input
              label="Date of Birth"
              name="dateOfBirth"
              type="date"
              value={formData.dateOfBirth}
              onChange={handleInputChange}
              autoComplete="off"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Gender <span className="text-red-500">*</span>
            </label>
            <select
              name="gender"
              value={formData.gender}
              onChange={handleInputChange}
              autoComplete="off"
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="">Select Gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
          </div>
          <Input
            label="Address"
            name="address"
            value={formData.address}
            onChange={handleInputChange}
            autoComplete="off"
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
              variant="primary"
              loading={submitting}
            >
              Create Admin
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default AdminCard;
