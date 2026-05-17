import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Service from '../../appwrite/config';
import GridPageWrapper from '../../LayoutUI/ClubsUI/GridWrapper';
import Button from '../../LayoutUI/components/Button';
import { Download, User, AlertCircle } from 'lucide-react'; //

/**
 * A simple card to display a Note. (CORRECTED URL Check)
 */
const NoteCard = ({ title, subject, username, fileId }) => {

    const [downloadUrl, setDownloadUrl] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        // Clear previous state
        setError(null);
        setDownloadUrl(null);
        // console.log(`[NoteCard "${title}"] Effect Start. fileId: "${fileId}"`);

        if (!fileId || typeof fileId !== 'string' || fileId.trim() === '') {
            console.error(`[NoteCard "${title}"] Invalid fileId: "${fileId}".`);
            setError("Invalid File ID");
            return;
        }

        try {
            // console.log(`[NoteCard "${title}"] Attempting Service.getFileDownload with fileId: "${fileId}"`);
            const urlObject = Service.getFileDownload(fileId); //

            // *** CORRECTED CHECK ***
            // The method returns a URL object directly. Check if it's truthy.
            if (urlObject) {
                console.log(`[NoteCard "${title}"] SUCCESS! Generated URL Object:`, urlObject);
                console.log(`[NoteCard "${title}"] Setting URL: ${urlObject.href}`);
                setDownloadUrl(urlObject); // Extract the href string
            } else {
                 // This case means the SDK method itself returned null/undefined, which is unexpected.
                console.error(`[NoteCard "${title}"] UNEXPECTED! Service.getFileDownload returned null/undefined for fileId "${fileId}".`);
                setError("URL generation failed");
            }
        } catch (err) {
            // Catch SDK errors (Permissions / Not Found etc.)
            console.error(`[NoteCard "${title}"] EXCEPTION during Service.getFileDownload for fileId "${fileId}":`, err);

             if (err.message && (err.message.toLowerCase().includes('permission') || err.code === 401 || err.code === 403)) {
                 setError("Check Permissions");
                 console.error(`[NoteCard "${title}"] Suggestion: Verify 'role:all' has Read Access on the Appwrite Storage bucket.`);
             } else if (err.message && (err.message.toLowerCase().includes('not found') || err.code === 404)) {
                 setError("File Not Found");
             } else {
                 setError("Fetch Error");
             }
            setDownloadUrl(null);
        }
        // console.log(`[NoteCard "${title}"] Effect End.`);

    }, [fileId, title]);

    // Helper function to create a safe filename
    const createSafeFilename = (name) => {
        if (!name) return 'download';
        return name.replace(/[^a-zA-Z0-9_.-]/g, '_');
    }

    return (
        <div className="bg-[#181818] rounded-xl border border-[#333333] p-5
                        flex flex-col h-full transition-all duration-300 hover:border-blue-600">

            <span className="text-xs font-semibold text-blue-400 bg-blue-900/30
                             px-2 py-0.5 rounded-full mb-2 self-start">
                {subject}
            </span>

            <h3 className="text-xl font-bold text-white mb-2 leading-tight break-words">{title}</h3>

            <div className="flex items-center space-x-2 text-gray-400 text-sm flex-grow mb-4">
                <User className="w-4 h-4" />
                <span>Uploaded by {username}</span>
            </div>

            <div className="mt-auto pt-3">
                {error ? (
                    <div className="flex items-center justify-center text-red-500 text-sm font-semibold p-2 bg-red-900/20 rounded">
                        <AlertCircle className="w-4 h-4 mr-2 flex-shrink-0"/>
                        <span>Error: {error}</span>
                    </div>
                ) : (
                    <Button
                        asChild
                        href={downloadUrl}
                        download={createSafeFilename(title)}
                        variant="darkOutline"
                        size="sm"
                        className="w-full"
                        icon={<Download className="w-4 h-4" />}
                        disabled={!downloadUrl}
                        title={downloadUrl ? `Download ${title}` : 'Generating download link...'}
                    >
                        {downloadUrl ? 'Download Note' : 'Loading...'}
                    </Button>
                )}
            </div>
        </div>
    );
};


// --- NotesPage component remains unchanged ---
function NotesPage() {
    const [notes, setNotes] = useState([]); //
    const [loading, setLoading] = useState(true); //
    const [error, setError] = useState(null); //
    const navigate = useNavigate(); //

    useEffect(() => {
        setLoading(true);
        Service.getNotes() //
            .then(fetchedNotes => {
                const validNotes = fetchedNotes.filter(note => note.fileId && typeof note.fileId === 'string' && note.fileId.trim() !== '');
                if(fetchedNotes.length !== validNotes.length) {
                    console.warn("NotesPage: Some notes were filtered out due to missing or invalid fileId.");
                }
                setNotes(validNotes);
            })
            .catch(err => {
                console.error("NotesPage Error: Failed to load notes:", err);
                setError("Failed to load notes.");
            })
            .finally(() => setLoading(false));
    }, []);

    if (loading) {
        return <div className="min-h-screen bg-black text-white text-center p-10">Loading notes...</div>;
    }

    if (error) {
        return <div className="min-h-screen bg-black text-red-500 text-center p-10">{error}</div>;
    }

    return (
        <GridPageWrapper minCardWidth={300}> {/* */}
            <div className="col-span-full mb-4 flex justify-between items-center">
                <h1 className="text-3xl font-bold text-white">Student Notes</h1>
                <Button variant="default" onClick={() => navigate('/upload-note')}> {/* */}
                    Upload Your Notes
                </Button>
            </div>

            {notes.length > 0 ? (
                notes.map(note => (
                    <NoteCard
                        key={note.$id}
                        title={note.title} //
                        subject={note.subject} //
                        username={note.username} //
                        fileId={note.fileId} //
                    />
                ))
            ) : (
                <div className="text-white text-center col-span-full pt-10"> {/* */}
                    <p className="text-2xl font-bold mb-2">No Notes Found</p>
                    <p className="text-gray-400">Be the first to upload!</p>
                </div>
            )}
        </GridPageWrapper>
    );
}

export default NotesPage;