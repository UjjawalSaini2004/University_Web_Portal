import React, { useEffect, useState } from 'react';
import Layout from '../common/Layout';
import adminService from '../../services/adminService';
import { FiEdit2, FiTrash2, FiPlus, FiSearch, FiBook } from 'react-icons/fi';
import { toast } from 'react-toastify';
import Loader from '../common/Loader';

const Courses = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      setLoading(true);
      const response = await adminService.getCourses();
      console.log('Courses response:', response);
      setCourses(response.data?.data || []);
    } catch (error) {
      console.error('Error fetching courses:', error);
      toast.error('Failed to load courses');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this course?')) return;
    
    try {
      await adminService.deleteCourse(id);
      toast.success('Course deleted successfully');
      fetchCourses();
    } catch (error) {
      console.error('Error deleting course:', error);
      toast.error('Failed to delete course');
    }
  };

  const filteredCourses = courses.filter(course => 
    course.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    course.code?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return <Loader />;
  }

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">Courses Management</h1>
          <button className="btn btn-primary flex items-center space-x-2">
            <FiPlus size={20} />
            <span>Add Course</span>
          </button>
        </div>

        {/* Search Bar */}
        <div className="card p-4">
          <div className="relative">
            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search courses by name or code..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input pl-10 w-full"
            />
          </div>
        </div>

        {/* Courses Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCourses.length === 0 ? (
            <div className="col-span-full card p-8 text-center text-gray-500">
              No courses found
            </div>
          ) : (
            filteredCourses.map((course) => (
              <div key={course._id} className="card hover:shadow-lg transition-shadow">
                <div className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div className="w-12 h-12 rounded-lg bg-purple-100 flex items-center justify-center">
                      <FiBook className="text-purple-600" size={24} />
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
                        onClick={() => handleDelete(course._id)}
                      >
                        <FiTrash2 size={18} />
                      </button>
                    </div>
                  </div>
                  
                  <div className="mb-2">
                    <span className="text-sm font-semibold text-primary-600">{course.code}</span>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{course.name}</h3>
                  <p className="text-sm text-gray-600 mb-4 line-clamp-2">{course.description}</p>
                  
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-500">Department:</span>
                      <span className="text-gray-900">{course.department?.name || 'N/A'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Credits:</span>
                      <span className="text-gray-900">{course.credits}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Semester:</span>
                      <span className="text-gray-900">{course.semester}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Type:</span>
                      <span className="text-gray-900 capitalize">{course.type?.replace('_', ' ')}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Faculty:</span>
                      <span className="text-gray-900">{course.faculty?.firstName} {course.faculty?.lastName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Max Students:</span>
                      <span className="text-gray-900">{course.maxStudents}</span>
                    </div>
                  </div>
                  
                  <div className="mt-4 pt-4 border-t">
                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                      course.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                    }`}>
                      {course.status}
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

export default Courses;
