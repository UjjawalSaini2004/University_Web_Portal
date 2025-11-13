import React, { useState, useEffect } from 'react';
import superAdminService from '../../../services/superAdminService';
import Badge from '../../common/Badge';
import Modal from '../../common/Modal';
import Input from '../../common/Input';
import Button from '../../common/Button';

const DepartmentCard = ({ stats, loading, onRefresh, activeCard, setActiveCard }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [departments, setDepartments] = useState([]);
  const [loadingData, setLoadingData] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    code: '',
    description: '',
    hod: ''
  });
  const [submitting, setSubmitting] = useState(false);

  // Sync with activeCard prop
  useEffect(() => {
    const shouldExpand = activeCard === 'departments';
    setIsExpanded(shouldExpand);
  }, [activeCard]);

  useEffect(() => {
    if (isExpanded) {
      fetchDepartmentData();
    }
  }, [isExpanded]);

  const fetchDepartmentData = async () => {
    try {
      setLoadingData(true);
      const result = await superAdminService.getAllDepartments();
      if (result.success) {
        setDepartments(result.data || []);
      }
    } catch (error) {
      console.error('Error fetching department data:', error);
    } finally {
      setLoadingData(false);
    }
  };

  const handleDelete = async (departmentId) => {
    if (!window.confirm('Are you sure you want to delete this department?')) return;

    try {
      const result = await superAdminService.deleteDepartment(departmentId);
      if (result.success) {
        fetchDepartmentData();
        onRefresh();
        alert('Department deleted successfully');
      }
    } catch (error) {
      console.error('Error deleting department:', error);
      alert('Failed to delete department');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      const result = await superAdminService.createDepartment(formData);
      if (result.success) {
        setShowAddModal(false);
        setFormData({
          name: '',
          code: '',
          description: '',
          hod: ''
        });
        fetchDepartmentData();
        onRefresh();
        alert('Department created successfully!');
      }
    } catch (error) {
      console.error('Error creating department:', error);
      alert('Failed to create department');
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
        className="bg-gradient-to-r from-pink-500 to-pink-600 px-6 py-5 cursor-pointer"
        onClick={() => {
          const newState = !isExpanded;
          setIsExpanded(newState);
          setActiveCard(newState ? 'departments' : null);
        }}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            {/* Icon */}
            <div className="w-12 h-12 bg-white bg-opacity-20 rounded-lg flex items-center justify-center flex-shrink-0">
              <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </div>
            {/* Title */}
            <div>
              <h3 className="text-xl font-bold text-white">Departments</h3>
              <p className="text-sm text-pink-100 mt-0.5">Manage departments</p>
            </div>
          </div>
          {/* Expand/Collapse Button - Circular */}
          <button
            className="w-10 h-10 bg-white bg-opacity-20 hover:bg-opacity-30 rounded-full flex items-center justify-center transition-all duration-300 flex-shrink-0"
            onClick={(e) => {
              e.stopPropagation();
              const newState = !isExpanded;
              setIsExpanded(newState);
              setActiveCard(newState ? 'departments' : null);
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
                <p className="text-sm text-gray-500 mt-0.5">Department statistics at a glance</p>
              </div>
            </div>
            <div className="h-px bg-gradient-to-r from-pink-200 via-pink-300 to-transparent mb-4"></div>
            <div className="bg-pink-50 rounded-lg p-4 border border-pink-100">
              <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-gray-500">Total Departments</p>
                <p className="text-3xl font-bold text-gray-900">{stats?.departments?.total || 0}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Active Departments</p>
                <p className="text-3xl font-bold text-green-600">{departments.filter(d => d.isActive).length || 0}</p>
              </div>
            </div>
            </div>
          </div>

          {/* SECTION B - MAIN LIST / TABLE */}
          <div>
            <div className="flex items-center mb-4">
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900">All Departments</h3>
                <p className="text-sm text-gray-500 mt-0.5">Academic departments and units</p>
              </div>
              <Badge variant="info">{departments.length} total</Badge>
            </div>
            <div className="h-px bg-gradient-to-r from-pink-200 via-pink-300 to-transparent mb-4"></div>
            <div className="border border-gray-200 rounded-lg overflow-hidden">
              <div className="max-h-64 overflow-y-auto">
                {loadingData ? (
                  <div className="p-8 text-center text-gray-500">Loading departments...</div>
                ) : departments.length === 0 ? (
                  <div className="p-8 text-center text-gray-500">No departments found</div>
                ) : (
                  <div className="divide-y divide-gray-200">
                    {departments.map((dept) => (
                      <div key={dept._id} className="p-4 hover:bg-gray-50 transition-colors">
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <div className="flex items-center space-x-3">
                              <h5 className="text-sm font-semibold text-gray-900">{dept.name}</h5>
                              <Badge variant="secondary">{dept.code}</Badge>
                            </div>
                            <p className="text-xs text-gray-600 mt-1">{dept.description || 'No description'}</p>
                            <p className="text-xs text-gray-500 mt-1">
                              HOD: {dept.hod ? `${dept.hod.firstName} ${dept.hod.lastName}` : 'Not assigned'}
                            </p>
                          </div>
                          <button
                            onClick={() => handleDelete(dept._id)}
                            className="ml-4 p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* SECTION D - ADD/CREATE NEW ITEM (No Section C for Departments) */}
          <div className="border-t border-gray-200 pt-6">
            <Button
              onClick={() => setShowAddModal(true)}
              variant="primary"
              className="w-full"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              Add New Department
            </Button>
          </div>
        </div>
      </div>
      </div>
      )}

      {/* Add Department Modal */}
      <Modal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        title="Add New Department"
        size="md"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Department Name"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            placeholder="e.g., Computer Science"
            required
          />
          <Input
            label="Department Code"
            name="code"
            value={formData.code}
            onChange={handleInputChange}
            placeholder="e.g., CS"
            required
          />
          <Input
            label="Description"
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            placeholder="Brief description of the department"
          />
          <Input
            label="HOD ID (Optional)"
            name="hod"
            value={formData.hod}
            onChange={handleInputChange}
            placeholder="Faculty member ID"
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
              Create Department
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default DepartmentCard;
