"use client"
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
    Rocket,
    Plus,
    Users,

    User,
    LogOut,
    X,
    Loader2,
    Check,
    Copy,
} from 'lucide-react';
import axios from "axios";
type GameMap = {
    id: string;
    name: string;
    image: string;
    description: string;
};

const GAME_MAPS: GameMap[] = [
    {
        id: 'classic',
        name: 'Classic Arena',
        image: 'https://images.unsplash.com/photo-1536152470836-b943b246224c?w=800&auto=format&fit=crop&q=60',
        description: 'Traditional battle arena with balanced terrain',
    },
    {
        id: 'cyber',
        name: 'Cyber City',
        image: 'https://images.unsplash.com/photo-1515705576963-95cad62945b6?w=800&auto=format&fit=crop&q=60',
        description: 'Futuristic cityscape with vertical gameplay',
    },
    {
        id: 'space',
        name: 'Space Station',
        image: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&auto=format&fit=crop&q=60',
        description: 'Zero-gravity combat environment',
    },
];

export default function Lander() {
    const navigate = useRouter();

    const [view, setView] = useState<'menu' | 'create' | 'join'>('menu');
    const [spaceName, setSpaceName] = useState<string>("")
    const [selectedMap, setSelectedMap] = useState<string | null>(null);
    const [spaceID, setSpaceID] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [copied, setCopied] = useState(false);
    const [joinSpaceId, setJoinSpaceId] = useState('');

    const [dimensions, setDimensions] = useState<string>('16x16');



    const handleCreateSpace = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        // Simulate API call
        try {
            const response = await axios.post(`https://swayamagrahari.com.np/api/v1/space`, {
                "name": spaceName,
                "dimensions": dimensions,
            }, {
                headers: {
                    "Authorization": localStorage.getItem("token")
                }
            })

            if (response.status === 200) {
                console.log("Space created successfully")
                console.log("Space ID", response.data.spaceId)
                setSpaceID(response.data.spaceId)
            }
            else if (response.status === 400) {
                console.log("Space creation failed")
            }

        } catch (error) {
            console.log(error)

        } finally {
            setLoading(false);
        }

    };
    useEffect(() => {
        if (spaceID) {
            console.log("Space ID", spaceID);
            // You can also navigate here if desired
        }
    }, [spaceID]);


    const handleJoinSpace = (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        console.log("Joining space here", spaceID, joinSpaceId)
        if (joinSpaceId) {
            // setSpaceId(joinSpaceId);
            // setView('join');
            navigate.push(`/game/${joinSpaceId}`)
        }
        else {
            console.log("Space ID is not provided")
        }

    };

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("userId");
        navigate.push("/login");
    }


    const copySpaceId = async () => {
        if (spaceID) {
            await navigator.clipboard.writeText(spaceID);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    };


    return (
        <div className="min-h-screen bg-[#0A0B1E] text-white relative overflow-hidden">
            {/* Background Grid Pattern */}
            <div
                className="absolute inset-0 opacity-10"
                style={{
                    backgroundImage:
                        'linear-gradient(to right, #ffffff 1px, transparent 1px), linear-gradient(to bottom, #ffffff 1px, transparent 1px)',
                    backgroundSize: '50px 50px',
                }}
            />

            {/* Header */}
            <header className="relative z-10 px-8 py-4 bg-black/20 backdrop-blur-lg border-b border-white/10">
                <div className="max-w-7xl mx-auto flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <Rocket className="w-8 h-8 text-blue-500" />
                        <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500">
                            Interspace
                        </span>
                    </div>
                    <div className="flex items-center gap-4">
                        <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-900/50 hover:bg-gray-900/70 transition-all">
                            <User className="w-4 h-4" />
                            <span>Profile</span>
                        </button>
                        <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-red-500/20 text-red-400 hover:bg-red-500/30 transition-all" onClick={handleLogout}>
                            <LogOut className="w-4 h-4" />
                            <span>Logout</span>
                        </button>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="relative z-10 max-w-7xl mx-auto p-8 mt-8">
                {view === 'menu' && (
                    <div className="flex flex-col items-center justify-center gap-8 mt-16">
                        <h1 className="text-4xl font-bold text-center bg-clip-text text-transparent bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500">
                            Welcome to Interspace
                        </h1>
                        <div className="flex gap-6">
                            <button
                                onClick={() => setView('create')}
                                className="group relative px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg overflow-hidden transition-all hover:scale-105"
                            >
                                <div className="absolute inset-0 bg-white/20 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left" />
                                <span className="relative flex items-center gap-2">
                                    <Plus className="w-5 h-5" />
                                    Create Space
                                </span>
                            </button>
                            <button
                                onClick={() => setView('join')}
                                className="group relative px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg overflow-hidden transition-all hover:scale-105"
                            >
                                <div className="absolute inset-0 bg-white/20 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left" />
                                <span className="relative flex items-center gap-2">
                                    <Users className="w-5 h-5" />
                                    Join Space
                                </span>
                            </button>
                        </div>
                    </div>
                )}

                {view === 'create' && (
                    <div className="max-w-3xl mx-auto">
                        <button
                            onClick={() => {
                                setView('menu');
                                setSpaceID(null);
                                setSelectedMap(null);
                            }}
                            className="mb-8 flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
                        >
                            <X className="w-4 h-4" />
                            Back to Menu
                        </button>

                        {!spaceID ? (
                            <>
                                <div className="mb-6">
                                    <label className="block text-gray-400 text-sm mb-2">
                                        Space Name
                                    </label>
                                    <input
                                        type="text"
                                        value={spaceName}
                                        onChange={(e) => setSpaceName(e.target.value)}
                                        className="w-full px-4 py-3 rounded-lg bg-gray-900/50 border border-gray-800 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                        placeholder="Enter space name"
                                    />
                                </div>
                                <div className="mb-6">
                                    <label className="block  text-2xl font-bold mb-6">
                                        Dimensions
                                    </label>
                                    <div className="grid grid-cols-3 gap-4">
                                        {['16', '32', '64'].map((size) => (
                                            <button
                                                key={size}
                                                type="button"
                                                onClick={() => setDimensions(`${size}x${size}`)}
                                                className={`p-3 rounded-lg border ${dimensions === `${size}x${size}`
                                                    ? 'border-blue-500 bg-blue-500/20 text-blue-400'
                                                    : 'border-gray-800 hover:border-gray-700'
                                                    } transition-all`}
                                            >
                                                {size}x{size}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                                <h2 className="text-2xl font-bold mb-6">Select a Map (Optional)</h2>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                                    {GAME_MAPS.map((map) => (
                                        <div
                                            key={map.id}
                                            onClick={() => setSelectedMap(map.id)}
                                            className={`relative rounded-lg overflow-hidden cursor-pointer transition-all hover:scale-105 ${selectedMap === map.id
                                                ? 'ring-2 ring-blue-500 shadow-lg shadow-blue-500/20'
                                                : ''
                                                }`}
                                        >
                                            <img
                                                // width={200}
                                                // height={200}
                                                src={map.image}
                                                alt={map.name}

                                                className="w-full aspect-video object-cover"
                                            />
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-black/0 p-4 flex flex-col justify-end">
                                                <h3 className="font-bold">{map.name}</h3>
                                                <p className="text-sm text-gray-300">{map.description}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                <button
                                    onClick={handleCreateSpace}
                                    disabled={loading}
                                    className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-4 px-8 rounded-lg flex items-center justify-center gap-2 hover:from-blue-700 hover:to-purple-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {loading ? (
                                        <Loader2 className="w-5 h-5 animate-spin" />
                                    ) : (
                                        <>
                                            <Plus className="w-5 h-5" />
                                            Create Space
                                        </>
                                    )}
                                </button>
                            </>
                        ) : (
                            <div className="text-center">
                                <div className="mb-8">
                                    <h2 className="text-2xl font-bold mb-2">Space Created Successfully!</h2>
                                    <p className="text-gray-400">Share this Space ID with your friends to join:</p>
                                </div>
                                <div className="flex items-center justify-center gap-4 mb-8">
                                    <code className="px-4 py-2 bg-gray-900/50 rounded-lg text-xl font-mono">
                                        {spaceID}
                                    </code>
                                    <button
                                        onClick={copySpaceId}
                                        className="p-2 rounded-lg bg-gray-900/50 hover:bg-gray-900/70 transition-all"
                                    >
                                        {copied ? (
                                            <Check className="w-5 h-5 text-green-500" />
                                        ) : (
                                            <Copy className="w-5 h-5" />
                                        )}
                                    </button>
                                </div>
                                <button
                                    onClick={() => {
                                        navigate.push(`/game/${spaceID}`)
                                    }}
                                    className="bg-gradient-to-r from-purple-600 to-pink-600 text-white py-3 px-6 rounded-lg inline-flex items-center gap-2 hover:from-purple-700 hover:to-pink-700 transition-all"
                                >
                                    <Users className="w-4 h-4" />
                                    Join Space Now
                                </button>
                            </div>
                        )}
                    </div>
                )}

                {view === 'join' && (
                    <div className="max-w-3xl mx-auto">
                        {!spaceID ? (
                            <>
                                <button
                                    onClick={() => setView('menu')}
                                    className="mb-8 flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
                                >
                                    <X className="w-4 h-4" />
                                    Back to Menu
                                </button>
                                <form onSubmit={handleJoinSpace} className="space-y-6">
                                    <div>
                                        <label className="block text-gray-400 text-sm mb-2">
                                            Enter Space ID
                                        </label>
                                        <input
                                            type="text"
                                            value={joinSpaceId}
                                            onChange={(e) => setJoinSpaceId(e.target.value)}
                                            className="w-full px-4 py-3 rounded-lg bg-gray-900/50 border border-gray-800 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                                            placeholder="Enter the Space ID to join"
                                        />
                                    </div>
                                    <button
                                        type="submit"
                                        className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-4 px-8 rounded-lg flex items-center justify-center gap-2 hover:from-purple-700 hover:to-pink-700 transition-all"

                                    >
                                        <Users className="w-5 h-5" />
                                        Join Space
                                    </button>
                                </form>
                            </>
                        ) : (
                            <div className="relative">
                                <button
                                    onClick={() => {
                                        setView('menu');
                                        setSpaceID(null);
                                        setJoinSpaceId('');
                                    }}
                                    className="absolute -top-12 left-0 flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
                                >
                                    <X className="w-4 h-4" />
                                    Exit Space
                                </button>
                                <iframe
                                    src={`https://example.com/game?spaceId=${spaceID}`}
                                    className="w-full h-[80vh] rounded-lg border-2 border-gray-800"
                                    title="Game Space"
                                />
                            </div>
                        )}
                    </div>
                )}
            </main>
        </div>
    );
}

