import React, { useEffect, useState } from 'react';
import Layout from '../common/Layout';
import adminService from '../../services/adminService';
import { FiUsers, FiBook, FiAward, FiFileText } from 'react-icons/fi';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { Bar } from 'react-chartjs-2';
import Loader from '../common/Loader';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const AdminDashboard = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const response = await adminService.getDashboard();
      console.log('Dashboard response:', response);
      // adminService returns response.data which has structure { success, data }
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
      icon: FiUsers,
      label: 'Total Students',
      value: dashboardData?.totalStudents || 0,
      color: 'bg-blue-100 text-blue-600',
    },
    {
      icon: FiUsers,
      label: 'Total Faculty',
      value: dashboardData?.totalFaculty || 0,
      color: 'bg-green-100 text-green-600',
    },
    {
      icon: FiBook,
      label: 'Total Courses',
      value: dashboardData?.totalCourses || 0,
      color: 'bg-purple-100 text-purple-600',
    },
    {
      icon: FiAward,
      label: 'Pending Certificates',
      value: dashboardData?.pendingCertificates || 0,
      color: 'bg-yellow-100 text-yellow-600',
    },
  ];

  const chartData = {
    labels: dashboardData?.departmentStats?.map(d => d.department?.name) || [],
    datasets: [
      {
        label: 'Students per Department',
        data: dashboardData?.departmentStats?.map(d => d.count) || [],
        backgroundColor: 'rgba(59, 130, 246, 0.5)',
        borderColor: 'rgba(59, 130, 246, 1)',
        borderWidth: 1,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Department-wise Student Distribution',
      },
    },
  };

  return (
    <Layout>
      <div className="space-y-6">
        <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>

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

        {/* Chart */}
        {dashboardData?.departmentStats?.length > 0 && (
          <div className="card">
            <Bar data={chartData} options={chartOptions} />
          </div>
        )}

        {/* Recent Enrollments */}
        <div className="card">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Enrollments</h2>
          {dashboardData?.recentEnrollments?.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Student</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Course</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {dashboardData.recentEnrollments.map((enrollment) => (
                    <tr key={enrollment._id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {enrollment.student?.firstName} {enrollment.student?.lastName}
                        </div>
                        <div className="text-sm text-gray-500">
                          {enrollment.student?.enrollmentNumber}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{enrollment.course?.name}</div>
                        <div className="text-sm text-gray-500">{enrollment.course?.code}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="badge badge-success capitalize">{enrollment.status}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-gray-500 text-center py-4">No recent enrollments</p>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default AdminDashboard;
