// src/views/components/Course/MeetingNoteButton.js
import React from "react";
import { useNavigate } from "react-router-dom";
import { FilePlus } from "lucide-react"; // (Hoặc icon bạn thích)

export default function MeetingNoteButton({ courseId, courseName, className }) {
  const navigate = useNavigate();

  const handleClick = () => {
    // 2. Nó sẽ tạo 1 URL "động"
    // Ví dụ: /tutor/create-note?courseId=1&courseName=Giải tích 1
    const path = `/tutor/create-note?courseId=${courseId}&courseName=${encodeURIComponent(courseName)}`;

    // 3. Và "đẩy" user tới đó
    navigate(path);
  };

  return (
    <button
      onClick={handleClick}
      className={`${className} bg-yellow-50 hover:bg-yellow-100 text-yellow-800 px-3 py-2 rounded-lg flex items-center justify-center gap-1 text-sm font-medium transition-colors`}
    >
      <FilePlus className="w-4 h-4" /> Tạo Note
    </button>
  );
}
