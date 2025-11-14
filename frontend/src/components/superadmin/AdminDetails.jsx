import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import superAdminService from '../../services/superAdminService';
import Loader from '../common/Loader';
import Badge from '../common/Badge';
import Button from '../common/Button';

const AdminDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchAdminDetails();
  }, [id]);

  const fetchAdminDetails = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await superAdminService.getAdminDetails(id);
      if (response.success) {
        setAdmin(response.data);
      }
    } catch (err) {
      console.error('Error fetching admin details:', err);
      setError(err.response?.data?.message || 'Failed to fetch admin details');
    } finally {
      setLoading(false);
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
          <p className="font-medium">Admin not found</p>
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

  const getStatusBadge = () => {
    if (admin.adminStatus === 'deactivated') {
      return <Badge variant="danger">Deactivated</Badge>;
    }
    return admin.isActive ? (
      <Badge variant="success">Active</Badge>
    ) : (
      <Badge variant="danger">Inactive</Badge>
    );
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
            <h1 className="text-3xl font-bold text-gray-900">Admin Details</h1>
            <p className="text-gray-600 mt-1">View complete administrator information</p>
          </div>
          {getStatusBadge()}
        </div>
      </div>

      {/* Admin Details Card */}
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        {/* Header Section */}
        <div className="bg-gradient-to-r from-indigo-500 to-indigo-600 px-6 py-8">
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
              <p className="text-indigo-100 mt-1">{admin.email}</p>
              <div className="mt-2">
                {admin.isVerified && (
                  <Badge variant="success" className="text-sm">
                    Verified
                  </Badge>
                )}
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
                  {admin.department?.name || 'Not Assigned'}
                </p>
              </div>

              {admin.department?.code && (
                <div>
                  <p className="text-sm text-gray-500">Department Code</p>
                  <p className="text-base font-medium text-gray-900">{admin.department.code}</p>
                </div>
              )}

              <div>
                <p className="text-sm text-gray-500">Role</p>
                <p className="text-base font-medium text-gray-900 capitalize">{admin.role}</p>
              </div>

              <div>
                <p className="text-sm text-gray-500">Admin Status</p>
                <p className="text-base font-medium text-gray-900 capitalize">
                  {admin.adminStatus || 'Active'}
                </p>
              </div>
            </div>
          </div>

          {/* Account Status Section */}
          <div className="mt-6 pt-6 border-t">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Account Status</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-gray-50 rounded-lg p-3">
                <p className="text-sm text-gray-500">Active</p>
                <p className="text-base font-semibold text-gray-900">
                  {admin.isActive ? 'Yes' : 'No'}
                </p>
              </div>

              <div className="bg-gray-50 rounded-lg p-3">
                <p className="text-sm text-gray-500">Verified</p>
                <p className="text-base font-semibold text-gray-900">
                  {admin.isVerified ? 'Yes' : 'No'}
                </p>
              </div>

              <div className="bg-gray-50 rounded-lg p-3">
                <p className="text-sm text-gray-500">Verified At</p>
                <p className="text-base font-semibold text-gray-900">
                  {formatDate(admin.verifiedAt)}
                </p>
              </div>

              <div className="bg-gray-50 rounded-lg p-3">
                <p className="text-sm text-gray-500">Member Since</p>
                <p className="text-base font-semibold text-gray-900">
                  {formatDate(admin.createdAt)}
                </p>
              </div>
            </div>
          </div>

          {/* Verified By (if available) */}
          {admin.verifiedBy && (
            <div className="mt-6 pt-6 border-t">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Verified By</h3>
              <p className="text-base text-gray-900">
                {admin.verifiedBy.firstName} {admin.verifiedBy.lastName}
              </p>
              <p className="text-sm text-gray-600">{admin.verifiedBy.email}</p>
            </div>
          )}

          {/* Address (if available) */}
          {admin.address && (
            <div className="mt-6 pt-6 border-t">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Address</h3>
              <p className="text-base text-gray-900">{admin.address}</p>
            </div>
          )}

          {/* Department Description (if available) */}
          {admin.department?.description && (
            <div className="mt-6 pt-6 border-t">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Department Description</h3>
              <p className="text-base text-gray-600">{admin.department.description}</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="bg-gray-50 px-6 py-4 border-t">
          <Button
            variant="secondary"
            onClick={() => navigate('/superadmin/dashboard', { state: { activeCard: 'admins' } })}
          >
            Back to Admins
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AdminDetails;
