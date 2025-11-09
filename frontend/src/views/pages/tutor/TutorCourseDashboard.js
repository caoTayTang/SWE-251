import React, { useState, useEffect, use } from 'react';
import CourseList from '../../components/Course/CouseList';
import CourseForm from '../../components/Course/CourseForm';
import { mockAPI } from '../../../api/mockAPI'; 
import { Plus } from 'lucide-react';
import { useUser } from '../../contexts/AuthContext';

export default function TutorCourseDashboard() {
  const user = useUser(); // <-- lấy user từ context
  const [view, setView] = useState('list'); // list, create, edit
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCourse, setSelectedCourse] = useState(null);

  useEffect(() => {
    loadCourses();
  }, []);

  const loadCourses = async () => {
    setLoading(true);
    try {
      const data = await mockAPI.getMyCourses();
      setCourses(data);
    } catch (error) {
      console.error('Failed to load courses:', error);
    }
    setLoading(false);
  };

  const startEdit = (course) => {
    setSelectedCourse(course);
    setView('edit');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-6 py-8">

        <div className="flex justify-end mb-4">
          <button
            onClick={() => setView('create')}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg flex items-center gap-2"
          >
            <Plus className="w-5 h-5" /> Tạo khóa học
          </button>
        </div>
        {(view === 'create' || view === 'edit') && (
          <CourseForm
            view={view}
            course={selectedCourse}
            setView={setView}
            loadCourses={loadCourses}
            setSelectedCourse={setSelectedCourse}
          />
        )}
        {view === 'list' && (
          <CourseList
            courses={courses}
            setView={setView}
            startEdit={startEdit}
            loadCourses={loadCourses}
            loading={loading}
            user={user}
          />
        )}
      </div>
    </div>
  );
}
