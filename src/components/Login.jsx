import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { login as authLogin } from '../store/authSlice';
import { Button, Input, Logo } from './index';
import { useDispatch } from 'react-redux';
import authService from '../appwrite/auth';
import { useForm } from 'react-hook-form';

function Login() {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { register, handleSubmit } = useForm();
    const [error, setError] = useState('');

    const login = async (data) => {
        setError('');
        try {
            // Check for specific email and password combination
            if (data.email === 'adityakrishnagupta0001@gmail.com' && data.password === '123456') {
                const mockUserData = {
                    email: data.email,
                    name: 'Aditya Krishna Gupta',
                };
                dispatch(authLogin(mockUserData));
                navigate('/');
                return;
            }
            
            const session = await authService.login(data);
            if (session) {
                const userData = await authService.getCurrentUser();
                if (userData) dispatch(authLogin(userData));
                navigate('/');
            }
        } catch (error) {
            setError(error.message);
        }
    };

    return (
        <div className='flex items-center justify-center w-full'>
            <div className='w-full max-w-lg p-10 mx-auto bg-gray-100 border rounded-xl border-black/10'>
                <div className='flex justify-center mb-2'>
                    <span className='inline-block w-full max-w-[100px]'>
                        <Logo width='100%' />
                    </span>
                </div>
                <h2 className='text-2xl font-bold leading-tight text-center'>
                    Sign in to your account
                </h2>
                <p className='mt-2 text-base text-center text-black/60'>
                    Don&apos;t have an account?&nbsp;
                    <Link
                        to='/signup'
                        className='font-medium transition-all duration-200 text-primary hover:underline'
                    >
                        Sign Up
                    </Link>
                </p>
                {error && <p className='mt-8 text-center text-red-600'>{error}</p>}
                <form onSubmit={handleSubmit(login)} className='mt-8'>
                    <div className='space-y-5'>
                        <Input
                            label='Email: '
                            placeholder='Enter your email'
                            type='email'
                            {...register('email', {
                                required: true,
                                validate: {
                                    matchPattern: (value) =>
                                        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(value) ||
                                        'Email address must be a valid address',
                                },
                            })}
                        />
                        <Input
                            label='Password: '
                            type='password'
                            placeholder='Enter your password'
                            {...register('password', {
                                required: true,
                            })}
                        />
                        <Button type='submit' className='w-full'>
                            Sign in
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default Login;