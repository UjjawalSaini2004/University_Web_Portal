import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import superAdminService from '../../services/superAdminService';
import Loader from '../common/Loader';
import Badge from '../common/Badge';
import Button from '../common/Button';

const StudentDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchStudentDetails();
  }, [id]);

  const fetchStudentDetails = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await superAdminService.getStudentDetails(id);
      if (response.success) {
        setStudent(response.data);
      }
    } catch (err) {
      console.error('Error fetching student details:', err);
      setError(err.response?.data?.message || 'Failed to fetch student details');
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
            onClick={() => navigate('/superadmin/dashboard', { state: { activeCard: 'students' } })}
            className="mt-4"
          >
            Back to Students
          </Button>
        </div>
      </div>
    );
  }

  if (!student) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-yellow-600">
          <p className="font-medium">Student not found</p>
          <Button
            variant="secondary"
            onClick={() => navigate('/superadmin/dashboard', { state: { activeCard: 'students' } })}
            className="mt-4"
          >
            Back to Students
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
          onClick={() => navigate('/superadmin/dashboard', { state: { activeCard: 'students' } })}
          className="mb-4"
        >
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to Students
        </Button>
        <h1 className="text-3xl font-bold text-gray-900">Student Details</h1>
        <p className="text-gray-600 mt-1">View complete student information</p>
      </div>

      {/* Student Details Card */}
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        {/* Header Section */}
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 px-6 py-8">
          <div className="flex items-center space-x-4">
            <div className="w-20 h-20 bg-white bg-opacity-20 rounded-full flex items-center justify-center flex-shrink-0">
              <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-white">
                {student.firstName} {student.lastName}
              </h2>
              <p className="text-blue-100 mt-1">{student.email}</p>
              <div className="mt-2">
                <Badge 
                  variant={student.isVerified ? 'success' : student.isActive ? 'info' : 'danger'}
                  className="text-sm"
                >
                  {student.isVerified ? 'Verified' : student.isActive ? 'Active' : 'Inactive'}
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
                <label className="block text-sm font-medium text-gray-500">Full Name</label>
                <p className="mt-1 text-base text-gray-900">{student.firstName} {student.lastName}</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-500">Email</label>
                <p className="mt-1 text-base text-gray-900">{student.email}</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-500">Mobile Number</label>
                <p className="mt-1 text-base text-gray-900">{student.phoneNumber || 'N/A'}</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-500">Date of Birth</label>
                <p className="mt-1 text-base text-gray-900">{formatDate(student.dateOfBirth)}</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-500">Gender</label>
                <p className="mt-1 text-base text-gray-900 capitalize">{student.gender || 'N/A'}</p>
              </div>
            </div>

            {/* Academic Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">
                Academic Information
              </h3>

              <div>
                <label className="block text-sm font-medium text-gray-500">Enrollment Number</label>
                <p className="mt-1 text-base text-gray-900 font-medium">{student.enrollmentNumber || 'Not Assigned'}</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-500">Department</label>
                <p className="mt-1 text-base text-gray-900">
                  {student.department?.name || 'N/A'}
                  {student.department?.code && (
                    <span className="text-gray-500 ml-2">({student.department.code})</span>
                  )}
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-500">Semester</label>
                <p className="mt-1 text-base text-gray-900">{student.semester || 'N/A'}</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-500">Admission Year</label>
                <p className="mt-1 text-base text-gray-900">{student.admissionYear || 'N/A'}</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-500">Batch</label>
                <p className="mt-1 text-base text-gray-900">{student.batch || 'N/A'}</p>
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
                  <Badge variant={student.isActive ? 'success' : 'danger'}>
                    {student.isActive ? 'Active' : 'Inactive'}
                  </Badge>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-500">Verification Status</label>
                <div className="mt-1">
                  <Badge variant={student.isVerified ? 'success' : 'warning'}>
                    {student.isVerified ? 'Verified' : 'Not Verified'}
                  </Badge>
                </div>
              </div>

              {student.verifiedBy && (
                <div>
                  <label className="block text-sm font-medium text-gray-500">Verified By</label>
                  <p className="mt-1 text-base text-gray-900">
                    {student.verifiedBy.firstName} {student.verifiedBy.lastName}
                  </p>
                  <p className="text-sm text-gray-500">{student.verifiedBy.email}</p>
                </div>
              )}
            </div>

            {/* Timestamps */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">
                Timestamps
              </h3>

              <div>
                <label className="block text-sm font-medium text-gray-500">Created At</label>
                <p className="mt-1 text-base text-gray-900">{formatDate(student.createdAt)}</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-500">Last Updated</label>
                <p className="mt-1 text-base text-gray-900">{formatDate(student.updatedAt)}</p>
              </div>

              {student.lastLogin && (
                <div>
                  <label className="block text-sm font-medium text-gray-500">Last Login</label>
                  <p className="mt-1 text-base text-gray-900">{formatDate(student.lastLogin)}</p>
                </div>
              )}
            </div>
          </div>

          {/* Address (if available) */}
          {student.address && (
            <div className="mt-6 pt-6 border-t">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Address</h3>
              <p className="text-base text-gray-900">{student.address}</p>
            </div>
          )}

          {/* Description (if available) */}
          {student.department?.description && (
            <div className="mt-6 pt-6 border-t">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Department Description</h3>
              <p className="text-base text-gray-600">{student.department.description}</p>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="bg-gray-50 px-6 py-4 border-t flex justify-between items-center">
          <Button
            variant="secondary"
            onClick={() => navigate('/superadmin/dashboard', { state: { activeCard: 'students' } })}
          >
            Back to Students
          </Button>
          <div className="text-sm text-gray-500">
            Student ID: {student._id}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentDetails;
