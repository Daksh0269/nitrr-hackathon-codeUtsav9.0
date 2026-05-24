import React, { useState, useEffect, useRef, useLayoutEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { setNotes } from '../../features/notesSlice'; 
import Service from '../../appwrite/config';
import gsap from 'gsap';
import { Download, User, AlertCircle, FileText, Plus, Search, X } from 'lucide-react';

/* ─────────────────────────── NOTE CARD COMPONENT ─────────────────────────── */
const NoteCard = ({ title, subject, username, fileId }) => {
    const [downloadUrl, setDownloadUrl] = useState(null);
    const [error, setError] = useState(null);

    // This is the download effect that specifically belongs to the NoteCard
    useEffect(() => {
        setError(null);
        setDownloadUrl(null);

        if (!fileId || typeof fileId !== 'string' || fileId.trim() === '') {
            setError("Invalid File ID");
            return;
        }

        try {
            const urlResult = Service.getFileDownload(fileId);
            if (urlResult) {
                // Bulletproof check for both string URLs and URL objects
                const finalUrl = urlResult.href ? urlResult.href : urlResult.toString();
                setDownloadUrl(finalUrl);
            } else {
                setError("URL generation failed");
            }
        } catch (err) {
            if (err.message && (err.message.toLowerCase().includes('permission') || err.code === 401 || err.code === 403)) {
                setError("Check Permissions");
            } else if (err.message && (err.message.toLowerCase().includes('not found') || err.code === 404)) {
                setError("File Not Found");
            } else {
                setError("Fetch Error");
            }
            setDownloadUrl(null);
        }
    }, [fileId, title]);

    const createSafeFilename = (name) => {
        if (!name) return 'download';
        return name.replace(/[^a-zA-Z0-9_.-]/g, '_');
    }

    return (
        <div className="note-card group bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 hover:bg-blue-600/10 hover:border-blue-500/40 transition-all duration-300 flex flex-col h-full hover:-translate-y-1 hover:shadow-[0_10px_30px_rgba(37,99,235,0.1)]">
            
            <div className="flex justify-between items-start mb-4">
                <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center border border-blue-500/20 text-blue-400 group-hover:scale-110 transition-transform">
                    <FileText className="w-6 h-6" />
                </div>
                <span className="text-xs font-bold text-blue-300 bg-blue-900/40 px-3 py-1 rounded-full border border-blue-500/20 shadow-inner">
                    {subject}
                </span>
            </div>

            <h3 className="text-xl font-bold text-white mb-3 leading-tight break-words group-hover:text-blue-400 transition-colors">
                {title}
            </h3>

            <div className="flex items-center space-x-2 text-gray-400 text-sm flex-grow mb-6">
                <User className="w-4 h-4 text-gray-500" />
                <span>Uploaded by <span className="text-gray-300 font-medium">{username}</span></span>
            </div>

            <div className="mt-auto pt-4 border-t border-white/5">
                {error ? (
                    <div className="flex items-center justify-center text-red-400 text-sm font-medium p-3 bg-red-500/10 border border-red-500/20 rounded-xl">
                        <AlertCircle className="w-4 h-4 mr-2 flex-shrink-0"/>
                        <span>{error}</span>
                    </div>
                ) : (
                    <a
                        href={downloadUrl || '#'}
                        download={downloadUrl ? createSafeFilename(title) : false}
                        className={`flex items-center justify-center gap-2 w-full py-3 px-4 rounded-xl text-sm font-semibold transition-all duration-300 ${
                            downloadUrl 
                            ? 'bg-white/5 text-white hover:bg-blue-600 hover:shadow-[0_0_15px_rgba(37,99,235,0.4)] border border-white/10 hover:border-blue-500' 
                            : 'bg-white/5 text-gray-500 cursor-not-allowed border border-white/5'
                        }`}
                        title={downloadUrl ? `Download ${title}` : 'Generating link...'}
                    >
                        <Download className={`w-4 h-4 ${downloadUrl ? 'animate-bounce' : ''}`} />
                        {downloadUrl ? 'Download Note' : 'Loading...'}
                    </a>
                )}
            </div>
        </div>
    );
};

/* ─────────────────────────── MAIN NOTES PAGE ─────────────────────────── */
function NotesPage() {
    const dispatch = useDispatch();
    const { notes, notesLoaded } = useSelector((state) => state.notes);
    
    const [loading, setLoading] = useState(!notesLoaded); 
    const [error, setError] = useState(null); 
    const [searchQuery, setSearchQuery] = useState(""); 
    const navigate = useNavigate(); 
    const containerRef = useRef(null);

    // 1. Data Fetching via Redux
    useEffect(() => {
        if (notesLoaded) {
            setLoading(false);
            return;
        }

        setLoading(true);
        Service.getNotes() 
            .then(fetchedNotes => {
                const validNotes = fetchedNotes.filter(note => note.fileId && typeof note.fileId === 'string' && note.fileId.trim() !== '');
                dispatch(setNotes(validNotes));
            })
            .catch(err => {
                console.error("NotesPage Error: Failed to load notes:", err);
                setError("Failed to load notes.");
            })
            .finally(() => setLoading(false));
    }, [notesLoaded, dispatch]);

    // 2. Real-time Search Filtering
    const filteredNotes = notes.filter(note => {
        const query = searchQuery.toLowerCase();
        return (
            (note.title && note.title.toLowerCase().includes(query)) ||
            (note.subject && note.subject.toLowerCase().includes(query)) ||
            (note.username && note.username.toLowerCase().includes(query))
        );
    });

    // 3. GSAP Animations
    useLayoutEffect(() => {
        if (loading || error) return;
        
        let ctx = gsap.context(() => {
            gsap.fromTo('.reveal-header', 
                { y: 30, opacity: 0 }, 
                { y: 0, opacity: 1, duration: 0.8, ease: "power3.out" }
            );
            
            gsap.fromTo('.note-card', 
                { y: 40, opacity: 0 }, 
                { y: 0, opacity: 1, duration: 0.6, stagger: 0.05, ease: "power2.out" }
            );
        }, containerRef);
        
        return () => ctx.revert();
    }, [loading, error, notes, searchQuery]);

    if (loading) {
        return (
            <div className="min-h-screen bg-black flex flex-col justify-center items-center">
                <div className="w-12 h-12 border-4 border-blue-600/30 border-t-blue-500 rounded-full animate-spin mb-4" />
                <p className="text-blue-400 font-medium tracking-widest text-sm uppercase animate-pulse">Fetching Notes...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-black flex justify-center items-center">
                <div className="bg-red-500/10 border border-red-500/30 p-6 rounded-xl text-center max-w-md">
                    <AlertCircle className="w-10 h-10 text-red-400 mx-auto mb-3" />
                    <p className="text-xl text-white font-bold mb-2">Error</p>
                    <p className="text-gray-400 text-sm">{error}</p>
                </div>
            </div>
        );
    }

    return (
        <div ref={containerRef} className="min-h-screen bg-black text-white pt-24 pb-20 px-6 overflow-hidden selection:bg-blue-500/30 relative">
            
            <div className="fixed top-[10%] right-[-5%] w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[150px] pointer-events-none" />
            <div className="fixed bottom-[-10%] left-[-10%] w-[600px] h-[600px] bg-cyan-600/10 rounded-full blur-[150px] pointer-events-none" />

            <div className="max-w-7xl mx-auto relative z-10">
                
                <div className="reveal-header mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-white/5 pb-8">
                    <div className="flex-1">
                        <p className="text-sm font-bold text-blue-400 tracking-widest mb-2 uppercase">Study Materials</p>
                        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-6">Student Notes.</h1>
                        
                        <div className="relative max-w-xl group">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                <Search className="w-5 h-5 text-gray-400 group-focus-within:text-blue-400 transition-colors" />
                            </div>
                            <input 
                                type="text"
                                placeholder="Search by title, subject, or uploader..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full bg-white/5 border border-white/10 rounded-xl py-3.5 pl-12 pr-10 text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 focus:bg-white/10 transition-all backdrop-blur-sm"
                            />
                            {searchQuery && (
                                <button 
                                    onClick={() => setSearchQuery("")}
                                    className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-white transition-colors"
                                >
                                    <X className="w-4 h-4" />
                                </button>
                            )}
                        </div>
                    </div>

                    <button 
                        onClick={() => navigate('/upload-note')}
                        className="px-6 py-3.5 bg-blue-600 hover:bg-blue-700 transition-all rounded-xl font-medium text-sm shadow-[0_0_15px_rgba(37,99,235,0.3)] hover:-translate-y-1 flex items-center justify-center gap-2 whitespace-nowrap h-fit"
                    >
                        <Plus className="w-4 h-4" />
                        Upload Notes
                    </button>
                </div>

                {notes.length === 0 ? (
                    <div className="reveal-header text-center py-24 bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl border-dashed">
                        <FileText className="w-12 h-12 text-gray-600 mx-auto mb-4" />
                        <p className="text-2xl font-bold mb-2">No Notes Found</p>
                        <p className="text-gray-400 max-w-md mx-auto mb-6">The database is currently empty. Be the first to help out your classmates!</p>
                        <button 
                            onClick={() => navigate('/upload-note')}
                            className="text-sm text-blue-400 hover:text-white transition-colors font-medium border border-blue-500/30 hover:border-white/50 py-2 px-6 rounded-lg"
                        >
                            Upload a Note Now
                        </button>
                    </div>
                ) : filteredNotes.length === 0 ? (
                    <div className="reveal-header text-center py-20 bg-white/5 border border-white/10 rounded-2xl">
                        <Search className="w-10 h-10 text-gray-600 mx-auto mb-4" />
                        <p className="text-xl font-bold mb-2">No matches found</p>
                        <p className="text-gray-400 text-sm">We couldn't find any notes matching "{searchQuery}"</p>
                        <button 
                            onClick={() => setSearchQuery("")}
                            className="mt-6 text-sm text-blue-400 hover:text-white transition-colors font-medium"
                        >
                            Clear search
                        </button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {filteredNotes.map(note => (
                            <NoteCard
                                key={note.$id}
                                title={note.title} 
                                subject={note.subject} 
                                username={note.username} 
                                fileId={note.fileId} 
                            />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

export default NotesPage;