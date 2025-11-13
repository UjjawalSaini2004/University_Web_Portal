import React, { useEffect, useState } from 'react';
import Layout from '../common/Layout';
import facultyService from '../../services/facultyService';
import { FiBook, FiUsers, FiFileText } from 'react-icons/fi';
import Loader from '../common/Loader';

const FacultyDashboard = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const response = await facultyService.getDashboard();
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
      label: 'Assigned Courses',
      value: dashboardData?.coursesCount || 0,
      color: 'bg-blue-100 text-blue-600',
    },
    {
      icon: FiUsers,
      label: 'Total Students',
      value: dashboardData?.totalStudents || 0,
      color: 'bg-green-100 text-green-600',
    },
    {
      icon: FiFileText,
      label: 'Materials Uploaded',
      value: dashboardData?.recentMaterials?.length || 0,
      color: 'bg-purple-100 text-purple-600',
    },
  ];

  return (
    <Layout>
      <div className="space-y-6">
        <h1 className="text-2xl font-bold text-gray-900">Faculty Dashboard</h1>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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

        {/* Recent Materials */}
        <div className="card">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Study Materials</h2>
          {dashboardData?.recentMaterials?.length > 0 ? (
            <div className="space-y-3">
              {dashboardData.recentMaterials.map((material) => (
                <div key={material._id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-900">{material.title}</p>
                    <p className="text-sm text-gray-500">{material.course?.name}</p>
                  </div>
                  <span className="badge badge-info">{material.category}</span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-center py-4">No materials uploaded yet</p>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default FacultyDashboard;
