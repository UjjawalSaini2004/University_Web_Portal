import React, { useState, useEffect } from 'react';
import superAdminService from '../../../services/superAdminService';
import Badge from '../../common/Badge';
import Modal from '../../common/Modal';
import Input from '../../common/Input';
import Button from '../../common/Button';

const CourseCard = ({ stats, loading, onRefresh, activeCard, setActiveCard }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [courses, setCourses] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [loadingData, setLoadingData] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    code: '',
    credits: '',
    semester: '',
    type: '',
    description: '',
    department: '',
    academicYear: `${new Date().getFullYear()}-${new Date().getFullYear() + 1}`
  });
  const [submitting, setSubmitting] = useState(false);

  // Sync with activeCard prop
  useEffect(() => {
    const shouldExpand = activeCard === 'courses';
    setIsExpanded(shouldExpand);
  }, [activeCard]);

  useEffect(() => {
    if (isExpanded) {
      fetchCourseData();
    }
  }, [isExpanded]);

  const fetchCourseData = async () => {
    try {
      setLoadingData(true);
      const [coursesRes, deptsRes] = await Promise.all([
        superAdminService.getAllCourses({ page: 1, limit: 20 }),
        superAdminService.getAllDepartments()
      ]);
      if (coursesRes.success) {
        setCourses(coursesRes.data.courses || coursesRes.data || []);
      }
      if (deptsRes.success) {
        setDepartments(deptsRes.data || []);
      }
    } catch (error) {
      console.error('Error fetching course data:', error);
    } finally {
      setLoadingData(false);
    }
  };

  const handleDelete = async (courseId) => {
    if (!window.confirm('Are you sure you want to delete this course?')) return;

    try {
      const result = await superAdminService.deleteCourse(courseId);
      if (result.success) {
        fetchCourseData();
        onRefresh();
        alert('Course deleted successfully');
      }
    } catch (error) {
      console.error('Error deleting course:', error);
      alert('Failed to delete course');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      const result = await superAdminService.createCourse(formData);
      if (result.success) {
        setShowAddModal(false);
        setFormData({
          name: '',
          code: '',
          credits: '',
          semester: '',
          type: '',
          description: '',
          department: '',
          academicYear: `${new Date().getFullYear()}-${new Date().getFullYear() + 1}`
        });
        fetchCourseData();
        onRefresh();
        alert('Course created successfully!');
      }
    } catch (error) {
      console.error('Error creating course:', error);
      alert('Failed to create course');
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
        className="bg-gradient-to-r from-purple-500 to-purple-600 px-6 py-5 cursor-pointer"
        onClick={() => {
          const newState = !isExpanded;
          setIsExpanded(newState);
          setActiveCard(newState ? 'courses' : null);
        }}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            {/* Icon */}
            <div className="w-12 h-12 bg-white bg-opacity-20 rounded-lg flex items-center justify-center flex-shrink-0">
              <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
            {/* Title */}
            <div>
              <h3 className="text-xl font-bold text-white">Courses</h3>
              <p className="text-sm text-purple-100 mt-0.5">Manage course catalog</p>
            </div>
          </div>
          {/* Expand/Collapse Button - Circular */}
          <button
            className="w-10 h-10 bg-white bg-opacity-20 hover:bg-opacity-30 rounded-full flex items-center justify-center transition-all duration-300 flex-shrink-0"
            onClick={(e) => {
              e.stopPropagation();
              const newState = !isExpanded;
              setIsExpanded(newState);
              setActiveCard(newState ? 'courses' : null);
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
                <p className="text-sm text-gray-500 mt-0.5">Course catalog statistics</p>
              </div>
            </div>
            <div className="h-px bg-gradient-to-r from-purple-200 via-purple-300 to-transparent mb-4"></div>
            <div className="bg-purple-50 rounded-lg p-4 border border-purple-100">
              <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-gray-500">Total Courses</p>
                <p className="text-3xl font-bold text-gray-900">{stats?.courses?.total || 0}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Active Courses</p>
                <p className="text-3xl font-bold text-green-600">{stats?.courses?.active || 0}</p>
              </div>
            </div>
            </div>
          </div>

          {/* SECTION B - MAIN LIST / TABLE */}
          <div>
            <div className="flex items-center mb-4">
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900">All Courses</h3>
                <p className="text-sm text-gray-500 mt-0.5">Complete course catalog</p>
              </div>
              <Badge variant="info">{courses.length} total</Badge>
            </div>
            <div className="h-px bg-gradient-to-r from-purple-200 via-purple-300 to-transparent mb-4"></div>
            <div className="border border-gray-200 rounded-lg overflow-hidden">
              <div className="max-h-64 overflow-y-auto">
                {loadingData ? (
                  <div className="p-8 text-center text-gray-500">Loading courses...</div>
                ) : courses.length === 0 ? (
                  <div className="p-8 text-center text-gray-500">No courses found</div>
                ) : (
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50 sticky top-0">
                      <tr>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Course</th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Code</th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Credits</th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {courses.map((course) => (
                        <tr key={course._id} className="hover:bg-gray-50">
                          <td className="px-4 py-3">
                            <div className="text-sm font-medium text-gray-900">{course.name}</div>
                            <div className="text-xs text-gray-500">
                              {course.department?.name || 'No department'}
                            </div>
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-600">{course.code}</td>
                          <td className="px-4 py-3 text-sm text-gray-600">{course.credits || 'N/A'}</td>
                          <td className="px-4 py-3">
                            <button
                              onClick={() => handleDelete(course._id)}
                              className="text-red-600 hover:text-red-800 text-xs font-medium"
                            >
                              Delete
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            </div>
          </div>

          {/* SECTION D - ADD/CREATE NEW ITEM (No Section C for Courses) */}
          <div className="border-t border-gray-200 pt-6">
            <Button
              onClick={() => setShowAddModal(true)}
              variant="primary"
              className="w-full bg-purple-600 hover:bg-purple-700"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              Add New Course
            </Button>
          </div>

          </div>
        </div>
      </div>
      )}

      {/* Add Course Modal */}
      <Modal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        title="Add New Course"
        size="lg"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Course Name"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            placeholder="e.g., Data Structures and Algorithms"
            required
          />
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Course Code"
              name="code"
              value={formData.code}
              onChange={handleInputChange}
              placeholder="e.g., CS201"
              required
            />
            <Input
              label="Credits"
              name="credits"
              type="number"
              min="1"
              max="10"
              value={formData.credits}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="grid grid-cols-3 gap-4">
            <Input
              label="Semester"
              name="semester"
              type="number"
              min="1"
              max="8"
              value={formData.semester}
              onChange={handleInputChange}
              required
            />
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Course Type <span className="text-red-500">*</span>
              </label>
              <select
                name="type"
                value={formData.type}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="">Select Type</option>
                <option value="theory">Theory</option>
                <option value="practical">Practical</option>
                <option value="theory_practical">Theory + Practical</option>
              </select>
            </div>
            <Input
              label="Academic Year"
              name="academicYear"
              value={formData.academicYear}
              onChange={handleInputChange}
              placeholder="2024-2025"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Department <span className="text-red-500">*</span>
            </label>
            <select
              name="department"
              value={formData.department}
              onChange={handleInputChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="">Select Department</option>
              {departments.map((dept) => (
                <option key={dept._id} value={dept._id}>
                  {dept.name} ({dept.code})
                </option>
              ))}
            </select>
          </div>
          <Input
            label="Description"
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            placeholder="Brief course description"
            required
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
              className="bg-purple-600 hover:bg-purple-700"
            >
              Create Course
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default CourseCard;
