"use client";
import { useParams, useRouter } from "next/navigation";
import { useState, useEffect } from "react";

export default function Game() {
    const router = useRouter();
    const params = useParams();
    const [spaceID, setSpaceID] = useState<string | null>(null);
    const [iframeError, setIframeError] = useState<string | null>(null);

    useEffect(() => {
        const tokenId = localStorage.getItem("token");
        if (!tokenId) {
            console.log("Token is not provided");
            router.push("/");
            return;
        }
        const token = tokenId?.split(" ")[1];
        if (!token) {
            console.log("Token is not provided");
            router.push("/");
            return;
        }

        if (!params.spaceId) {
            console.log("Space ID is not provided");
            router.push("/");
            return;
        }

        const id = Array.isArray(params.spaceId) ? params.spaceId[0] : params.spaceId;
        setSpaceID(id);

        // Set up a script to inject into the iframe
        const script = `
            window.spaceId = "${id}";
            window.token = "${token}";
        `;

        // Create a blob URL containing our script
        const blob = new Blob([script], { type: 'text/javascript' });
        const scriptUrl = URL.createObjectURL(blob);

        // Update the game URL to include our script
        setGameUrl(scriptUrl);

        // Clean up the blob URL when component unmounts
        return () => URL.revokeObjectURL(scriptUrl);
    }, [params.spaceId, router]);

    const [gameUrl, setGameUrl] = useState("");

    const handleIframeError = (event: React.SyntheticEvent<HTMLIFrameElement, Event>) => {
        setIframeError("Failed to load game. Please try again.");
        console.error("Iframe loading error:", event);
    };

    if (spaceID === null || !gameUrl) {
        return null;
    }

    if (iframeError) {
        return <div className="text-red-500">{iframeError}</div>;
    }

    // Construct the final URL with our script included
    const baseUrl = "https://interspace-frontend.vercel.app/index.html";
    const finalUrl = `${baseUrl}`;

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