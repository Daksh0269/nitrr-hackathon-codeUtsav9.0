import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const contentData = [
    { id: 1, title: "The Technocracy", summary: "The official Technical Committee, organizing technical events and the annual technical fest AAVARTAN.", tag: "Technical", icon: "⚙️" },
    { id: 2, title: "SAHYOG", summary: "Provides constructive guidance, runs the Green Library textbook initiative, and organizes mock placements.", tag: "Mentorship", icon: "🤝" },
    { id: 3, title: "Raaga", summary: "Dedicated to fostering musical talent, organizing performances, and hosting the annual music event SHRUTI.", tag: "Cultural", icon: "🎵" },
    { id: 4, title: "ROBOTix Club", summary: "Focuses on automation, design, and programming, conducting workshops and robotics competitions.", tag: "Technical", icon: "🤖" },
    { id: 5, title: "Literati", summary: "Improves communication skills by hosting debates, public speaking sessions, quizzes, and literary contests.", tag: "Literary", icon: "✍️" },
    { id: 6, title: "KALI", summary: "An upcoming club focused on Artificial Intelligence, Machine Learning, and Neural Networks.", tag: "AI/ML", icon: "🧠" },
];

const Clubs = () => {
    const containerRef = useRef(null);

    useEffect(() => {
        let ctx = gsap.context(() => {
            // Header Reveal
            gsap.fromTo('.reveal-header', 
                { y: 40, opacity: 0 },
                { y: 0, opacity: 1, duration: 1, ease: "power3.out" }
            );

            // Staggered Cards Reveal
            gsap.fromTo('.club-card', 
                { y: 50, opacity: 0 },
                { y: 0, opacity: 1, duration: 0.8, stagger: 0.1, ease: "power2.out", scrollTrigger: { trigger: '.clubs-grid', start: "top 85%" } }
            );
        }, containerRef);

        return () => ctx.revert();
    }, []);

    return (
        <div ref={containerRef} className="min-h-screen bg-black text-white pt-24 pb-20 px-6 overflow-hidden selection:bg-blue-500/30">
            {/* Background Effects */}
            <div className="fixed top-[-10%] left-[-10%] w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[120px] pointer-events-none" />
            
            <div className="max-w-7xl mx-auto relative z-10">
                <div className="reveal-header mb-16 text-center md:text-left">
                    <p className="text-sm font-bold text-blue-400 tracking-widest mb-2 uppercase">Campus Life</p>
                    <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-4">Find your people.</h1>
                    <p className="text-gray-400 text-lg max-w-2xl">Explore the official and unofficial clubs on campus. Join communities that match your passion and grow your network.</p>
                </div>

                <div className="clubs-grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {contentData.map((club) => (
                        <div key={club.id} className="club-card group bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8 hover:bg-blue-600/10 hover:border-blue-500/40 transition-all duration-300 hover:-translate-y-2 cursor-pointer relative overflow-hidden">
                            {/* Hover Gradient Overlay */}
                            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/0 to-blue-500/0 group-hover:from-blue-500/5 group-hover:to-transparent transition-all duration-500" />
                            
                            <div className="relative z-10">
                                <div className="flex justify-between items-start mb-6">
                                    <div className="w-14 h-14 bg-black/50 border border-white/10 rounded-xl flex items-center justify-center text-2xl shadow-inner">
                                        {club.icon}
                                    </div>
                                    <span className="text-xs font-bold text-blue-300 bg-blue-900/40 px-3 py-1 rounded-full border border-blue-500/20">
                                        {club.tag}
                                    </span>
                                </div>
                                <h3 className="text-2xl font-bold mb-3 group-hover:text-blue-400 transition-colors">{club.title}</h3>
                                <p className="text-sm text-gray-400 leading-relaxed mb-8 h-16 line-clamp-3">{club.summary}</p>
                                
                                <button className="text-sm font-semibold text-white bg-white/5 hover:bg-blue-600 border border-white/10 hover:border-blue-500 py-2.5 px-5 rounded-lg w-full transition-all duration-300 flex items-center justify-center gap-2 group-hover:gap-3">
                                    View Details <span>→</span>
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default Clubs;