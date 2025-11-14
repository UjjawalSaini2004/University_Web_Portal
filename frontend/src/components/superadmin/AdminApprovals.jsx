import { useState, useEffect } from 'react';
import { FiCheck, FiX, FiClock, FiMail, FiUser } from 'react-icons/fi';
import Layout from '../common/Layout';
import Table from '../common/Table';
import superAdminService from '../../services/superAdminService';

const AdminApprovals = () => {
  const [pendingAdmins, setPendingAdmins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(null);

  useEffect(() => {
    fetchPendingAdmins();
  }, []);

  const fetchPendingAdmins = async () => {
    try {
      setLoading(true);
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
      setLoading(false);
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
      console.log('✅ Admin approved:', adminId);
      
      // Refresh the list
      await fetchPendingAdmins();
      
      // Success notification
      const notification = document.createElement('div');
      notification.className = 'fixed top-4 right-4 bg-green-500 text-white px-6 py-4 rounded-lg shadow-lg z-50 animate-fade-in';
      notification.innerHTML = `
        <div class="flex items-center space-x-3">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span class="font-medium">Admin approved successfully!</span>
        </div>
      `;
      document.body.appendChild(notification);
      setTimeout(() => notification.remove(), 3000);
    } catch (error) {
      console.error('❌ Error approving admin:', error);
      
      const errorNotification = document.createElement('div');
      errorNotification.className = 'fixed top-4 right-4 bg-red-500 text-white px-6 py-4 rounded-lg shadow-lg z-50';
      errorNotification.innerHTML = `
        <div class="flex items-center space-x-3">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span class="font-medium">${error.response?.data?.message || 'Failed to approve admin'}</span>
        </div>
      `;
      document.body.appendChild(errorNotification);
      setTimeout(() => errorNotification.remove(), 4000);
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
      console.log('✅ Admin rejected:', adminId);
      
      // Refresh the list
      await fetchPendingAdmins();
      
      // Success notification
      const notification = document.createElement('div');
      notification.className = 'fixed top-4 right-4 bg-orange-500 text-white px-6 py-4 rounded-lg shadow-lg z-50';
      notification.innerHTML = `
        <div class="flex items-center space-x-3">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <span class="font-medium">Admin registration rejected</span>
        </div>
      `;
      document.body.appendChild(notification);
      setTimeout(() => notification.remove(), 3000);
    } catch (error) {
      console.error('❌ Error rejecting admin:', error);
      
      const errorNotification = document.createElement('div');
      errorNotification.className = 'fixed top-4 right-4 bg-red-500 text-white px-6 py-4 rounded-lg shadow-lg z-50';
      errorNotification.innerHTML = `
        <div class="flex items-center space-x-3">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span class="font-medium">${error.response?.data?.message || 'Failed to reject admin'}</span>
        </div>
      `;
      document.body.appendChild(errorNotification);
      setTimeout(() => errorNotification.remove(), 4000);
    } finally {
      setProcessing(null);
    }
  };

  const columns = [
    {
      header: 'Name',
      render: (row) => (
        <div className="flex items-center space-x-2">
          <FiUser className="text-gray-400" />
          <span className="font-medium text-gray-900">
            {row.firstName} {row.lastName}
          </span>
        </div>
      ),
    },
    {
      header: 'Email',
      render: (row) => (
        <div className="flex items-center space-x-2">
          <FiMail className="text-gray-400" />
          <span className="text-gray-700">{row.email}</span>
        </div>
      ),
    },
    {
      header: 'Requested On',
      render: (row) => (
        <div className="flex items-center space-x-2">
          <FiClock className="text-gray-400" />
          <span className="text-gray-700">
            {new Date(row.createdAt).toLocaleString('en-US', {
              year: 'numeric',
              month: 'short',
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
            })}
          </span>
        </div>
      ),
    },
    {
      header: 'Actions',
      render: (row) => (
        <div className="flex space-x-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleApprove(row._id, row.email);
            }}
            disabled={processing === row._id}
            className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-sm hover:shadow-md transform hover:-translate-y-0.5"
            title="Approve this admin registration"
          >
            {processing === row._id ? (
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
            onClick={(e) => {
              e.stopPropagation();
              handleReject(row._id, row.email);
            }}
            disabled={processing === row._id}
            className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-sm hover:shadow-md transform hover:-translate-y-0.5"
            title="Reject and delete this admin registration"
          >
            {processing === row._id ? (
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
      ),
    },
  ];

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Admin Registration Approvals</h1>
            <p className="text-gray-600 mt-1">Review and approve pending admin registration requests</p>
          </div>
          <div className="flex items-center space-x-2 bg-blue-50 text-blue-700 px-4 py-2 rounded-lg">
            <FiClock size={20} />
            <span className="font-medium">{pendingAdmins.length} Pending</span>
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
          </div>
        ) : pendingAdmins.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
            <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 mb-4">
              <FiCheck className="h-8 w-8 text-green-600" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Pending Requests</h3>
            <p className="text-gray-600">There are no admin registration requests pending approval.</p>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            <Table columns={columns} data={pendingAdmins} />
          </div>
        )}
      </div>
    </Layout>
  );
};

export default AdminApprovals;
