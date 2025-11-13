import React, { useEffect, useState } from 'react';
import Layout from '../common/Layout';
import adminService from '../../services/adminService';
import { FiEdit2, FiTrash2, FiPlus, FiSearch } from 'react-icons/fi';
import { toast } from 'react-toastify';
import Loader from '../common/Loader';

const Departments = () => {
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchDepartments();
  }, []);

  const fetchDepartments = async () => {
    try {
      setLoading(true);
      const response = await adminService.getDepartments();
      console.log('Departments response:', response);
      setDepartments(response.data?.data || []);
    } catch (error) {
      console.error('Error fetching departments:', error);
      toast.error('Failed to load departments');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this department?')) return;
    
    try {
      await adminService.deleteDepartment(id);
      toast.success('Department deleted successfully');
      fetchDepartments();
    } catch (error) {
      console.error('Error deleting department:', error);
      toast.error('Failed to delete department');
    }
  };

  const filteredDepartments = departments.filter(dept => 
    dept.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    dept.code?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return <Loader />;
  }

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">Departments Management</h1>
          <button className="btn btn-primary flex items-center space-x-2">
            <FiPlus size={20} />
            <span>Add Department</span>
          </button>
        </div>

        {/* Search Bar */}
        <div className="card p-4">
          <div className="relative">
            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search departments by name or code..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input pl-10 w-full"
            />
          </div>
        </div>

        {/* Departments Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredDepartments.length === 0 ? (
            <div className="col-span-full card p-8 text-center text-gray-500">
              No departments found
            </div>
          ) : (
            filteredDepartments.map((dept) => (
              <div key={dept._id} className="card hover:shadow-lg transition-shadow">
                <div className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div className="w-12 h-12 rounded-lg bg-primary-100 flex items-center justify-center">
                      <span className="text-primary-600 font-bold text-lg">{dept.code}</span>
                    </div>
                    <div className="flex space-x-2">
                      <button
                        className="text-primary-600 hover:text-primary-900"
                        onClick={() => toast.info('Edit functionality coming soon')}
                      >
                        <FiEdit2 size={18} />
                      </button>
                      <button
                        className="text-red-600 hover:text-red-900"
                        onClick={() => handleDelete(dept._id)}
                      >
                        <FiTrash2 size={18} />
                      </button>
                    </div>
                  </div>
                  
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{dept.name}</h3>
                  <p className="text-sm text-gray-600 mb-4">{dept.description}</p>
                  
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-500">Building:</span>
                      <span className="text-gray-900">{dept.building}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Floor:</span>
                      <span className="text-gray-900">{dept.floor}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Established:</span>
                      <span className="text-gray-900">{dept.establishedYear}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Contact:</span>
                      <span className="text-gray-900">{dept.contactPhone}</span>
                    </div>
                  </div>
                  
                  <div className="mt-4 pt-4 border-t">
                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                      dept.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {dept.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </Layout>
  );
};

export default Departments;
