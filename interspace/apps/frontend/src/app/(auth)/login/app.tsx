"use client";
import React, { useState } from 'react';
import { LogIn, UserPlus, ChevronRight, Rocket } from 'lucide-react';
import Image from 'next/image';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { Bounce, ToastContainer, toast } from 'react-toastify';

interface SignupInput {
    username?: string;
    password: string;
    type: "admin" | "user";
}

function Login() {
    const [isLogin, setIsLogin] = useState(true);
    const [authFields, setAuthFields] = useState<SignupInput>({
        username: "",
        type: "user",
        password: ""
    });

    const navigate = useRouter();


    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        if (isLogin) {
            try {
                const response = await axios.post(`https://swayamagrahari.com.np/api/v1/signin`, {
                    username: authFields.username,
                    password: authFields.password
                })
                if (response.status === 200) {
                    const token = response.data.token
                    if (!token) {
                        console.log("Token must be provided")
                        return
                    }
                    localStorage.setItem('token', `Bearer ${token}`)
                    navigate.push("/")
                }
            } catch (error) {
                console.log(error)
            }
        }
        else {
            try {
                const response = await axios.post(`https://swayamagrahari.com.np/api/v1/signup`, {
                    username: authFields.username,
                    type: authFields.type,
                    password: authFields.password
                })
                if (response.status === 200) {
                    const userId = response.data.userId
                    if (!userId) {
                        console.log("userId is not there")
                        return
                    }
                    localStorage.setItem('userId', userId)


                    toast.success("User Signed Up", {
                        position: "top-right",
                        autoClose: 5000,
                        hideProgressBar: false,
                        closeOnClick: false,
                        pauseOnHover: true,
                        draggable: true,
                        progress: undefined,
                        theme: "dark",
                        transition: Bounce,
                    });


                }
            } catch (error) {
                console.log(error)
                toast.error("User already exists ")
            }

        }
    }



    return (
        <div className="min-h-screen w-full flex">
            <div className='text-white right-0 absolute p-4'>
                <ToastContainer
                    position="top-right"
                    autoClose={5000}
                    hideProgressBar={false}
                    newestOnTop={false}
                    closeOnClick={false}
                    rtl={false}
                    pauseOnFocusLoss
                    draggable
                    pauseOnHover
                    theme="dark"
                    transition={Bounce}
                    aria-label={"sasas"} /></div>
            {/* Left Section - Hero Image */}
            <div className="hidden lg:flex w-1/2 relative  ">

                <Image
                    src="/assets/signup.jpg"
                    alt="Signup"
                    layout="object-cover"
                    width={800}
                    height={800}
                    className="inset-0 absolute z-1 rounded-lg  w-full h-full object-cover "
                />
                <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-transparent" />
                <div className="relative z-10 p-12 flex flex-col justify-center">

                </div>
            </div>

            {/* Right Section - Auth Form */}
            <div className="w-full lg:w-1/2 flex items-center justify-center bg-[#0A0B1E] p-8">

                <div className="w-full max-w-md">

                    <div className="text-center mb-8">
                        <div className="flex items-center justify-center mb-4">
                            <Rocket className="w-10 h-10 text-blue-500" />
                        </div>
                        <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500">
                            Interspace
                        </h2>
                    </div>

                    {/* Auth Toggle */}
                    <div className="bg-gray-900/50 p-1 rounded-lg flex mb-8">
                        <button
                            onClick={() => setIsLogin(true)}
                            className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-md transition-all ${isLogin
                                ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white'
                                : 'text-gray-400 hover:text-white'
                                }`}
                        >
                            <LogIn className="w-4 h-4" />
                            Login
                        </button>
                        <button
                            onClick={() => { setIsLogin(false) }}
                            className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-md transition-all ${!isLogin
                                ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white'
                                : 'text-gray-400 hover:text-white'
                                }`}
                        >
                            <UserPlus className="w-4 h-4" />
                            Sign Up
                        </button>
                    </div>

                    {/* Auth Form */}
                    <form onSubmit={(e) => { handleSubmit(e) }} className="space-y-4">

                        <div>
                            <label className="block text-gray-400 text-sm mb-2">
                                Username
                            </label>
                            <input
                                type="text"
                                className="w-full px-4 py-3 rounded-lg bg-gray-900/50 border border-gray-800 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                placeholder="Enter your username"
                                onChange={(e) => {
                                    setAuthFields(c => ({
                                        ...c,
                                        username: e.target.value
                                    }))
                                }}
                            />
                        </div>


                        <div>
                            <label className="block text-gray-400 text-sm mb-2">Password</label>
                            <input
                                type="password"
                                className="w-full px-4 py-3 rounded-lg bg-gray-900/50 border border-gray-800 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                placeholder="Enter your password"
                                onChange={(e) => {
                                    setAuthFields(c => ({
                                        ...c,
                                        password: e.target.value
                                    }))
                                }}
                            />
                        </div>

                        <button
                            type="submit"
                            className="w-full mt-6 bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 px-6 rounded-lg flex items-center justify-center gap-2 hover:from-blue-700 hover:to-purple-700 transition-all focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-[#0A0B1E]"
                        >
                            {isLogin ? 'Login' : 'Sign Up'}
                            <ChevronRight className="w-4 h-4" />
                        </button>
                    </form>

                    {isLogin && (
                        <p className="mt-4 text-center text-gray-500">
                            <a
                                href="#"
                                className="text-blue-500 hover:text-blue-400 transition-colors"
                            >
                                Forgot your password?
                            </a>
                        </p>
                    )}
                </div>
            </div>
        </div >
    );
}

export default Login;