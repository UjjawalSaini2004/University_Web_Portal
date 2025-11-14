import React, { useEffect, useState } from 'react';
import Layout from '../common/Layout';
import facultyService from '../../services/facultyService';
import { FiBook, FiUsers, FiCalendar, FiClock } from 'react-icons/fi';
import { toast } from 'react-toastify';
import Loader from '../common/Loader';

const Courses = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      setLoading(true);
      const response = await facultyService.getMyCourses();
      console.log('✅ My courses fetched:', response);
      setCourses(response.data?.courses || []);
    } catch (error) {
      console.error('❌ Error fetching courses:', error);
      toast.error('Failed to load courses');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Loader />;

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">My Courses</h1>
          <div className="text-sm text-gray-600">
            Total Courses: <span className="font-semibold text-primary-600">{courses.length}</span>
          </div>
        </div>

        {courses.length === 0 ? (
          <div className="card p-8 text-center">
            <FiBook className="mx-auto text-gray-400 mb-4" size={48} />
            <p className="text-gray-600">No courses assigned to you yet.</p>
            <p className="text-sm text-gray-500 mt-2">Contact admin to get courses assigned.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.map((course) => (
              <div key={course._id} className="card hover:shadow-lg transition-shadow">
                <div className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div className="w-12 h-12 rounded-lg bg-primary-100 flex items-center justify-center">
                      <FiBook className="text-primary-600" size={24} />
                    </div>
                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                      course.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                    }`}>
                      {course.status}
                    </span>
                  </div>
                  
                  <div className="mb-2">
                    <span className="text-sm font-semibold text-primary-600">{course.code}</span>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{course.name}</h3>
                  <p className="text-sm text-gray-600 mb-4 line-clamp-2">{course.description}</p>
                  
                  <div className="space-y-2 text-sm mb-4">
                    <div className="flex items-center text-gray-600">
                      <FiCalendar className="mr-2" size={16} />
                      <span>Semester {course.semester}</span>
                    </div>
                    <div className="flex items-center text-gray-600">
                      <FiClock className="mr-2" size={16} />
                      <span>{course.credits} Credits</span>
                    </div>
                    <div className="flex items-center text-gray-600">
                      <FiUsers className="mr-2" size={16} />
                      <span>{course.enrolledCount || 0} / {course.maxStudents} Students</span>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-gray-200">
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-gray-500">Department:</span>
                      <span className="font-medium text-gray-900">{course.department?.name}</span>
                    </div>
                    <div className="flex justify-between items-center text-sm mt-2">
                      <span className="text-gray-500">Type:</span>
                      <span className="font-medium text-gray-900 capitalize">
                        {course.type?.replace('_', ' ')}
                      </span>
                    </div>
                  </div>

                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <button
                      onClick={() => window.location.href = `/faculty/courses/${course._id}/students`}
                      className="w-full btn btn-primary text-sm"
                    >
                      View Students
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Courses;
