import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import superAdminService from '../../services/superAdminService';
import Loader from '../common/Loader';
import Badge from '../common/Badge';
import Button from '../common/Button';

const TeacherDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [teacher, setTeacher] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchTeacherDetails();
  }, [id]);

  const fetchTeacherDetails = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await superAdminService.getTeacherDetails(id);
      if (response.success) {
        setTeacher(response.data);
      }
    } catch (err) {
      console.error('Error fetching teacher details:', err);
      setError(err.response?.data?.message || 'Failed to fetch teacher details');
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
            onClick={() => navigate('/superadmin/dashboard', { state: { activeCard: 'teachers' } })}
            className="mt-4"
          >
            Back to Teachers
          </Button>
        </div>
      </div>
    );
  }

  if (!teacher) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-yellow-600">
          <p className="font-medium">Teacher not found</p>
          <Button
            variant="secondary"
            onClick={() => navigate('/superadmin/dashboard', { state: { activeCard: 'teachers' } })}
            className="mt-4"
          >
            Back to Teachers
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

  const getStatusBadge = (isActive) => {
    return isActive ? (
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
          onClick={() => navigate('/superadmin/dashboard', { state: { activeCard: 'teachers' } })}
          className="mb-4"
        >
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to Teachers
        </Button>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Teacher Details</h1>
            <p className="text-gray-600 mt-1">View complete faculty information</p>
          </div>
          {getStatusBadge(teacher.isActive)}
        </div>
      </div>

      {/* Teacher Details Card */}
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        {/* Header Section */}
        <div className="bg-gradient-to-r from-green-500 to-green-600 px-6 py-8">
          <div className="flex items-center space-x-4">
            <div className="w-20 h-20 bg-white bg-opacity-20 rounded-full flex items-center justify-center flex-shrink-0">
              <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-white">
                {teacher.firstName} {teacher.lastName}
              </h2>
              <p className="text-green-100 mt-1">{teacher.email}</p>
              <div className="flex gap-2 mt-2">
                {getStatusBadge(teacher.isActive)}
                {teacher.isVerified && (
                  <Badge variant="info" className="text-sm">Verified</Badge>
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
                <label className="block text-sm font-medium text-gray-500">Full Name</label>
                <p className="mt-1 text-base text-gray-900">{teacher.firstName} {teacher.lastName}</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-500">Email</label>
                <p className="mt-1 text-base text-gray-900">{teacher.email}</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-500">Mobile Number</label>
                <p className="mt-1 text-base text-gray-900">{teacher.phoneNumber || 'N/A'}</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-500">Date of Birth</label>
                <p className="mt-1 text-base text-gray-900">{formatDate(teacher.dateOfBirth)}</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-500">Gender</label>
                <p className="mt-1 text-base text-gray-900 capitalize">{teacher.gender || 'N/A'}</p>
              </div>
            </div>

            {/* Professional Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">
                Professional Information
              </h3>

              <div>
                <label className="block text-sm font-medium text-gray-500">Employee ID</label>
                <p className="mt-1 text-base text-gray-900 font-medium">{teacher.employeeId || 'Not Assigned'}</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-500">Designation</label>
                <p className="mt-1 text-base text-gray-900">{teacher.designation || 'N/A'}</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-500">Department</label>
                <p className="mt-1 text-base text-gray-900">
                  {teacher.department?.name || 'N/A'}
                  {teacher.department?.code && (
                    <span className="text-gray-500 ml-2">({teacher.department.code})</span>
                  )}
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-500">Qualification</label>
                <p className="mt-1 text-base text-gray-900">{teacher.qualification || 'N/A'}</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-500">Joining Date</label>
                <p className="mt-1 text-base text-gray-900">{formatDate(teacher.joiningDate)}</p>
              </div>
            </div>

            {/* Account Status */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">
                Account Status
              </h3>

              <div>
                <label className="block text-sm font-medium text-gray-500">Status</label>
                <div className="mt-1">
                  {getStatusBadge(teacher.isActive)}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-500">Verified</label>
                <div className="mt-1">
                  {teacher.isVerified ? (
                    <Badge variant="success">Yes</Badge>
                  ) : (
                    <Badge variant="warning">No</Badge>
                  )}
                </div>
              </div>

              {teacher.verifiedAt && (
                <div>
                  <label className="block text-sm font-medium text-gray-500">Verified At</label>
                  <p className="mt-1 text-base text-gray-900">{formatDate(teacher.verifiedAt)}</p>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-500">Role</label>
                <p className="mt-1 text-base text-gray-900 capitalize">{teacher.role || 'Faculty'}</p>
              </div>
            </div>

            {/* Additional Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">
                Additional Information
              </h3>

              {teacher.specialization && (
                <div>
                  <label className="block text-sm font-medium text-gray-500">Specialization</label>
                  <p className="mt-1 text-base text-gray-900">{teacher.specialization}</p>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-500">Created At</label>
                <p className="mt-1 text-base text-gray-900">{formatDate(teacher.createdAt)}</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-500">Last Updated</label>
                <p className="mt-1 text-base text-gray-900">{formatDate(teacher.updatedAt)}</p>
              </div>
            </div>
          </div>

          {/* Address (if available) */}
          {teacher.address && (
            <div className="mt-6 pt-6 border-t">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Address</h3>
              <p className="text-base text-gray-900">{teacher.address}</p>
            </div>
          )}

          {/* Department Description (if available) */}
          {teacher.department?.description && (
            <div className="mt-6 pt-6 border-t">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Department Description</h3>
              <p className="text-base text-gray-600">{teacher.department.description}</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="bg-gray-50 px-6 py-4 border-t">
          <Button
            variant="secondary"
            onClick={() => navigate('/superadmin/dashboard', { state: { activeCard: 'teachers' } })}
          >
            Back to Teachers
          </Button>
        </div>
      </div>
    </div>
  );
};

export default TeacherDetails;
