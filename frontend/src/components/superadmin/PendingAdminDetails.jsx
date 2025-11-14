import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import superAdminService from '../../services/superAdminService';
import Loader from '../common/Loader';
import Badge from '../common/Badge';
import Button from '../common/Button';

const PendingAdminDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    fetchPendingAdminDetails();
  }, [id]);

  const fetchPendingAdminDetails = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await superAdminService.getPendingAdmins();
      if (response.success) {
        const pendingAdmin = response.data.find(a => a._id === id);
        setAdmin(pendingAdmin || null);
      }
    } catch (err) {
      console.error('Error fetching pending admin details:', err);
      setError(err.response?.data?.message || 'Failed to fetch pending admin details');
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async () => {
    if (!window.confirm('Are you sure you want to approve this admin?')) {
      return;
    }

    try {
      setProcessing(true);
      console.log('✅ Approving admin:', id);
      const result = await superAdminService.approveAdmin(id);
      if (result.success) {
        alert('Admin approved successfully!');
        navigate('/superadmin/dashboard', { state: { activeCard: 'admins' } });
      }
    } catch (error) {
      console.error('❌ Error approving admin:', error);
      alert('Failed to approve admin: ' + (error.response?.data?.message || error.message));
    } finally {
      setProcessing(false);
    }
  };

  const handleDeny = async () => {
    const reason = prompt('Enter reason for denial:');
    if (!reason) return;

    try {
      setProcessing(true);
      const result = await superAdminService.denyAdmin(id, reason);
      if (result.success) {
        alert('Admin denied successfully');
        navigate('/superadmin/dashboard', { state: { activeCard: 'admins' } });
      }
    } catch (error) {
      console.error('Error denying admin:', error);
      alert('Failed to deny admin: ' + (error.response?.data?.message || error.message));
    } finally {
      setProcessing(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader />
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-600">
          <p className="font-medium">Error: {error}</p>
          <Button
            variant="secondary"
            onClick={() => navigate('/superadmin/dashboard', { state: { activeCard: 'admins' } })}
            className="mt-4"
          >
            Back to Admins
          </Button>
        </div>
      </div>
    );
  }

  if (!admin) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-yellow-600">
          <p className="font-medium">Pending admin not found</p>
          <Button
            variant="secondary"
            onClick={() => navigate('/superadmin/dashboard', { state: { activeCard: 'admins' } })}
            className="mt-4"
          >
            Back to Admins
          </Button>
        </div>
      </div>
    );
  }

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Header */}
      <div className="mb-6">
        <Button
          variant="secondary"
          onClick={() => navigate('/superadmin/dashboard', { state: { activeCard: 'admins' } })}
          className="mb-4"
        >
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to Admins
        </Button>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Pending Admin Details</h1>
            <p className="text-gray-600 mt-1">Review admin registration request</p>
          </div>
          <Badge variant="warning" className="text-lg px-4 py-2">
            Pending Approval
          </Badge>
        </div>
      </div>

      {/* Admin Details Card */}
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        {/* Header Section */}
        <div className="bg-gradient-to-r from-yellow-500 to-yellow-600 px-6 py-8">
          <div className="flex items-center space-x-4">
            <div className="w-20 h-20 bg-white bg-opacity-20 rounded-full flex items-center justify-center flex-shrink-0">
              <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-white">
                {admin.firstName} {admin.lastName}
              </h2>
              <p className="text-yellow-100 mt-1">{admin.email}</p>
              <div className="mt-2">
                <Badge variant="warning" className="text-sm">
                  Awaiting Approval
                </Badge>
              </div>
            </div>
          </div>
        </div>

        {/* Details Grid */}
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Personal Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">
                Personal Information
              </h3>
              
              <div>
                <p className="text-sm text-gray-500">Full Name</p>
                <p className="text-base font-medium text-gray-900">
                  {admin.firstName} {admin.lastName}
                </p>
              </div>

              <div>
                <p className="text-sm text-gray-500">Email</p>
                <p className="text-base font-medium text-gray-900">{admin.email}</p>
              </div>

              <div>
                <p className="text-sm text-gray-500">Phone Number</p>
                <p className="text-base font-medium text-gray-900">{admin.phoneNumber || 'N/A'}</p>
              </div>

              <div>
                <p className="text-sm text-gray-500">Date of Birth</p>
                <p className="text-base font-medium text-gray-900">{formatDate(admin.dateOfBirth)}</p>
              </div>

              <div>
                <p className="text-sm text-gray-500">Gender</p>
                <p className="text-base font-medium text-gray-900 capitalize">{admin.gender || 'N/A'}</p>
              </div>
            </div>

            {/* Administrative Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">
                Administrative Information
              </h3>

              <div>
                <p className="text-sm text-gray-500">Department</p>
                <p className="text-base font-medium text-gray-900">
                  {admin.department || 'Not Assigned'}
                </p>
              </div>

              <div>
                <p className="text-sm text-gray-500">Role</p>
                <p className="text-base font-medium text-gray-900 capitalize">{admin.role}</p>
              </div>
            </div>
          </div>

          {/* Registration Status Section */}
          <div className="mt-6 pt-6 border-t">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Registration Status</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <div className="bg-yellow-50 rounded-lg p-3 border border-yellow-200">
                <p className="text-sm text-gray-500">Status</p>
                <p className="text-base font-semibold text-yellow-700 capitalize">
                  {admin.status || 'Pending'}
                </p>
              </div>

              <div className="bg-gray-50 rounded-lg p-3">
                <p className="text-sm text-gray-500">Submitted Date</p>
                <p className="text-base font-semibold text-gray-900">
                  {formatDate(admin.createdAt)}
                </p>
              </div>

              <div className="bg-gray-50 rounded-lg p-3">
                <p className="text-sm text-gray-500">Last Updated</p>
                <p className="text-base font-semibold text-gray-900">
                  {formatDate(admin.updatedAt)}
                </p>
              </div>
            </div>
          </div>

          {/* Address (if available) */}
          {admin.address && (
            <div className="mt-6 pt-6 border-t">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Address</h3>
              <p className="text-base text-gray-900">{admin.address}</p>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="bg-gray-50 px-6 py-4 border-t">
          <div className="flex justify-between items-center">
            <Button
              variant="secondary"
              onClick={() => navigate('/superadmin/dashboard', { state: { activeCard: 'admins' } })}
              disabled={processing}
            >
              Back to Admins
            </Button>
            <div className="flex space-x-3">
              <Button
                variant="danger"
                onClick={handleDeny}
                disabled={processing}
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
                Deny
              </Button>
              <Button
                variant="success"
                onClick={handleApprove}
                loading={processing}
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Approve Admin
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PendingAdminDetails;
