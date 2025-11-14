import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import superAdminService from '../../services/superAdminService';
import Loader from '../common/Loader';
import Badge from '../common/Badge';
import Button from '../common/Button';

const PendingTeacherDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [teacher, setTeacher] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    fetchTeacherDetails();
  }, [id]);

  const fetchTeacherDetails = async () => {
    try {
      setLoading(true);
      setError(null);
      // Fetch pending teachers and find the one with matching ID
      const response = await superAdminService.getPendingTeachers();
      if (response.success) {
        const foundTeacher = response.data.find(t => t._id === id);
        if (foundTeacher) {
          setTeacher(foundTeacher);
        } else {
          setError('Pending teacher not found');
        }
      }
    } catch (err) {
      console.error('Error fetching pending teacher details:', err);
      setError(err.response?.data?.message || 'Failed to fetch teacher details');
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async () => {
    if (!window.confirm('Are you sure you want to approve this teacher?')) {
      return;
    }

    try {
      setProcessing(true);
      console.log('✅ Approving teacher:', id);
      const result = await superAdminService.approveTeacher(id);
      if (result.success) {
        alert('Teacher approved successfully!');
        navigate('/superadmin/dashboard', { state: { activeCard: 'teachers' } });
      }
    } catch (error) {
      console.error('❌ Error approving teacher:', error);
      alert('Failed to approve teacher: ' + (error.response?.data?.message || error.message));
    } finally {
      setProcessing(false);
    }
  };

  const handleDeny = async () => {
    const reason = prompt('Enter reason for denial:');
    if (!reason) return;

    try {
      setProcessing(true);
      const result = await superAdminService.denyTeacher(id, reason);
      if (result.success) {
        alert('Teacher denied successfully');
        navigate('/superadmin/dashboard', { state: { activeCard: 'teachers' } });
      }
    } catch (error) {
      console.error('Error denying teacher:', error);
      alert('Failed to deny teacher: ' + (error.response?.data?.message || error.message));
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
          <p className="font-medium">Pending teacher not found</p>
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
  };

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
            <h1 className="text-3xl font-bold text-gray-900">Pending Teacher Details</h1>
            <p className="text-gray-600 mt-1">Review faculty registration request</p>
          </div>
          <Badge variant="warning" className="text-lg px-4 py-2">
            Pending Approval
          </Badge>
        </div>
      </div>

      {/* Teacher Details Card */}
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        {/* Header Section */}
        <div className="bg-gradient-to-r from-yellow-500 to-yellow-600 px-6 py-8">
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
              <p className="text-yellow-100 mt-1">{teacher.email}</p>
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

            {/* Registration Status */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">
                Registration Status
              </h3>

              <div>
                <label className="block text-sm font-medium text-gray-500">Status</label>
                <div className="mt-1">
                  <Badge variant="warning">
                    {teacher.status === 'pending' ? 'Pending Approval' : teacher.status}
                  </Badge>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-500">Submitted At</label>
                <p className="mt-1 text-base text-gray-900">{formatDate(teacher.submittedAt || teacher.createdAt)}</p>
              </div>

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

        {/* Footer Actions */}
        <div className="bg-gray-50 px-6 py-4 border-t">
          <div className="flex justify-between items-center">
            <Button
              variant="secondary"
              onClick={() => navigate('/superadmin/dashboard', { state: { activeCard: 'teachers' } })}
              disabled={processing}
            >
              Back to Teachers
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
                Approve Teacher
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PendingTeacherDetails;
