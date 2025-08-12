"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

interface RecoveryCodes {
    A2F_key: string;
    recovery_codes: string[];
}

export default function EnableA2FPage() {
    const [cookies, setCookies] = useState("");
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState<RecoveryCodes | null>(null);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async () => {
        setLoading(true);
        setError(null);
        setResult(null);

        try {
            const res = await fetch("http://127.0.0.1:8000/api/a2fig", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ cookies }),
            });

            if (!res.ok) throw new Error(`Server error: ${res.status}`);
            const data = await res.json();
            if (data.status === "success") {
                setResult({ A2F_key: data.A2F_key, recovery_codes: data.recovery_codes || [] });
            } else {
                setError(data.message || "Gagal mendapatkan A2F");
            }
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-100">
            <header className="bg-blue-500 bg-opacity-50 backdrop-blur-md shadow-lg border-b border-gray-700 p-4">
                <div className="max-w-full mx-auto py-4 px-4 sm:px-6 lg:px-8">
                    <h1 className="text-3xl font-bold text-white">Two Factor Authentication</h1>
                </div>
            </header>
            <div className="justify-center items-center flex p-4">
                <div className="w-full max-w-4xl gap-6 mt-4 ">
                    <Card className="flex-1 bg-white shadow-md hover:shadow-lg transition-shadow">
                        <CardHeader className="text-center">
                            <CardTitle>Generator A2F</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <textarea
                                placeholder="Masukan Cookies Instagram"
                                value={cookies}
                                onChange={(e) => setCookies(e.target.value)}
                                className="w-full min-h-[120px] max-h-60 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 transition resize-none"
                            />
                            <Button
                                onClick={handleSubmit}
                                disabled={loading || !cookies}
                                className="w-full bg-blue-700 font-extrabold"
                            >
                                {loading ? "Memproses..." : "Enable 2FA"}
                            </Button>
                            {error && <p className="text-red-600 font-medium text-center">{error}</p>}
                        </CardContent>
                    </Card>
                    {result && (
                        <Card className="flex-1 bg-white shadow-md hover:shadow-lg transition-shadow">
                            <CardHeader>
                                <CardTitle>A2F Key & Recovery Codes</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="font-mono text-gray-800 mb-3 break-words">{result.A2F_key}</p>
                                <h3 className="font-semibold mb-2">Recovery Codes:</h3>
                                <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4">
                                    {result.recovery_codes.map((code, idx) => (
                                        <div
                                            key={idx}
                                            className="bg-gray-100 border border-gray-300 rounded-md p-2 text-center font-mono text-sm break-words"
                                        >
                                            {code}
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    )}
                </div>
            </div>
        </div>
    );
}
