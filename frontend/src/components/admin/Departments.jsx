import React, { useEffect, useState } from 'react';
import Layout from '../common/Layout';
import adminService from '../../services/adminService';
import Modal from '../common/Modal';
import Input from '../common/Input';
import { FiEdit2, FiTrash2, FiPlus, FiSearch } from 'react-icons/fi';
import { toast } from 'react-toastify';
import Loader from '../common/Loader';

const Departments = () => {
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingDept, setEditingDept] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    code: '',
    description: '',
    building: '',
    floor: '',
    contactEmail: '',
    contactPhone: '',
    establishedYear: '',
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      console.log('🔄 Fetching departments from database...');
      setLoading(true);
      const response = await adminService.getDepartments();
      console.log('✅ Departments fetched:', response);
      setDepartments(response.data?.departments || []);
    } catch (error) {
      console.error('❌ Error fetching departments:', error);
      toast.error('Failed to load departments');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this department?')) return;
    
    try {
      console.log('🗑️ Deleting department:', id);
      await adminService.deleteDepartment(id);
      toast.success('Department deleted successfully');
      await fetchData(); // Refresh data immediately
      console.log('✅ Department deleted and data refreshed');
    } catch (error) {
      console.error('❌ Error deleting department:', error);
      toast.error('Failed to delete department');
    }
  };

  const handleEdit = (dept) => {
    console.log('✏️ Editing department:', dept);
    setEditingDept(dept);
    setFormData({
      name: dept.name || '',
      code: dept.code || '',
      description: dept.description || '',
      building: dept.building || '',
      floor: dept.floor || '',
      contactEmail: dept.contactEmail || '',
      contactPhone: dept.contactPhone || '',
      establishedYear: dept.establishedYear || '',
    });
    setShowModal(true);
  };

  const handleAdd = () => {
    console.log('➕ Adding new department');
    setEditingDept(null);
    setFormData({
      name: '',
      code: '',
      description: '',
      building: '',
      floor: '',
      contactEmail: '',
      contactPhone: '',
      establishedYear: '',
    });
    setShowModal(true);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('📝 Submitting department data:', formData);

    try {
      if (editingDept) {
        await adminService.updateDepartment(editingDept._id, formData);
        toast.success('Department updated successfully');
        console.log('✅ Department updated');
      } else {
        await adminService.addDepartment(formData);
        toast.success('Department added successfully');
        console.log('✅ Department added');
      }
      
      setShowModal(false);
      await fetchData(); // Refresh data immediately
      console.log('✅ Data refreshed after save');
    } catch (error) {
      console.error('❌ Error saving department:', error);
      toast.error(error.response?.data?.message || 'Failed to save department');
    }
  };

  const filteredDepartments = departments.filter(dept => 
    dept.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    dept.code?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">Departments Management</h1>
          <button 
            onClick={handleAdd}
            className="btn btn-primary flex items-center space-x-2"
          >
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
                        onClick={() => handleEdit(dept)}
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

      {/* Add/Edit Modal */}
      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title={editingDept ? 'Edit Department' : 'Add New Department'}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Department Name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              placeholder="Computer Science"
              required
            />
            <Input
              label="Department Code"
              name="code"
              value={formData.code}
              onChange={handleInputChange}
              placeholder="CS"
              required
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              rows="3"
              className="input"
              placeholder="Department description..."
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Building"
              name="building"
              value={formData.building}
              onChange={handleInputChange}
              placeholder="Main Building"
            />
            <Input
              label="Floor"
              name="floor"
              value={formData.floor}
              onChange={handleInputChange}
              placeholder="3rd Floor"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Contact Email"
              name="contactEmail"
              type="email"
              value={formData.contactEmail}
              onChange={handleInputChange}
              placeholder="cs@university.edu"
            />
            <Input
              label="Contact Phone"
              name="contactPhone"
              value={formData.contactPhone}
              onChange={handleInputChange}
              placeholder="+1234567890"
            />
          </div>

          <Input
            label="Established Year"
            name="establishedYear"
            type="number"
            value={formData.establishedYear}
            onChange={handleInputChange}
            placeholder="2000"
          />

          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={() => setShowModal(false)}
              className="btn btn-secondary"
            >
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              {editingDept ? 'Update' : 'Add'} Department
            </button>
          </div>
        </form>
      </Modal>
    </Layout>
  );
};

export default Departments;
