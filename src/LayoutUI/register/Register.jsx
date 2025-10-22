import React from 'react';
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import authService from '../../appwrite/auth';
import { useForm } from 'react-hook-form';
import Button from '../components/Button'; // Assuming Button component path
import Input from '../components/Input'; // Assuming Input component path
import { login } from '../../features/authSlice';

// --- Icon Components (Keeping GitHub and Google from original code for consistency) ---
const GitHubIcon = () => (
    <svg viewBox="0 0 24 24" fill="currentColor" height="1em" width="1em">
        <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.43 9.8 8.23 11.38.6.11.82-.26.82-.57 0-.28-.01-1.01-.01-2.02-3.33.72-4.04-1.61-4.04-1.61-.54-1.36-1.32-1.72-1.32-1.72-1.08-.74.08-.72.08-.72 1.2.08 1.83 1.23 1.83 1.23 1.07 1.83 2.81 1.3 3.49.99.11-.77.42-1.3.76-1.6-2.67-.3-5.46-1.33-5.46-5.92 0-1.31.47-2.38 1.23-3.22-.13-.3-.53-1.52.13-3.18 0 0 1-.32 3.3 1.22.95-.26 1.95-.39 2.95-.39 1 0 2.01.13 2.95.39 2.3-1.54 3.3-1.22 3.3-1.22.66 1.66.27 2.88.13 3.18.76.84 1.23 1.91 1.23 3.22 0 4.6-2.8 5.61-5.47 5.91.43.37.82 1.12.82 2.26 0 1.63-.01 2.94-.01 3.34 0 .31.21.68.83.57C20.57 21.8 24 17.31 24 12c0-6.63-5.37-12-12-12z" />
    </svg>
);

const GoogleIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" height="1em" width="1em">
        <path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"/>
        <path fill="#FF3D00" d="M6.306,14.691l6.096,4.672C14.19,16.297,16.507,15,19,15c-3.186,0-6.175,1.751-7.79,4.428L6.306,14.691z"/>
        <path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.626-3.328-11.378-7.957l-6.096,4.672C8.683,38.749,15.293,44,24,44z"/>
        <path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.122-4.08,5.558c-.021-.02-.042-.04-.063-.062l-5.657,5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"/>
    </svg>
);
// -----------------------------------------------------------------------------------


function Register() {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [error, setError] = useState(null);
    
    const { register, handleSubmit } = useForm();

    const signUp = async (data) => {
        setError(null);
        try {
            const created = await authService.createAccount(data);
            if (!created) {
                setError('Account creation failed on server. Please try logging in.');
                return;
            }

            const session = await authService.Login({ email: data.email, password: data.password });
            if (!session) {
                setError('Account created but failed to create session. Try logging in.');
                return;
            }

            const userData = await authService.getCurrentUser();
            if (!userData) {
                setError('Account created but failed to fetch user profile. Try logging in.');
                return;
            }

            dispatch(login({ userData }));
            navigate('/loggedin');
        } catch (err) {
            console.error('Error creating account:', err);
            const errorMessage = err?.message || 'Failed to create account. Please try again.';
            setError(errorMessage);
        }
    };

    const handleSocialLogin = (provider) => {
        setError(null);
        try {
            if (provider === 'google') {
                authService.loginWithGoogle();
            } else if (provider === 'github') {
                authService.loginWithGithub(); 
            }
        } catch (err) {
            console.error(`Error during ${provider} login:`, err);
            setError(`Failed to initiate ${provider} login.`);
        }
    };

    return (
        // Global background: bg-black for full dark-mode
        <div className="flex items-center justify-center min-h-screen bg-black p-4"> 
            
            {/* Form Container: Max width set to small, padding scales */}
            <div className="bg-[#181818] p-6 sm:p-8 rounded-2xl border border-[#333333] shadow-2xl w-full max-w-sm">
                
                {/* Heading */}
                <h1 className="text-3xl font-extrabold text-white mb-2 text-center">Create an account</h1>
                <p className="text-gray-400 mb-8 text-sm text-center">Enter your email below to create your account</p>

                {error && (
                    <div className="mb-6 text-red-400 text-sm text-center font-medium bg-red-900/30 p-2 rounded">
                        {error}
                    </div>
                )}

                {/* Social Login Buttons (Responsive Flex) */}
                <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4 mb-6">
                    <Button
                        type="button"
                        variant="darkOutline"
                        size="default" 
                        className="flex-1" // Ensures full width on mobile, even width on desktop
                        icon={<GitHubIcon />}
                        onClick={() => handleSocialLogin('github')}
                    >
                        GitHub
                    </Button>
                    <Button
                        type="button"
                        variant="darkOutline"
                        size="default"
                        className="flex-1" // Ensures full width on mobile, even width on desktop
                        icon={<GoogleIcon />}
                        onClick={() => handleSocialLogin('google')}
                    >
                        Google
                    </Button>
                </div>

                {/* Separator */}
                <div className="flex items-center my-6">
                    <div className="flex-grow border-t border-[#333333]"></div>
                    <span className="flex-shrink mx-4 text-gray-500 text-sm">Or continue with</span>
                    <div className="flex-grow border-t border-[#333333]"></div>
                </div>

                <form onSubmit={handleSubmit(signUp)} className="space-y-4">
                    
                    {/* Email Input */}
                    <Input
                        label="Email" 
                        type="email"
                        {...register('email', {
                            required: true,
                            validate: {
                                matchPatern: (value) =>
                                    /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(value) ||
                                    'Enter a valid email address',
                            },
                        })}
                        placeholder="email@example.com" 
                    />
                    
                    {/* Password Input */}
                    <Input
                        label="Password"
                        type="password"
                        {...register('password', { required: true })}
                        placeholder="Password" 
                    />

                    {/* Create Account Button (Primary Blue) */}
                    <Button
                        type="submit"
                        variant="default" 
                        size="lg"
                        className="w-full mt-6"
                    >
                        Create Account
                    </Button>
                </form>

                {/* Login Link */}
                <p className="mt-8 text-center text-gray-500 text-sm">
                    Already have an account?{' '}
                    <Link to="/login" className="text-blue-500 hover:text-blue-400 hover:underline transition-colors duration-200 font-medium">
                        Login
                    </Link>
                </p>
            </div>
        </div>
    );
}

export default Register;