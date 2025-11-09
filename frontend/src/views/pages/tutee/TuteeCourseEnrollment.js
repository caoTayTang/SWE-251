import React, { useState, useEffect } from 'react';
import { Search, BookOpen } from 'lucide-react';
import CourseList from '../../components/Course/CouseList';
import { mockAPI } from '../../../api/mockAPI';

export default function TuteeCourseEnrollment() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => { loadCourses(); }, []);

  const loadCourses = async () => {
    setLoading(true);
    const data = await mockAPI.getCoursesForTutee();
    setCourses(data);
    setLoading(false);
  };

  const handleEnroll = async (id) => { setActionLoading(true); await mockAPI.enrollCourse(id); await loadCourses(); setActionLoading(false); };
  const handleUnenroll = async (id) => { if(!window.confirm('Chắc chắn hủy?')) return; setActionLoading(true); await mockAPI.unenrollCourse(id); await loadCourses(); setActionLoading(false); };

  const filteredCourses = courses.filter(c => {
    const match = c.title.toLowerCase().includes(searchQuery.toLowerCase()) || c.description.toLowerCase().includes(searchQuery.toLowerCase());
    if(filterStatus==='enrolled') return match && c.isEnrolled;
    if(filterStatus==='open') return match && c.status==='open' && !c.isEnrolled;
    return match;
  });

  return (
    <div className="max-w-7xl mx-auto px-6 py-8">
      <div className="flex gap-4 flex-wrap mb-6">
        <div className="flex-1 min-w-[300px] relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input type="text" placeholder="Tìm kiếm..." value={searchQuery} onChange={e=>setSearchQuery(e.target.value)} className="w-full pl-10 pr-4 py-2 border rounded-lg"/>
        </div>
        <div className="flex gap-2">
          {['all','open','enrolled'].map(s => (
            <button key={s} onClick={()=>setFilterStatus(s)} className={`px-4 py-2 rounded-lg ${filterStatus===s?'bg-blue-600 text-white':'bg-gray-100 text-gray-700'}`}>
              {s==='all'?'Tất cả':s==='open'?'Đang mở':'Đã đăng ký'}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <p className="text-center py-12">Đang tải khóa học...</p>
      ) : filteredCourses.length===0 ? (
        <div className="text-center py-12 text-gray-600 flex flex-col items-center">
          <BookOpen className="w-16 h-16 mb-2"/>
          Không tìm thấy khóa học
        </div>
      ) : (
        <CourseList courses={filteredCourses} onDetail={()=>{}} onEnroll={handleEnroll} onUnenroll={handleUnenroll} actionLoading={actionLoading}/>
      )}
    </div>
  );
}
