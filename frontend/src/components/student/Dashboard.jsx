import React, { useEffect, useState } from 'react';
import Layout from '../common/Layout';
import studentService from '../../services/studentService';
import { FiBook, FiCalendar, FiAward, FiBell } from 'react-icons/fi';
import Loader from '../common/Loader';

const StudentDashboard = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const response = await studentService.getDashboard();
      setDashboardData(response.data);
    } catch (error) {
      console.error('Error fetching dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <Loader />;
  }

  const stats = [
    {
      icon: FiBook,
      label: 'Enrolled Courses',
      value: dashboardData?.enrolledCoursesCount || 0,
      color: 'bg-blue-100 text-blue-600',
    },
    {
      icon: FiCalendar,
      label: 'Attendance',
      value: `${dashboardData?.overallAttendance || 0}%`,
      color: 'bg-green-100 text-green-600',
    },
    {
      icon: FiAward,
      label: 'CGPA',
      value: dashboardData?.cgpa || '0.00',
      color: 'bg-purple-100 text-purple-600',
    },
    {
      icon: FiBell,
      label: 'Notifications',
      value: dashboardData?.unreadNotificationsCount || 0,
      color: 'bg-yellow-100 text-yellow-600',
    },
  ];

  return (
    <Layout>
      <div className="space-y-6">
        <h1 className="text-2xl font-bold text-gray-900">Student Dashboard</h1>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <div key={index} className="card">
              <div className="flex items-center">
                <div className={`p-3 rounded-lg ${stat.color}`}>
                  <stat.icon size={24} />
                </div>
                <div className="ml-4">
                  <p className="text-sm text-gray-600">{stat.label}</p>
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Recent Grades */}
        <div className="card">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Grades</h2>
          {dashboardData?.recentGrades?.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Course
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Marks
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Grade
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      GPA
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {dashboardData.recentGrades.map((grade) => (
                    <tr key={grade._id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {grade.course?.name}
                        </div>
                        <div className="text-sm text-gray-500">
                          {grade.course?.code}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {grade.totalMarks}/{grade.maxTotalMarks}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="badge badge-info">{grade.grade}</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {grade.gpa}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-gray-500 text-center py-4">No grades available yet</p>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default StudentDashboard;
