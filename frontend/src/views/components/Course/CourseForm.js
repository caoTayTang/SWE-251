import React, { useState, useEffect } from 'react';
import SchedulePicker from './SchedulePicker';
import { Plus } from 'lucide-react';
import { mockAPI } from '../../../api/mockAPI'; // mock API

export default function CourseForm({ view, course, setView, loadCourses, setSelectedCourse }) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    maxStudents: '',
    location: '',
    startDate: '',
    endDate: '',
    subject: '',
    level: 'beginner',
    schedule: {}
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (course) {
      setFormData({
        title: course.title,
        description: course.description,
        maxStudents: course.maxStudents,
        location: course.location,
        startDate: '',
        endDate: '',
        subject: course.subject || '',
        level: course.level || 'beginner',
        schedule: course.schedule || {}
      });
    }
  }, [course]);

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      maxStudents: '',
      location: '',
      startDate: '',
      endDate: '',
      subject: '',
      level: 'beginner',
      schedule: {}
    });
    setSelectedCourse(null);
  };

  const handleSubmit = async () => {
    if (!formData.title || !formData.description) {
      alert('Vui lòng điền đầy đủ thông tin khóa học');
      return;
    }

    try {
      setLoading(true);
      if (view === 'create') {
        await mockAPI.createCourse(formData);
        alert('Tạo khóa học thành công!');
      } else {
        await mockAPI.updateCourse(course.id, formData);
        alert('Cập nhật khóa học thành công!');
      }
      resetForm();
      setView('list');
      await loadCourses();
    } catch (error) {
      alert('Có lỗi xảy ra');
    }
    setLoading(false);
  };

  return (
    <div className="bg-white rounded-lg shadow-sm">
      <div className="p-6 border-b">
        <h2 className="text-xl font-semibold text-gray-900">
          {view === 'create' ? 'Tạo khóa học mới' : 'Chỉnh sửa khóa học'}
        </h2>
      </div>

      <div className="p-6 space-y-6">
        <div className="grid grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Tên khóa học *</label>
            <input
              type="text"
              value={formData.title}
              onChange={e => setFormData({...formData, title: e.target.value})}
              placeholder="VD: Giải tích 1"
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Môn học</label>
            <input
              type="text"
              value={formData.subject}
              onChange={e => setFormData({...formData, subject: e.target.value})}
              placeholder="VD: Toán cao cấp"
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Mô tả *</label>
          <textarea
            value={formData.description}
            onChange={e => setFormData({...formData, description: e.target.value})}
            placeholder="Mô tả chi tiết..."
            rows={4}
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
          />
        </div>

        <div className="grid grid-cols-3 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Số lượng tối đa</label>
            <input
              type="number"
              value={formData.maxStudents}
              onChange={e => setFormData({...formData, maxStudents: e.target.value})}
              placeholder="20"
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Ngày bắt đầu</label>
            <input
              type="date"
              value={formData.startDate}
              onChange={e => setFormData({...formData, startDate: e.target.value})}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Ngày kết thúc</label>
            <input
              type="date"
              value={formData.endDate}
              onChange={e => setFormData({...formData, endDate: e.target.value})}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Lịch học</label>
          <SchedulePicker
            schedule={formData.schedule}
            setSchedule={(sch) => setFormData({...formData, schedule: sch})}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Địa điểm</label>
          <input
            type="text"
            value={formData.location}
            onChange={e => setFormData({...formData, location: e.target.value})}
            placeholder="VD: H1-201"
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Trình độ</label>
          <select
            value={formData.level}
            onChange={e => setFormData({...formData, level: e.target.value})}
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
          >
            <option value="beginner">Cơ bản</option>
            <option value="intermediate">Trung cấp</option>
            <option value="advanced">Nâng cao</option>
          </select>
        </div>

        <div className="flex gap-4 mt-8 pt-6 border-t">
          <button
            onClick={() => { setView('list'); resetForm(); }}
            className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 px-6 py-3 rounded-lg font-medium"
          >
            Hủy
          </button>
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white px-6 py-3 rounded-lg font-medium"
          >
            {loading ? 'Đang xử lý...' : view === 'create' ? 'Tạo khóa học' : 'Cập nhật'}
          </button>
        </div>
      </div>
    </div>
  );
}
