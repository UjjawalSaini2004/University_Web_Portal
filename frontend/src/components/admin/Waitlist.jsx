import React, { useState, useEffect } from 'react';
import Layout from '../common/Layout';
import adminService from '../../services/adminService';
import { toast } from 'react-toastify';
import { FiUsers, FiClock, FiCheck, FiX, FiTrash2, FiUserCheck, FiUserX, FiFilter } from 'react-icons/fi';

const Waitlist = () => {
  const [waitlistUsers, setWaitlistUsers] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [filterRole, setFilterRole] = useState('all');
  const [filterStatus, setFilterStatus] = useState('pending');
  const [processingId, setProcessingId] = useState(null);

  useEffect(() => {
    fetchData();
  }, [filterRole, filterStatus]);

  const fetchData = async () => {
    try {
      setLoading(true);
      
      // Fetch waitlist users
      const params = {};
      if (filterRole !== 'all') params.role = filterRole;
      if (filterStatus !== 'all') params.status = filterStatus;
      
      const response = await adminService.getWaitlistUsers(params);
      setWaitlistUsers(response.data?.data || []);
      
      // Fetch stats
      const statsResponse = await adminService.getWaitlistStats();
      setStats(statsResponse.data?.data || null);
    } catch (error) {
      console.error('Error fetching waitlist data:', error);
      toast.error('Failed to load waitlist data');
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (userId) => {
    if (!window.confirm('Are you sure you want to approve this user? They will be able to log in.')) {
      return;
    }

    try {
      setProcessingId(userId);
      await adminService.approveWaitlistUser(userId);
      toast.success('User approved successfully!');
      fetchData();
    } catch (error) {
      console.error('Error approving user:', error);
      toast.error(error.response?.data?.message || 'Failed to approve user');
    } finally {
      setProcessingId(null);
    }
  };

  const handleDeny = async (userId) => {
    const reason = window.prompt('Enter reason for denial (optional):');
    if (reason === null) return; // User cancelled

    try {
      setProcessingId(userId);
      await adminService.denyWaitlistUser(userId, { reason });
      toast.success('User application denied');
      fetchData();
    } catch (error) {
      console.error('Error denying user:', error);
      toast.error('Failed to deny user');
    } finally {
      setProcessingId(null);
    }
  };

  const handleDelete = async (userId) => {
    if (!window.confirm('Are you sure you want to permanently delete this user from the waitlist?')) {
      return;
    }

    try {
      setProcessingId(userId);
      await adminService.deleteWaitlistUser(userId);
      toast.success('User deleted from waitlist');
      fetchData();
    } catch (error) {
      console.error('Error deleting user:', error);
      toast.error('Failed to delete user');
    } finally {
      setProcessingId(null);
    }
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading waitlist...</p>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900">Pending Approvals</h1>
        </div>

        {/* Statistics Cards */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="card bg-gradient-to-br from-yellow-50 to-yellow-100 border-yellow-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-yellow-600 font-semibold">Pending Students</p>
                  <p className="text-3xl font-bold text-yellow-700">{stats.pending.students}</p>
                </div>
                <FiClock className="h-12 w-12 text-yellow-400" />
              </div>
            </div>

            <div className="card bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-blue-600 font-semibold">Pending Faculty</p>
                  <p className="text-3xl font-bold text-blue-700">{stats.pending.faculty}</p>
                </div>
                <FiUserCheck className="h-12 w-12 text-blue-400" />
              </div>
            </div>

            <div className="card bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-purple-600 font-semibold">Total Pending</p>
                  <p className="text-3xl font-bold text-purple-700">{stats.pending.total}</p>
                </div>
                <FiUsers className="h-12 w-12 text-purple-400" />
              </div>
            </div>

            <div className="card bg-gradient-to-br from-red-50 to-red-100 border-red-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-red-600 font-semibold">Total Denied</p>
                  <p className="text-3xl font-bold text-red-700">{stats.denied.total}</p>
                </div>
                <FiUserX className="h-12 w-12 text-red-400" />
              </div>
            </div>
          </div>
        )}

        {/* Filters */}
        <div className="card">
          <div className="flex items-center gap-4">
            <FiFilter className="h-5 w-5 text-gray-400" />
            <div className="flex gap-4">
              <div>
                <label className="text-sm font-medium text-gray-700 mr-2">Role:</label>
                <select
                  value={filterRole}
                  onChange={(e) => setFilterRole(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                >
                  <option value="all">All Roles</option>
                  <option value="student">Students</option>
                  <option value="faculty">Faculty</option>
                </select>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700 mr-2">Status:</label>
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                >
                  <option value="pending">Pending</option>
                  <option value="denied">Denied</option>
                  <option value="all">All Status</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Waitlist Table */}
        <div className="card overflow-hidden">
          {waitlistUsers.length === 0 ? (
            <div className="text-center py-12">
              <FiUsers className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 text-lg">No users in waitlist</p>
              <p className="text-gray-400 text-sm mt-2">All applications have been processed</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      User Details
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Role
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Department
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Details
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Submitted
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
                  {waitlistUsers.map((user) => (
                    <tr key={user._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {user.firstName} {user.lastName}
                          </div>
                          <div className="text-sm text-gray-500">{user.email}</div>
                          <div className="text-sm text-gray-500">{user.phoneNumber}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          user.role === 'student' 
                            ? 'bg-blue-100 text-blue-800' 
                            : 'bg-purple-100 text-purple-800'
                        }`}>
                          {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {user.department?.name || 'N/A'}
                        <div className="text-xs text-gray-500">{user.department?.code}</div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">
                        {user.role === 'student' ? (
                          <div>
                            <div>Semester: {user.semester}</div>
                            <div className="text-xs text-gray-500">Admission Year: {user.admissionYear}</div>
                          </div>
                        ) : (
                          <div>
                            <div>{user.designation}</div>
                            <div className="text-xs text-gray-500">{user.qualification}</div>
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatDate(user.submittedAt)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          user.status === 'pending' 
                            ? 'bg-yellow-100 text-yellow-800' 
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {user.status.charAt(0).toUpperCase() + user.status.slice(1)}
                        </span>
                        {user.status === 'denied' && user.deniedReason && (
                          <div className="text-xs text-gray-500 mt-1">{user.deniedReason}</div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex justify-end gap-2">
                          {user.status === 'pending' && (
                            <>
                              <button
                                onClick={() => handleApprove(user._id)}
                                disabled={processingId === user._id}
                                className="text-green-600 hover:text-green-900 disabled:opacity-50"
                                title="Approve"
                              >
                                <FiCheck className="h-5 w-5" />
                              </button>
                              <button
                                onClick={() => handleDeny(user._id)}
                                disabled={processingId === user._id}
                                className="text-red-600 hover:text-red-900 disabled:opacity-50"
                                title="Deny"
                              >
                                <FiX className="h-5 w-5" />
                              </button>
                            </>
                          )}
                          <button
                            onClick={() => handleDelete(user._id)}
                            disabled={processingId === user._id}
                            className="text-gray-600 hover:text-gray-900 disabled:opacity-50"
                            title="Delete"
                          >
                            <FiTrash2 className="h-5 w-5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default Waitlist;
