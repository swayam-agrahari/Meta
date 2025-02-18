"use client";
import { useRouter } from "next/navigation";
import React from "react";
import { useState, useEffect } from "react";

export default function Game() {
    const router = useRouter();
    const [iframeError, setIframeError] = useState<boolean>(false);
    

    useEffect(() => {
        try {

            const tokenId = localStorage.getItem("token");
            if (!tokenId) {
                console.log("Token is not provided");
                router.push("/login");
                return;
            }

            const token = tokenId.split(" ")[1];
            if (!token) {
                console.log("Token is invalid format");
                router.push("/login");
                return;
            }

        } catch (error) {
            console.error("Error accessing localStorage:", error);
            router.push("/login");
        }
    }, [router]);

    const handleIframeError = (event: React.SyntheticEvent<HTMLIFrameElement, Event>) => {
        setIframeError(true);
        console.error("Iframe loading error:", event);
    };

    if (iframeError) {
        return (
            <div className="flex flex-col items-center justify-center h-screen">
                <h1 className="text-3xl font-bold mb-4">Content Not Found</h1>
                <p className="mb-6">The game content couldn&apos;t be loaded.</p>
                <button
                    onClick={() => router.push("/")}
                    className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                    Return to Home
                </button>
            </div>
        );
    }

    const finalUrl = "https://interspace-frontend.vercel.app/";

    return (
        <main className="w-screen h-screen">
            <iframe
                id="game"
                src={finalUrl}
                title="game"
                allowFullScreen
                className="w-full h-full"
                onError={handleIframeError}
                referrerPolicy="origin"
                allow="autoplay"
            />
        </main>
    );
}