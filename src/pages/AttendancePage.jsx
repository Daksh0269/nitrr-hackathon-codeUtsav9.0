// File: src/pages/Attendance/AttendanceTracker.jsx

import React from 'react';
import GridPageWrapper from '../LayoutUI/ClubsUI/GridWrapper';
import SubjectCard from '../LayoutUI/AttendanceUI/SubjectCard';


const firstSemSubjects = [
    { name: 'Mathematics I', code: 'MA101001MA', type: 'Theory', totalClasses: 56 }, // 4 * 14
    { name: 'Physics I', code: 'PH101005PH', type: 'Theory', totalClasses: 42 }, // 3 * 14
    { name: 'Chemistry', code: 'CY101007CY', type: 'Theory', totalClasses: 42 }, // 3 * 14
    { name: 'Communication Skills', code: 'HS101009HS', type: 'Theory', totalClasses: 42 }, // 3 * 14
    { name: 'Basic Engineering Course I', code: 'see table 3', type: 'Theory', totalClasses: 42 }, // 3 * 14
    { name: 'Value Education', code: 'HS101401HS', type: 'Lab', totalClasses: 28 }, // 2 * 14
    { name: 'Chemistry Lab', code: 'CY101402CY', type: 'Lab', totalClasses: 28 }, // 2 * 14
    { name: 'Communication Skills Lab', code: 'HS101403HS', type: 'Lab', totalClasses: 28 }, // 2 * 14
    { name: 'Workshop', code: 'ME101404ME', type: 'Lab', totalClasses: 56 }, // 4 * 14
    { name: 'Physics Lab', code: 'PH101405PH', type: 'Lab', totalClasses: 28 }, // 2 * 14
    { name: 'Basic Engg. Course I Lab', code: '#* see table 3', type: 'Lab', totalClasses: 28 }, // 2 * 14
    { name: 'Yoga & Health', code: 'HS101406HS', type: 'Lab', totalClasses: 28 }, // 2 * 14
];

function AttendanceTracker() {
    return (
        <GridPageWrapper minCardWidth={340}>
            <div className="col-span-full mb-4">
                <h1 className="text-3xl font-bold text-white">Attendance Tracker</h1>
                <p className="text-gray-400 mt-1">
                    Total classes are pre-filled based on a 14-week semester. You only need to enter the classes you attended.
                </p>
            </div>

            {firstSemSubjects.map((subject) => (
                <SubjectCard
                    key={subject.code}
                    subjectName={subject.name}
                    subjectCode={subject.code}
                    type={subject.type}
                    totalClasses={subject.totalClasses} 
                />
            ))}
        </GridPageWrapper>
    );
}

export default AttendanceTracker;