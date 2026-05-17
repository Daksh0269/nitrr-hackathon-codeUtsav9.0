import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Button from '../../LayoutUI/components/Button';
import GridPageWrapper from '../../LayoutUI/ClubsUI/GridWrapper';
import { User, Mail, Activity } from 'lucide-react'; // Import icons

// --- EXPANDED CLUB DATA ---
// I've expanded this data to include all the new fields you suggested.
const contentData = [
    { 
        id: 1, 
        title: "The Technocracy", 
        summary: "The official Technical Committee, organizing technical events and the annual technical fest AAVARTAN.", 
        tag: "Technical",
        facultyCoordinator: "Dr. A. K. Saxena",
        studentLead: "Rohan Gupta",
        contactEmail: "technocracy@nitrr.ac.in",
        description: "The Technocracy is the central hub for all technical activities at NIT Raipur. As the official technical committee, our primary mission is to foster a culture of innovation, problem-solving, and hands-on learning among students. We bridge the gap between academic theory and practical application.",
        activities: [
            "Organizing 'AAVARTAN', the annual techno-management fest.",
            "Conducting workshops on emerging technologies (AI, Web3, IoT).",
            "Hosting hackathons and coding competitions.",
            "Managing inter-college technical event participation."
        ]
    },
    { 
        id: 2, 
        title: "SAHYOG - The Mentorship Club", 
        summary: "Provides constructive guidance, runs the Green Library textbook initiative, and organizes mock placement sessions.", 
        tag: "Societal/Mentorship",
        facultyCoordinator: "Dr. R. S. Pandey",
        studentLead: "Priya Sharma",
        contactEmail: "sahyog@nitrr.ac.in",
        description: "SAHYOG is dedicated to creating a supportive and collaborative environment for all students. We believe in 'students helping students'. Our core focus is on mentorship, academic support, and professional development to ensure every student can achieve their full potential.",
        activities: [
            "Running the 'Green Library' textbook donation and lending drive.",
            "Organizing mock placement drives (Interviews, GDs, Aptitude Tests).",
            "Peer-to-peer mentorship programs for first-year students.",
            "Conducting workshops on resume building and soft skills."
        ]
    },
    { 
        id: 3, 
        title: "Raaga – The Music Club", 
        summary: "Dedicated to fostering musical talent, organizing performances, and hosting the annual music event SHRUTI.", 
        tag: "Cultural",
        facultyCoordinator: "Dr. S. K. Sinha",
        studentLead: "Arjun Menon",
        contactEmail: "raaga@nitrr.ac.in",
        description: "Raaga is the soul of NITRR's cultural scene. It's a community for musicians, vocalists, and all lovers of music to come together, collaborate, and create. We aim to preserve and promote diverse musical genres and provide a platform for artists to showcase their talent.",
        activities: [
            "Organizing 'SHRUTI', the annual intra-college music competition.",
            "Performing at all major college events, including Eclectika.",
            "Hosting 'unplugged' nights and jam sessions.",
            "Conducting workshops on instruments and vocal training."
        ]
    },
    { 
        id: 4, 
        title: "ROBOTix Club", 
        summary: "Focuses on automation, design, and programming, conducting workshops and robotics competitions.", 
        tag: "Technical",
        facultyCoordinator: "Dr. B. K. Singh",
        studentLead: "Mehak Jain",
        contactEmail: "robotix@nitrr.ac.in",
        description: "The ROBOTix Club is where hardware and software collide. We are a team of enthusiasts passionate about building, programming, and competing with autonomous machines. Our projects range from line-followers and maze-solvers to advanced rovers and drones.",
        activities: [
            "Workshops on Arduino, Raspberry Pi, and sensor integration.",
            "Competing in national robotics competitions like Robocon.",
            "Building the official rover for the University Rover Challenge (URC).",
            "Hosting intra-college 'Robo-Wars' and 'Maze-Runner' events."
        ]
    },
    { 
        id: 5, 
        title: "Literati - The Literature Club", 
        summary: "Improves communication skills by hosting debates, public speaking sessions, quizzes, and literary contests.", 
        tag: "Literary",
        facultyCoordinator: "Dr. P. D. Sharma",
        studentLead: "Kabir Mehra",
        contactEmail: "literati@nitrr.ac.in",
        description: "Literati is the club for the spoken and written word. We provide a platform for students to enhance their oratory, debating, and creative writing skills. We believe that effective communication is key to leadership and success in any field.",
        activities: [
            "Weekly debate and group discussion sessions.",
            "Organizing the NITRR Model United Nations (NITRRMUN).",
            "Hosting poetry slams, storytelling events, and creative writing contests.",
            "General and technical quiz competitions."
        ]
    },
    { 
        id: 6, 
        title: "KALI - The AI Club", 
        summary: "An upcoming club focused on Artificial Intelligence, Machine Learning, and Neural Networks, driving innovation in data science.", 
        tag: "Unofficial/Upcoming",
        facultyCoordinator: "Dr. M. K. Gupta",
        studentLead: "Aisha Khan",
        contactEmail: "kali.ai@nitrr.ac.in",
        description: "KALI (Knowledgeable and Artificially Learning Intelligence) is NITRR's new-age club for data science and AI. We are a community of students exploring the frontiers of machine learning, deep learning, and data analytics. Our goal is to build projects that solve real-world problems.",
        activities: [
            "Kaggle competition participation groups.",
            "Study jams on Deep Learning (TensorFlow, PyTorch).",
            "Bootcamps on Data Visualization and Feature Engineering.",
            "Developing in-house projects using cutting-edge AI models."
        ]
    },
];

// --- Helper Component for Info ---
// A small reusable component to display info with an icon
const InfoItem = ({ icon, label, value }) => (
    <div className="flex items-center space-x-3">
        <div className="flex-shrink-0 p-2 bg-[#242424] rounded-lg border border-[#333333]">
            {icon}
        </div>
        <div>
            <p className="text-sm font-medium text-gray-500">{label}</p>
            <p className="text-base font-semibold text-white">{value}</p>
        </div>
    </div>
);


function ClubDetailPage() {
    const { clubId } = useParams(); 
    const navigate = useNavigate();
    const [club, setClub] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const foundClub = contentData.find(item => item.id == clubId);
        
        if (foundClub) {
            setClub(foundClub);
        }
        setLoading(false);
    }, [clubId]);

    if (loading) {
        return (
            <GridPageWrapper>
                <p className="text-blue-400 col-span-full text-center">Loading club details...</p>
            </GridPageWrapper>
        );
    }

    if (!club) {
        return (
             <GridPageWrapper>
                <div className="col-span-full bg-[#181818] p-8 rounded-xl border border-[#333333] min-h-[70vh] text-center">
                    <h1 className="text-4xl font-extrabold text-red-500 mb-4">
                        Club Not Found
                    </h1>
                    <p className="text-xl text-gray-400 mb-6">
                        Sorry, we couldn't find a club with ID: {clubId}
                    </p>
                    <Button onClick={() => navigate('/clubs')} variant="default" size="sm">
                        Back to Clubs
                    </Button>
                </div>
            </GridPageWrapper>
        );
    }

    // --- RENDER THE COMPLETE PAGE ---
    return (
        <GridPageWrapper>
            {/* We use max-w-5xl here for a better reading experience */}
            <div className="col-span-full max-w-5xl mx-auto bg-[#181818] p-6 sm:p-8 rounded-xl border border-[#333333]">
                
                {/* Header Section */}
                <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 mb-6 pb-6 border-b border-[#333333]">
                    <div>
                        {club.tag && (
                            <span className="text-sm font-semibold text-blue-400 bg-blue-900/30 px-3 py-1 rounded-full mb-3 inline-block">
                                {club.tag}
                            </span>
                        )}
                        <h1 className="text-4xl font-extrabold text-white">
                            {club.title}
                        </h1>
                    </div>
                    <Button onClick={() => navigate('/clubs')} variant="darkOutline" size="sm" className="w-full sm:w-auto">
                        Back to All Clubs
                    </Button>
                </div>
                
                {/* Main Content Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    
                    {/* Left Column (About & Activities) */}
                    <div className="md:col-span-2 space-y-8">
                        {/* About Section */}
                        <section>
                            <h2 className="text-2xl font-bold text-white mb-4">About the Club</h2>
                            <p className="text-lg text-gray-300 mb-4 leading-relaxed whitespace-pre-wrap">
                                {club.description}
                            </p>
                        </section>
                        
                        {/* Key Activities Section */}
                        <section>
                            <h2 className="text-2xl font-bold text-white mb-4">Key Activities</h2>
                            <ul className="space-y-3">
                                {club.activities.map((activity, index) => (
                                    <li key={index} className="flex items-start space-x-3">
                                        <Activity className="w-5 h-5 text-blue-500 mt-1 flex-shrink-0" />
                                        <span className="text-gray-300 text-base">{activity}</span>
                                    </li>
                                ))}
                            </ul>
                        </section>
                    </div>

                    {/* Right Column (Key Info) */}
                    <div className="md:col-span-1 bg-black p-6 rounded-lg border border-[#333333] h-fit sticky top-24">
                        <h3 className="text-xl font-bold text-white mb-6 border-b border-[#333333] pb-3">
                            Key Information
                        </h3>
                        <div className="space-y-5">
                            <InfoItem 
                                icon={<User className="w-5 h-5 text-blue-400" />}
                                label="Faculty Coordinator"
                                value={club.facultyCoordinator}
                            />
                            <InfoItem 
                                icon={<User className="w-5 h-5 text-blue-400" />}
                                label="Student Lead"
                                value={club.studentLead}
                            />
                            <InfoItem 
                                icon={<Mail className="w-5 h-5 text-blue-400" />}
                                label="Contact Email"
                                value={club.contactEmail}
                            />
                        </div>
                    </div>

                </div>
            </div>
        </GridPageWrapper>
    );
}

export default ClubDetailPage;