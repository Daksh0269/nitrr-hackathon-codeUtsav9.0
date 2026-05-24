// src/pages/Home.jsx
import React, { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { TextPlugin } from 'gsap/TextPlugin';
import { useDispatch } from 'react-redux';
// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger, TextPlugin);

/* ─────────────────────────── DATA ─────────────────────────── */
const FEATURES = [
  { title: 'Course Reviews', desc: 'Honest peer-written reviews of courses and professors.', path: '/courses', tag: 'ACADEMIC', icon: '📚' },
  { title: 'Campus Clubs', desc: 'From robotics to music — explore every club on campus.', path: '/clubs', tag: 'COMMUNITY', icon: '🚀' },
  { title: 'Attendance Tracker', desc: 'Track your subject-wise attendance for the full semester.', path: '/attendance', tag: 'ACADEMICS', icon: '📊' },
  { title: 'News & Blogs', desc: 'Campus events and stories written by students, for students.', path: '/news', tag: 'UPDATES', icon: '📰' },
];

const CLUBS = ['The Technocracy', 'SAHYOG – Mentorship', 'Raaga – Music Club', 'ROBOTix Club', 'Literati – Literature', 'KALI – The AI Club'];

/* ─────────────────────────── HOME COMPONENT ─────────────────────────── */
export default function Home() {
  const navigate = useNavigate();
  const typeRef = useRef(null);
  const containerRef = useRef(null);
  const canvasRef = useRef(null);

  useEffect(() => {
    // --------------------------------------------------------
    // 1. CANVAS PHYSICS BUBBLES
    // --------------------------------------------------------
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let animationFrameId;
    let particles = [];
    let mouse = { x: -1000, y: -1000 };

    const initParticles = () => {
      particles = [];
      // 🌟 CHANGED: Decreased the divisor from 12000 to 4000 to triple the bubble density
      const numParticles = Math.floor((window.innerWidth * window.innerHeight) / 4000); 
      for (let i = 0; i < numParticles; i++) {
        particles.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          r: Math.random() * 3 + 1,
          vx: (Math.random() - 0.5) * 0.4,
          vy: (Math.random() - 0.5) * 0.4,
          color: `rgba(59, 130, 246, ${Math.random() * 0.4 + 0.1})` 
        });
      }
    };

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      initParticles();
    };

    const drawParticles = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      particles.forEach(p => {
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0) p.x = canvas.width;
        if (p.x > canvas.width) p.x = 0;
        if (p.y < 0) p.y = canvas.height;
        if (p.y > canvas.height) p.y = 0;

        const dx = p.x - mouse.x;
        const dy = p.y - mouse.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const interactionRadius = 120; 

        if (dist < interactionRadius) {
          const force = (interactionRadius - dist) / interactionRadius;
          p.x += (dx / dist) * force * 4; 
          p.y += (dy / dist) * force * 4;
        }

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.fill();
      });

      animationFrameId = requestAnimationFrame(drawParticles);
    };

    const handleMouseMove = (e) => { mouse.x = e.clientX; mouse.y = e.clientY; };
    const handleMouseLeave = () => { mouse.x = -1000; mouse.y = -1000; };
    
    window.addEventListener('resize', resizeCanvas);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseout', handleMouseLeave);

    resizeCanvas();
    drawParticles();

    // --------------------------------------------------------
    // 2. GSAP ANIMATIONS
    // --------------------------------------------------------
    let ctxGsap = gsap.context(() => {
      const words = ["Your Community.", "Your Rules.", "Your Network.", "Your Way."];
      const tl = gsap.timeline({ repeat: -1 });
      words.forEach(word => {
        tl.to(typeRef.current, { duration: 1.5, text: word, ease: "none", delay: 0.5 })
          .to(typeRef.current, { duration: 0.5, opacity: 0, delay: 1.5 })
          .set(typeRef.current, { text: "", opacity: 1 });
      });

      gsap.utils.toArray('.reveal-up').forEach((elem) => {
        gsap.fromTo(elem, 
          { y: 40, opacity: 0 },
          { y: 0, opacity: 1, duration: 1, ease: "power3.out", scrollTrigger: { trigger: elem, start: "top 85%" } }
        );
      });

      gsap.fromTo('.feature-card', 
        { y: 50, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, stagger: 0.15, ease: "power2.out", scrollTrigger: { trigger: '#features-grid', start: "top 80%" } }
      );

      gsap.to('.marquee-track', {
        xPercent: -50,
        ease: "none",
        duration: 20,
        repeat: -1
      });
    }, containerRef);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', resizeCanvas);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseout', handleMouseLeave);
      ctxGsap.revert(); 
    };
  }, []);

  return (
    <div ref={containerRef} className="relative min-h-screen bg-black text-white font-sans overflow-x-hidden overflow-y-auto selection:bg-blue-500/30">
      
      <canvas 
        ref={canvasRef} 
        className="fixed inset-0 z-0 pointer-events-none"
      />
      
      {/* ══════════════ HERO ══════════════ */}
      <section className="relative z-10 min-h-screen flex items-center justify-center px-6 pt-20 overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[400px] h-[400px] bg-cyan-500/5 rounded-full blur-[100px] pointer-events-none" />

        <div className="relative z-10 max-w-5xl mx-auto text-center reveal-up">
          <div className="inline-flex items-center gap-2 bg-blue-600/10 border border-blue-500/30 rounded-full px-4 py-1.5 mb-8 backdrop-blur-sm">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            <span className="text-xs font-semibold text-blue-300 tracking-wider">COLLEGE COMMUNITY PLATFORM</span>
          </div>

          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight leading-tight mb-6 drop-shadow-lg">
            Your Campus.<br />
            <span ref={typeRef} className="bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent"></span>
            <span className="animate-pulse text-blue-500">|</span>
          </h1>

          <p className="max-w-2xl mx-auto text-lg text-gray-400 mb-10 drop-shadow-md">
            One platform for course reviews, campus clubs, attendance tracking, and everything your college life needs — built by students, for students.
          </p>

          <div className="flex justify-center gap-4 flex-wrap">
            <button onClick={() => navigate('/courses')} className="px-8 py-3 bg-blue-600 hover:bg-blue-700 transition-all rounded-lg font-medium shadow-[0_0_20px_rgba(37,99,235,0.3)] hover:-translate-y-1">
              Explore Courses
            </button>
            <button onClick={() => navigate('/register')} className="px-8 py-3 bg-black/50 backdrop-blur-md border border-gray-600 hover:border-gray-400 transition-all rounded-lg font-medium hover:-translate-y-1">
              Join for Free
            </button>
          </div>
        </div>
      </section>

      {/* ══════════════ FEATURES ══════════════ */}
      <section className="relative z-10 max-w-6xl mx-auto px-6 py-24 border-t border-blue-900/30 bg-black/60 backdrop-blur-sm overflow-hidden">
        <div className="mb-16 reveal-up text-center md:text-left">
          <p className="text-sm font-bold text-blue-400 tracking-widest mb-2 uppercase">Everything you need</p>
          <h2 className="text-4xl md:text-5xl font-bold">Built for students,<br />by students.</h2>
        </div>

        <div id="features-grid" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {FEATURES.map((f, i) => (
            <div key={i} onClick={() => navigate(f.path)} className="feature-card cursor-pointer group bg-black/40 backdrop-blur-md border border-white/10 rounded-2xl p-6 hover:bg-blue-900/20 hover:border-blue-500/40 transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_10px_30px_rgba(37,99,235,0.1)]">
              <div className="flex justify-between items-start mb-6">
                <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center text-2xl border border-blue-500/20">{f.icon}</div>
                <span className="text-xs font-bold text-blue-300 bg-blue-900/40 px-2 py-1 rounded">{f.tag}</span>
              </div>
              <h3 className="text-xl font-bold mb-2 group-hover:text-blue-400 transition-colors">{f.title}</h3>
              <p className="text-sm text-gray-400 leading-relaxed mb-6">{f.desc}</p>
              <div className="text-sm font-semibold text-blue-400 flex items-center gap-2 group-hover:gap-4 transition-all">
                Explore <span>→</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ══════════════ CLUBS MARQUEE ══════════════ */}
      {/* 🌟 CHANGED: Added w-full and strict overflow-hidden directly around the expanding child elements */}
      <section className="relative z-10 py-20 bg-black/80 backdrop-blur-md border-y border-white/5 reveal-up overflow-hidden w-full">
        <p className="text-center text-xs font-bold text-gray-500 tracking-[0.2em] uppercase mb-10">Our Campus Clubs</p>
        
        {/* Ensures the 200% width child doesn't leak out of the layout bounds */}
        <div className="w-full overflow-hidden">
          <div className="flex w-[200%]">
            <div className="marquee-track flex w-full justify-around items-center gap-10 pr-10">
              {[...CLUBS, ...CLUBS, ...CLUBS].map((name, i) => (
                <div key={i} className="flex items-center gap-4 text-xl md:text-2xl font-bold text-gray-600 whitespace-nowrap hover:text-blue-400 transition-colors cursor-default">
                  <span className="w-2 h-2 rounded-full bg-blue-600/50" />
                  {name}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════ CTA ══════════════ */}
      <section className="relative z-10 max-w-3xl mx-auto px-6 py-32 text-center reveal-up overflow-hidden">
        <h2 className="text-4xl md:text-5xl font-bold mb-6 drop-shadow-md">Ready to make the most of your college?</h2>
        <p className="text-gray-400 text-lg mb-10 drop-shadow-md">Join your peers on the platform that actually helps you navigate campus life — from day one to graduation.</p>
        <div className="flex justify-center gap-4">
          <button onClick={() => navigate('/register')} className="px-8 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg font-medium transition-all shadow-lg hover:-translate-y-1">Create Account</button>
        </div>
      </section>
    </div>
  );
}