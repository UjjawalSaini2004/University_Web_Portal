import React, { useState, useEffect } from 'react';
import { FiUser, FiMail, FiClock, FiCheck, FiX } from 'react-icons/fi';
import superAdminService from '../../../services/superAdminService';
import Badge from '../../common/Badge';

const AdminApprovalCard = ({ stats, loading, onRefresh, activeCard, setActiveCard }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [pendingAdmins, setPendingAdmins] = useState([]);
  const [loadingData, setLoadingData] = useState(false);
  const [processing, setProcessing] = useState(null);

  // Sync with activeCard prop
  useEffect(() => {
    const shouldExpand = activeCard === 'admin-approvals';
    setIsExpanded(shouldExpand);
  }, [activeCard]);

  useEffect(() => {
    if (isExpanded) {
      fetchPendingAdmins();
    }
  }, [isExpanded]);

  const fetchPendingAdmins = async () => {
    try {
      setLoadingData(true);
      const response = await superAdminService.getPendingAdminRegistrations();
      
      if (response && response.success !== false) {
        const adminList = response.data || response;
        setPendingAdmins(Array.isArray(adminList) ? adminList : []);
      } else {
        setPendingAdmins([]);
      }
    } catch (error) {
      console.error('❌ Error fetching pending admins:', error);
      setPendingAdmins([]);
    } finally {
      setLoadingData(false);
    }
  };

  const handleApprove = async (adminId, adminEmail) => {
    const confirmed = window.confirm(
      `Are you sure you want to APPROVE this admin registration?\n\nEmail: ${adminEmail}\n\nThe user will be able to login immediately after approval.`
    );
    
    if (!confirmed) return;

    try {
      setProcessing(adminId);
      await superAdminService.approveAdminRegistration(adminId);
      
      // Refresh the list
      await fetchPendingAdmins();
      onRefresh();
      
      // Success notification
      showNotification('Admin approved successfully!', 'success');
    } catch (error) {
      console.error('❌ Error approving admin:', error);
      showNotification(error.response?.data?.message || 'Failed to approve admin', 'error');
    } finally {
      setProcessing(null);
    }
  };

  const handleReject = async (adminId, adminEmail) => {
    const confirmed = window.confirm(
      `⚠️ WARNING: Are you sure you want to REJECT this admin registration?\n\nEmail: ${adminEmail}\n\n⚠️ This action will PERMANENTLY DELETE the registration request and CANNOT BE UNDONE.\n\nClick OK to proceed with rejection.`
    );
    
    if (!confirmed) return;

    try {
      setProcessing(adminId);
      await superAdminService.rejectAdminRegistration(adminId);
      
      // Refresh the list
      await fetchPendingAdmins();
      onRefresh();
      
      // Success notification
      showNotification('Admin registration rejected', 'warning');
    } catch (error) {
      console.error('❌ Error rejecting admin:', error);
      showNotification(error.response?.data?.message || 'Failed to reject admin', 'error');
    } finally {
      setProcessing(null);
    }
  };

  const showNotification = (message, type) => {
    const colors = {
      success: 'bg-green-500',
      error: 'bg-red-500',
      warning: 'bg-orange-500'
    };
    
    const icons = {
      success: '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />',
      error: '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />',
      warning: '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />'
    };
    
    const notification = document.createElement('div');
    notification.className = `fixed top-4 right-4 ${colors[type]} text-white px-6 py-4 rounded-lg shadow-lg z-50 animate-fade-in`;
    notification.innerHTML = `
      <div class="flex items-center space-x-3">
        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          ${icons[type]}
        </svg>
        <span class="font-medium">${message}</span>
      </div>
    `;
    document.body.appendChild(notification);
    setTimeout(() => notification.remove(), 3000);
  };

  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden transition-all duration-300 hover:shadow-lg">
      {/* Card Header - Gradient */}
      <div 
        className="bg-gradient-to-r from-indigo-500 to-indigo-600 px-6 py-5 cursor-pointer"
        onClick={() => {
          const newState = !isExpanded;
          setIsExpanded(newState);
          setActiveCard(newState ? 'admin-approvals' : null);
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
              <h3 className="text-xl font-bold text-white">Admin Approvals</h3>
              <p className="text-sm text-indigo-100 mt-0.5">Review pending admin registrations</p>
            </div>
          </div>
          {/* Expand/Collapse Button - Circular */}
          <button
            className="w-10 h-10 bg-white bg-opacity-20 hover:bg-opacity-30 rounded-full flex items-center justify-center transition-all duration-300 flex-shrink-0"
            onClick={(e) => {
              e.stopPropagation();
              const newState = !isExpanded;
              setIsExpanded(newState);
              setActiveCard(newState ? 'admin-approvals' : null);
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
                <p className="text-sm text-gray-500 mt-0.5">Admin registration statistics</p>
              </div>
            </div>
            <div className="h-px bg-gradient-to-r from-indigo-200 via-indigo-300 to-transparent mb-4"></div>
            <div className="bg-indigo-50 rounded-lg p-4 border border-indigo-100">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-gray-500">Pending Approvals</p>
                  <p className="text-3xl font-bold text-indigo-600">{pendingAdmins.length}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Total Admins</p>
                  <p className="text-3xl font-bold text-gray-900">{stats?.users?.admins || 0}</p>
                </div>
              </div>
            </div>
          </div>

          {/* SECTION B - PENDING REGISTRATIONS */}
          <div>
            <div className="flex items-center mb-4">
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900">Pending Admin Registrations</h3>
                <p className="text-sm text-gray-500 mt-0.5">Review and approve admin access requests</p>
              </div>
              <Badge variant={pendingAdmins.length > 0 ? 'warning' : 'success'}>
                {pendingAdmins.length} pending
              </Badge>
            </div>
            <div className="h-px bg-gradient-to-r from-indigo-200 via-indigo-300 to-transparent mb-4"></div>
            <div className="border border-gray-200 rounded-lg overflow-hidden">
              <div className="max-h-96 overflow-y-auto">
                {loadingData ? (
                  <div className="p-8 text-center text-gray-500">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
                    <p className="mt-4">Loading pending registrations...</p>
                  </div>
                ) : pendingAdmins.length === 0 ? (
                  <div className="p-12 text-center">
                    <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 mb-4">
                      <FiCheck className="h-8 w-8 text-green-600" />
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No Pending Requests</h3>
                    <p className="text-gray-600">There are no admin registration requests pending approval.</p>
                  </div>
                ) : (
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50 sticky top-0">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Requested On</th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {pendingAdmins.map((admin) => (
                        <tr key={admin._id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center space-x-2">
                              <FiUser className="text-gray-400" />
                              <span className="text-sm font-medium text-gray-900">
                                {admin.firstName} {admin.lastName}
                              </span>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center space-x-2">
                              <FiMail className="text-gray-400" />
                              <span className="text-sm text-gray-700">{admin.email}</span>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center space-x-2">
                              <FiClock className="text-gray-400" />
                              <span className="text-sm text-gray-700">
                                {new Date(admin.createdAt).toLocaleString('en-US', {
                                  year: 'numeric',
                                  month: 'short',
                                  day: 'numeric',
                                  hour: '2-digit',
                                  minute: '2-digit',
                                })}
                              </span>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <div className="flex justify-end space-x-2">
                              <button
                                onClick={() => handleApprove(admin._id, admin.email)}
                                disabled={processing === admin._id}
                                className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-sm hover:shadow-md transform hover:-translate-y-0.5"
                                title="Approve this admin registration"
                              >
                                {processing === admin._id ? (
                                  <>
                                    <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    <span>Processing...</span>
                                  </>
                                ) : (
                                  <>
                                    <FiCheck size={18} />
                                    <span>Approve</span>
                                  </>
                                )}
                              </button>
                              <button
                                onClick={() => handleReject(admin._id, admin.email)}
                                disabled={processing === admin._id}
                                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-sm hover:shadow-md transform hover:-translate-y-0.5"
                                title="Reject and delete this admin registration"
                              >
                                {processing === admin._id ? (
                                  <>
                                    <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    <span>Processing...</span>
                                  </>
                                ) : (
                                  <>
                                    <FiX size={18} />
                                    <span>Reject</span>
                                  </>
                                )}
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

          </div>
        </div>
      </div>
      )}
    </div>
  );
};

export default AdminApprovalCard;
