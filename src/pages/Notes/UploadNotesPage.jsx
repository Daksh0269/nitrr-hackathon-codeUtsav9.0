import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import Input from '../../LayoutUI/components/Input';
import Button from '../../LayoutUI/components/Button';
import Service from '../../appwrite/config';

// A simple file input component styled to match
const FileInput = React.forwardRef(({ label, ...props }, ref) => (
    <div>
        {label && <label className="block text-sm font-medium text-gray-400 mb-1">{label}</label>}
        <input
            type="file"
            ref={ref}
            className="w-full text-sm text-gray-400
                       file:mr-4 file:py-2 file:px-4
                       file:rounded-lg file:border-0
                       file:text-sm file:font-semibold
                       file:bg-blue-600 file:text-white
                       hover:file:bg-blue-700"
            {...props}
        />
    </div>
));
FileInput.displayName = "FileInput";


function UploadNotePage() {
    const { register, handleSubmit, formState: { errors } } = useForm();
    const navigate = useNavigate();
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    
    // Get user data from Redux
    const userData = useSelector((state) => state.auth.userData);

    const submitNote = async (data) => {
        setError(null);
        setLoading(true);

        if (!data.file || data.file.length === 0) {
            setError("Please select a file to upload.");
            setLoading(false);
            return;
        }

        try {
            // 1. Upload the file first
            const uploadedFile = await Service.uploadFile(data.file[0]);

            if (uploadedFile) {
                // 2. If file upload is successful, create the note document
                const noteData = {
                    title: data.title,
                    subject: data.subject,
                    userId: userData.$id,
                    username: userData.name,
                    fileId: uploadedFile.$id, // Link the file ID
                };

                const dbPost = await Service.createNote(noteData);

                if (dbPost) {
                    // Success! Navigate to the main notes page
                    navigate('/notes');
                } else {
                    setError("Failed to save note details to the database.");
                }
            } else {
                setError("File upload failed. Please try again.");
            }
        } catch (err) {
            console.error("Note submission error:", err);
            setError(err.message || "An unexpected error occurred.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex justify-center min-h-screen bg-black py-12">
            <div className="bg-[#181818] p-8 rounded-2xl border border-[#333333] shadow-2xl w-full max-w-lg">
                <h1 className="text-2xl font-bold text-white mb-6">Upload Notes</h1>
                
                {error && (
                    <div className="mb-4 text-red-400 text-sm text-center font-medium bg-red-900/30 p-2 rounded">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit(submitNote)} className="space-y-6">
                    
                    <Input
                        label="Note Title"
                        placeholder="e.g., Physics - Unit 1 PYQs"
                        {...register("title", { required: "Title is required" })}
                    />
                    {errors.title && <p className="text-red-400 text-xs">{errors.title.message}</p>}
                    
                    <Input
                        label="Subject"
                        placeholder="e.g., Physics, Maths, BEEE"
                        {...register("subject", { required: "Subject is required" })}
                    />
                    {errors.subject && <p className="text-red-400 text-xs">{errors.subject.message}</p>}

                    <FileInput
                        label="Upload File (PDF, PNG, etc.)"
                        {...register("file", { required: "A file is required" })}
                    />
                    {errors.file && <p className="text-red-400 text-xs">{errors.file.message}</p>}

                    <Button
                        type="submit"
                        variant="default"
                        size="lg"
                        loading={loading}
                        className="w-full mt-6"
                    >
                        {loading ? 'Uploading...' : 'Submit Note'}
                    </Button>
                </form>
            </div>
        </div>
    );
}

export default UploadNotePage;