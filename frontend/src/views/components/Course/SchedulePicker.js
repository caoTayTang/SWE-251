import React, { useState, useEffect } from 'react';

const daysOfWeek = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

export default function SchedulePicker({ schedule, setSchedule }) {
  const [localSchedule, setLocalSchedule] = useState(schedule || {});

  const toggleDay = (day) => {
    setLocalSchedule(prev => ({
      ...prev,
      [day]: prev[day] ? undefined : { start: '08:00', end: '10:00' }
    }));
  };

  const updateTime = (day, field, value) => {
    setLocalSchedule(prev => ({
      ...prev,
      [day]: {
        ...prev[day],
        [field]: value
      }
    }));
  };

  useEffect(() => {
    setSchedule(localSchedule);
  }, [localSchedule]);

  return (
    <div className="space-y-2">
      {daysOfWeek.map(day => (
        <div key={day} className="flex items-center gap-4">
          {/* Checkbox with styled background */}
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={!!localSchedule[day]}
              onChange={() => toggleDay(day)}
              className="w-5 h-5 text-blue-600 rounded focus:ring-2 focus:ring-blue-400"
            />
            <span className="w-12 font-medium text-gray-700">{day}</span>
          </label>

          {/* Time pickers */}
          {localSchedule[day] && (
            <div className="flex items-center gap-2">
              <input
                type="time"
                value={localSchedule[day].start}
                onChange={(e) => updateTime(day, 'start', e.target.value)}
                className="border border-gray-300 rounded-lg px-2 py-1 focus:ring-2 focus:ring-blue-500 outline-none"
              />
              <span className="text-gray-500">-</span>
              <input
                type="time"
                value={localSchedule[day].end}
                onChange={(e) => updateTime(day, 'end', e.target.value)}
                className="border border-gray-300 rounded-lg px-2 py-1 focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
