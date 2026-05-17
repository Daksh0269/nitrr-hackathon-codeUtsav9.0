
import React, { useState, useMemo, useRef } from 'react';
import Input from '../components/Input';
import Button from '../components/Button';
import { Edit2, AlertTriangle, CheckCircle2, TrendingUp, TrendingDown, ShieldAlert } from 'lucide-react'; // Import new icons


const InsightRow = ({ icon, label, value, valueColor = "text-white" }) => (
    <div className="flex items-center justify-between text-sm">
        <div className="flex items-center space-x-2 text-gray-400">
            {icon}
            <span>{label}</span>
        </div>
        <span className={`font-bold ${valueColor}`}>{value}</span>
    </div>
);


function SubjectCard({ subjectName, subjectCode, type, totalClasses }) {
    const [totalHeld, setTotalHeld] = useState(0); // Start at 0, let user input
    const [totalAttended, setTotalAttended] = useState(0);
    const [isEditingTotal, setIsEditingTotal] = useState(false);
    const totalInputRef = useRef(null);

    // This is the "magic" section with all the new insights
    const insights = useMemo(() => {
        // --- Core Variables ---
        const requiredMark = 75;
        const currentHeld = Math.max(1, totalHeld); // Avoid division by zero
        const currentAttended = totalAttended;
        
        // --- Current Status (The simple calculation) ---
        const currentPercentage = (currentAttended / currentHeld) * 100;
        
        // --- Semester-Wide Insights (The "Stand-Out" Feature) ---
        const minClassesToPass = Math.ceil(totalClasses * (requiredMark / 100));
        const maxAbsencesAllowed = totalClasses - minClassesToPass;
        
        const absencesSoFar = totalHeld - currentAttended;
        const absencesRemaining = maxAbsencesAllowed - absencesSoFar;

        const classesRemainingInSem = totalClasses - totalHeld;
        const classesNeededToPass = minClassesToPass - currentAttended;

        // --- Projections ---
        const maxPossiblePercentage = ((currentAttended + classesRemainingInSem) / totalClasses) * 100;
        const minPossiblePercentage = (currentAttended / totalClasses) * 100;

        // --- Determine Status (Main Message) ---
        let status;
        if (totalHeld === 0) {
            status = {
                message: "Enter classes held & attended to see your status.",
                color: "text-gray-400",
                icon: <ShieldAlert className="w-5 h-5" />
            };
        } else if (classesNeededToPass > classesRemainingInSem) {
            status = {
                message: "It is no longer possible to reach 75% this semester.",
                color: "text-red-400",
                icon: <AlertTriangle className="w-5 h-5" />
            };
        } else if (absencesRemaining < 0) {
             status = {
                message: "Budget exceeded. You must attend all remaining classes.",
                color: "text-red-500",
                icon: <AlertTriangle className="w-5 h-5" />
            };
        } else if (absencesRemaining === 0) {
             status = {
                message: "Caution! You have no more absences remaining.",
                color: "text-yellow-400",
                icon: <ShieldAlert className="w-5 h-5" />
            };
        } else {
             status = {
                message: `You are safe. You have ${absencesRemaining} more absence(s) in your budget.`,
                color: "text-green-400",
                icon: <CheckCircle2 className="w-5 h-5" />
            };
        }

        return {
            currentPercentage,
            status,
            absencesSoFar,
            maxAbsencesAllowed,
            absencesRemaining,
            classesNeededToPass: Math.max(0, classesNeededToPass),
            classesRemainingInSem: Math.max(0, classesRemainingInSem),
            maxPossiblePercentage,
            minPossiblePercentage,
        };

    }, [totalHeld, totalAttended, totalClasses]);

    const percentage = insights.currentPercentage.toFixed(1);

    const handleEditClick = () => {
        setIsEditingTotal(true);
        setTimeout(() => totalInputRef.current?.focus(), 0);
    };

    return (
        <div className="bg-[#181818] rounded-xl border border-[#333333] p-5 flex flex-col h-full transition-all duration-300 hover:border-blue-600">
            
            {/* Header */}
            <span className={`text-xs font-semibold px-2 py-0.5 rounded-full mb-2 self-start ${type === 'Theory' ? 'bg-blue-900/30 text-blue-400' : 'bg-purple-900/30 text-purple-400'}`}>
                {type}
            </span>
            <h3 className="text-xl font-bold text-white mb-1 leading-tight">{subjectName}</h3>
            <p className="text-xs text-gray-500 mb-4">{subjectCode} (Total: {totalClasses} classes)</p>

            {/* Inputs */}
            <div className="flex flex-col sm:flex-row gap-4 mb-4">
                {/* Total Held Input */}
                <div className="flex-1 relative">
                    <Input
                        ref={totalInputRef}
                        label="Total Classes Held So Far"
                        type="number"
                        placeholder="Held So Far"
                        onChange={(e) => setTotalHeld(Number(e.target.value) || 0)}
                        value={totalHeld || ''}
                        readOnly={!isEditingTotal}
                        onBlur={() => setIsEditingTotal(false)}
                        inputClassName={`py-2 text-sm ${!isEditingTotal ? 'pr-10' : ''}`}
                    />
                    {!isEditingTotal && (
                        <Button
                            variant="ghost"
                            size="sm"
                            className="absolute right-1 top-1/2 -translate-y-1/2 p-1 h-auto text-gray-400 hover:text-white"
                            onClick={handleEditClick}
                            title="Edit total classes held"
                        >
                            <Edit2 className="w-4 h-4" />
                        </Button>
                    )}
                </div>

                {/* Attended Input */}
                <div className="flex-1">
                    <Input
                        label="Classes You Attended"
                        type="number"
                        placeholder="You Attended"
                        onChange={(e) => setTotalAttended(Number(e.target.value) || 0)}
                        value={totalAttended || ''}
                        inputClassName="py-2 text-sm" 
                    />
                </div>
            </div>

            {/* Main Status Message */}
            <div className={`text-center bg-black/50 border border-[#333333] p-3 rounded-lg min-h-[60px] flex items-center justify-center space-x-3 ${insights.status.color}`}>
                <div className="flex-shrink-0">{insights.status.icon}</div>
                <p className="text-sm font-semibold text-left flex-1">
                    {insights.status.message}
                </p>
            </div>

            {/* Progress Bar (Current %) */}
            <div className="w-full bg-black rounded-full h-2.5 border border-[#333333] my-3">
                <div 
                    className={`h-full rounded-full transition-all duration-500 ${insights.absencesRemaining < 0 ? 'bg-red-600' : 'bg-blue-600'}`}
                    style={{ width: `${totalHeld > 0 ? percentage : 0}%` }}
                ></div>
            </div>
            <p className="text-xs text-gray-400 text-center mb-4">
                Current Attendance: <span className="font-bold text-white">{totalHeld > 0 ? percentage : '0.0'}%</span>
            </p>

            {/* --- NEW INSIGHTS SECTION --- */}
            <div className="bg-black p-4 rounded-lg border border-[#333333] space-y-3">
                <h4 className="text-base font-bold text-white mb-2">Semester Insights</h4>
                
                <InsightRow 
                    icon={<AlertTriangle className="w-4 h-4 text-red-500"/>}
                    label="Absence Budget"
                    value={`${insights.absencesSoFar} / ${insights.maxAbsencesAllowed} used`}
                    valueColor={insights.absencesRemaining < 0 ? "text-red-400" : "text-white"}
                />
                
                <InsightRow 
                    icon={<CheckCircle2 className="w-4 h-4 text-green-500"/>}
                    label="Must Attend"
                    value={`${insights.classesNeededToPass} of ${insights.classesRemainingInSem} remaining`}
                />

                <hr className="border-t border-[#333333]" />

                <InsightRow 
                    icon={<TrendingUp className="w-4 h-4 text-blue-500"/>}
                    label="Max Possible %"
                    value={`${insights.maxPossiblePercentage.toFixed(1)}%`}
                />
                
                <InsightRow 
                    icon={<TrendingDown className="w-4 h-4 text-gray-500"/>}
                    label="Min Possible %"
                    value={`${insights.minPossiblePercentage.toFixed(1)}%`}
                />
            </div>
        </div>
    );
}

export default SubjectCard;