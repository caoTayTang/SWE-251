import React, { useState } from 'react';
import { Search, Filter, BookOpen } from 'lucide-react';
import CourseCard from './CourseCard';

export default function CourseList({ courses, setView, startEdit, loadCourses, loading, user }) {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredCourses = courses.filter(course =>
    course.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleDelete = async (id) => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa khóa học này?')) return;
    // call API delete ở đây nếu muốn
    alert(`Deleted course ${id} (API chưa gọi)`);
    await loadCourses();
  };

  const isTutor = user?.role === 'tutor';

  return (
    <div>
      {/* Search and Filter */}
      <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
        <div className="flex gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Tìm kiếm khóa học..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
            />
          </div>
          <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center gap-2">
            <Filter className="w-5 h-5" />
            Lọc
          </button>
        </div>
      </div>

      {/* Course List */}
      {loading ? (
        <div className="text-center py-12">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-gray-600 mt-4">Đang tải khóa học...</p>
        </div>
      ) : filteredCourses.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm p-12 text-center">
          <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Chưa có khóa học nào</h3>
          <p className="text-gray-600 mb-6">Tạo khóa học đầu tiên của bạn để bắt đầu</p>
          {isTutor && (
            <button
              onClick={() => setView('create')}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg inline-flex items-center gap-2"
            >
              Tạo khóa học
            </button>
          )}
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredCourses.map(course => (
            <CourseCard
              key={course.id}
              course={course}
              onEdit={startEdit}
              onDelete={handleDelete}
              isTutor={isTutor}
            />
          ))}
        </div>
      )}
    </div>
  );
}
