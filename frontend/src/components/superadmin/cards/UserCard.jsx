import React, { useState, useEffect } from 'react';
import superAdminService from '../../../services/superAdminService';
import Badge from '../../common/Badge';

const UserCard = ({ stats, loading, onRefresh, activeCard, setActiveCard }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [users, setUsers] = useState([]);
  const [loadingData, setLoadingData] = useState(false);
  const [filterRole, setFilterRole] = useState('all');

  // Sync with activeCard prop
  useEffect(() => {
    const shouldExpand = activeCard === 'users';
    setIsExpanded(shouldExpand);
  }, [activeCard]);

  useEffect(() => {
    if (isExpanded) {
      fetchUserData();
    }
  }, [isExpanded, filterRole]);

  const fetchUserData = async () => {
    try {
      setLoadingData(true);
      const params = filterRole !== 'all' ? { role: filterRole, page: 1, limit: 30 } : { page: 1, limit: 30 };
      const result = await superAdminService.getAllUsers(params);
      if (result.success) {
        setUsers(result.data.users || result.data || []);
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
    } finally {
      setLoadingData(false);
    }
  };

  const handleDelete = async (userId) => {
    if (!window.confirm('Are you sure you want to delete this user?')) return;

    try {
      const result = await superAdminService.deleteUser(userId);
      if (result.success) {
        fetchUserData();
        onRefresh();
        alert('User deleted successfully');
      }
    } catch (error) {
      console.error('Error deleting user:', error);
      alert('Failed to delete user');
    }
  };

  const handleRoleChange = async (userId, newRole) => {
    if (!window.confirm(`Change user role to ${newRole}?`)) return;

    try {
      const result = await superAdminService.updateUserRole(userId, newRole);
      if (result.success) {
        fetchUserData();
        onRefresh();
        alert('User role updated successfully');
      }
    } catch (error) {
      console.error('Error updating user role:', error);
      alert('Failed to update user role');
    }
  };

  const getRoleBadgeVariant = (role) => {
    switch (role) {
      case 'super_admin': return 'danger';
      case 'admin': return 'warning';
      case 'teacher': return 'success';
      case 'student': return 'info';
      default: return 'secondary';
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden transition-all duration-300 hover:shadow-lg">
      {/* Card Header - Gradient */}
      <div 
        className="bg-gradient-to-r from-gray-600 to-gray-700 px-6 py-5 cursor-pointer"
        onClick={() => {
          const newState = !isExpanded;
          setIsExpanded(newState);
          setActiveCard(newState ? 'users' : null);
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
              <h3 className="text-xl font-bold text-white">All Users</h3>
              <p className="text-sm text-gray-300 mt-0.5">View all system users</p>
            </div>
          </div>
          {/* Expand/Collapse Button - Circular */}
          <button
            className="w-10 h-10 bg-white bg-opacity-20 hover:bg-opacity-30 rounded-full flex items-center justify-center transition-all duration-300 flex-shrink-0"
            onClick={(e) => {
              e.stopPropagation();
              const newState = !isExpanded;
              setIsExpanded(newState);
              setActiveCard(newState ? 'users' : null);
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
                <p className="text-sm text-gray-500 mt-0.5">System-wide user statistics</p>
              </div>
            </div>
            <div className="h-px bg-gradient-to-r from-gray-300 via-gray-400 to-transparent mb-4"></div>
            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
            <h4 className="text-sm font-medium text-gray-600 mb-3">Overview</h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <p className="text-xs text-gray-500">Total Users</p>
                <p className="text-2xl font-bold text-gray-900">{stats?.users?.total || 0}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Students</p>
                <p className="text-2xl font-bold text-blue-600">{stats?.users?.students || 0}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Teachers</p>
                <p className="text-2xl font-bold text-green-600">{stats?.users?.teachers || 0}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Admins</p>
                <p className="text-2xl font-bold text-indigo-600">{stats?.users?.admins || 0}</p>
              </div>
            </div>
            </div>
          </div>

          {/* SECTION B - FILTER & MAIN LIST */}
          <div className="flex items-center space-x-3">
            <label className="text-sm font-medium text-gray-600">Filter by Role:</label>
            <select
              value={filterRole}
              onChange={(e) => setFilterRole(e.target.value)}
              className="px-3 py-1 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-500"
            >
              <option value="all">All Users</option>
              <option value="student">Students</option>
              <option value="teacher">Teachers</option>
              <option value="admin">Admins</option>
              <option value="super_admin">Super Admins</option>
            </select>
          </div>

          {/* User List Table */}
          <div>
            <div className="border border-gray-200 rounded-lg overflow-hidden">
              <div className="max-h-96 overflow-y-auto">
                {loadingData ? (
                  <div className="p-8 text-center text-gray-500">Loading users...</div>
                ) : users.length === 0 ? (
                  <div className="p-8 text-center text-gray-500">No users found</div>
                ) : (
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50 sticky top-0">
                      <tr>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Role</th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {users.map((user) => (
                        <tr key={user._id} className="hover:bg-gray-50">
                          <td className="px-4 py-3 text-sm font-medium text-gray-900">
                            {user.firstName} {user.lastName}
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-600">{user.email}</td>
                          <td className="px-4 py-3">
                            <Badge variant={getRoleBadgeVariant(user.role)}>
                              {user.role.replace('_', ' ').toUpperCase()}
                            </Badge>
                          </td>
                          <td className="px-4 py-3">
                            <Badge variant={user.isActive ? 'success' : 'danger'}>
                              {user.isActive ? 'Active' : 'Inactive'}
                            </Badge>
                          </td>
                          <td className="px-4 py-3">
                            <div className="flex items-center space-x-2">
                              <select
                                onChange={(e) => handleRoleChange(user._id, e.target.value)}
                                className="text-xs border border-gray-300 rounded px-2 py-1"
                                defaultValue=""
                              >
                                <option value="" disabled>Change Role</option>
                                <option value="student">Student</option>
                                <option value="teacher">Teacher</option>
                                <option value="admin">Admin</option>
                              </select>
                              <button
                                onClick={() => handleDelete(user._id)}
                                className="text-red-600 hover:text-red-800 text-xs font-medium"
                                disabled={user.role === 'super_admin'}
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

          {/* Info Section */}
          <div className="bg-blue-50 border-l-4 border-blue-400 p-4 rounded">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-blue-700">
                  This section displays all registered users in the system. Use the filters to view specific user types. 
                  Super Admin accounts cannot be deleted.
                </p>
              </div>
            </div>
          </div>

          </div>
        </div>
      </div>
      )}
    </div>
  );
};

export default UserCard;
