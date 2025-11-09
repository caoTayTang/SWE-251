import React from 'react';
import { FileText } from 'lucide-react';

export default function MeetingNoteButton() {
  const handleCreateMeetingNote = () => {
    alert('Tạo meeting note cho khóa học này (thực tế sẽ link tới Google Docs)');
  };

  return (
    <button
      onClick={handleCreateMeetingNote}
      className="px-4 py-2 rounded-lg flex items-center gap-2 text-sm font-medium
                 bg-white text-gray-700 border border-gray-300
                 hover:bg-blue-50 hover:text-blue-600 hover:border-blue-500
                 transition-all"
    >
      <FileText className="w-5 h-5" />
      Tạo meeting note
    </button>
  );
}
