"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Eye } from "lucide-react";
import {
    Card,
    CardHeader,
    CardTitle,
    CardContent,
    CardFooter,
} from "@/components/ui/card";

interface FacebookResult {
    id: string;
    name: string;
}

interface SelectedFB extends FacebookResult {
    url: string;
}

const Facebook = () => {
    const [name, setName] = useState<string>("");
    const [limit, setLimit] = useState<string>("");
    const [jeda, setJeda] = useState<string>("");
    const [results, setResults] = useState<FacebookResult[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [selectfb, setSelectfb] = useState<SelectedFB | null>(null);

    const handleDump = async () => {
        setLoading(true);
        setResults([]);
        try {
            const res = await fetch("http://127.0.0.1:8000/api/dump-facebook", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    nama: name,
                    jumlah: limit,
                    jeda: jeda,
                }),
            });
            const data = await res.json();
            setResults(data.data || []);
        } catch (e) {
            console.error(e);
            setResults([]);
        }
        setLoading(false);
    };

    return (
        <div className="items-center w-full text-white h-full relative z-20">
            <header className="bg-blue-500 bg-opacity-50 backdrop-blur-md shadow-lg border-b border-gray-700 p-4">
                <div className="max-w-full mx-auto py-4 px-4 sm:px-6 lg:px-8">
                    <h1 className="text-3xl font-bold text-white">Dump Facebook</h1>
                </div>
            </header>

            <div className="p-6">
                <Card className="w-full max-w-2xl bg-gray-700 text-white border border-gray-700 shadow-lg mb-4">
                    <CardHeader>
                        <CardTitle className="text-center">Dump Facebook ID</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <Input
                                type="text"
                                placeholder="contoh: Budi Santoso"
                                onChange={(e) => setName(e.target.value)}
                            />
                            <Input
                                type="number"
                                min="1"
                                placeholder="Limit hasil"
                                onChange={(e) => setLimit(e.target.value)}
                            />
                            <Input
                                type="number"
                                min="2"
                                placeholder="Delay (contoh 5)"
                                onChange={(e) => setJeda(e.target.value)}
                            />
                        </div>
                        <div className="flex justify-center items-center mt-4">
                            <button
                                onClick={handleDump}
                                className="w-40 bg-blue-600 text-white rounded px-4 py-2 hover:bg-blue-700 transition"
                            >
                                {loading ? "Dumping..." : "Dump Facebook"}
                            </button>
                        </div>
                    </CardContent>
                </Card>
                {(loading || results.length > 0) && (
                    <Card className="w-full max-w-2xl bg-gray-700 text-white border border-gray-700 shadow-lg mt-4">
                        <CardHeader>
                            <CardTitle className="text-center">Results</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="max-h-64 overflow-y-auto rounded border border-gray-600">
                                <table className="w-full text-xs border-collapse">
                                    <thead className="bg-gray-700 text-white sticky top-0">
                                        <tr>
                                            <th className="border p-2">ID</th>
                                            <th className="border p-2">Name</th>
                                            <th className="border p-2">Lihat</th>
                                        </tr>
                                    </thead>
                                    <tbody className="text-gray-300">
                                        {loading ? (
                                            <tr>
                                                <td
                                                    colSpan={3}
                                                    className="text-center p-4 animate-pulse text-blue-400"
                                                >
                                                    Loading...
                                                </td>
                                            </tr>
                                        ) : (
                                            results.map((item: FacebookResult, index) => (
                                                <tr
                                                    key={index}
                                                    className="hover:bg-gray-600 transition-colors"
                                                >
                                                    <td className="border p-2">{item.id}</td>
                                                    <td className="border p-2 break-all">
                                                        {item.name}
                                                    </td>
                                                    <td className="border p-2">
                                                        <button
                                                            onClick={() =>
                                                                setSelectfb({
                                                                    ...item,
                                                                    url: `https://www.facebook.com/profile.php?id=${item.id}`,
                                                                })
                                                            }
                                                            className="bg-green-500 hover:bg-green-600 text-white px-2 py-1 rounded"
                                                        >
                                                            <Eye className="w-4 h-4" />
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </CardContent>
                        <CardFooter>
                            <p className="text-xs text-gray-400">
                                Klik ikon mata untuk melihat detail profil.
                            </p>
                        </CardFooter>
                    </Card>
                )}

                {/* Modal Detail */}
                {selectfb && (
                    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                        <div className="bg-white p-6 rounded shadow-lg w-[90%] max-w-md">
                            <h2 className="text-lg font-semibold mb-4">Detail Akun Facebook</h2>
                            <p>
                                <strong>Nama:</strong> {selectfb.name}
                            </p>
                            <p>
                                <strong>ID:</strong> {selectfb.id}
                            </p>
                            <p>
                                <strong>Link Profil:</strong>{" "}
                                <a
                                    href={selectfb.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-blue-500 underline"
                                >
                                    {selectfb.url}
                                </a>
                            </p>
                            <button
                                onClick={() => setSelectfb(null)}
                                className="mt-4 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
                            >
                                Tutup
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Facebook;
