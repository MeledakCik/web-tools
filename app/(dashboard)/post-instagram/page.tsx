"use client";

import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";
import Image from "next/image";

export default function InstagramPostPage() {
    const [cookies, setCookies] = useState("");
    const [caption, setCaption] = useState("");
    const [image, setImage] = useState<File | null>(null);
    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!cookies || !caption || !image) {
            alert("Semua field wajib diisi!");
            return;
        }

        setLoading(true);
        setStatus("");

        const formData = new FormData();
        formData.append("cookies", cookies);
        formData.append("caption", caption);
        formData.append("image", image);

        try {
            const res = await fetch("/api/post-instagram", {
                method: "POST",
                body: formData,
            });
            const data = await res.json();

            if (res.ok) {
                setStatus("✅ Berhasil posting ke Instagram");
            } else {
                setStatus(`❌ Gagal: ${data.error}`);
            }
        } catch (err) {
            setStatus(`❌ Error: ${err}`);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="h-full bg-gradient-to-b from-blue-50 to-blue-100">
            <header className="bg-blue-500 bg-opacity-50 backdrop-blur-md shadow-lg border-b border-gray-700 p-4">
                <div className="max-w-full mx-auto py-4 px-4 sm:px-6 lg:px-8">
                    <h1 className="text-3xl font-bold text-white">Dashboard Tools</h1>
                </div>
            </header>
            <div className="flex p-6">
                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    whileHover={{ scale: 1.02 }}
                    className="w-full"
                >
                    <Card className="shadow-xl border border-gray-200 rounded-2xl bg-gray-800">
                        <CardHeader>
                            <CardTitle className="text-xl font-semibold text-white">
                                Post Gambar ke Instagram
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <form
                                onSubmit={handleSubmit}
                                className="flex flex-col md:flex-row gap-4 text-white"
                            >
                                <div className="flex flex-col gap-4 flex-1">
                                    <textarea
                                        placeholder="Masukkan cookies Instagram..."
                                        value={cookies}
                                        onChange={(e) => setCookies(e.target.value)}
                                        className="border p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 w-full"
                                        rows={4}
                                    />
                                    <textarea
                                        placeholder="Caption..."
                                        value={caption}
                                        onChange={(e) => setCaption(e.target.value)}
                                        className="border p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 w-full"
                                        rows={2}
                                    />
                                    <motion.button
                                        whileTap={{ scale: 0.95 }}
                                        whileHover={{ scale: 1.03 }}
                                        type="submit"
                                        disabled={loading}
                                        className="bg-blue-500 hover:bg-blue-600 transition-all duration-300 text-white p-3 rounded-lg font-semibold"
                                    >
                                        {loading ? "Mengunggah..." : "Post ke Instagram"}
                                    </motion.button>
                                </div>
                                <div className="flex-1">
                                    <label
                                        htmlFor="file-upload"
                                        className="block border-2 border-dashed border-gray-400 rounded-lg p-2 bg-white cursor-pointer hover:border-blue-400 transition relative h-full flex items-center justify-center"
                                    >
                                        {image ? (
                                            <Image
                                                src={URL.createObjectURL(image)}
                                                alt="Preview"
                                                className="w-full h-full object-contain rounded-lg"
                                            />
                                        ) : (
                                            <div className="flex flex-col items-center justify-center text-gray-500">
                                                <span className="text-sm">Klik atau tarik gambar ke sini</span>
                                            </div>
                                        )}
                                        <input
                                            id="file-upload"
                                            type="file"
                                            accept="image/*"
                                            onChange={(e) => setImage(e.target.files?.[0] || null)}
                                            className="hidden"
                                        />
                                    </label>
                                </div>
                            </form>
                            {status && (
                                <motion.p
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className={`mt-4 text-sm font-medium ${status.startsWith("✅") ? "text-green-400" : "text-red-400"
                                        }`}
                                >
                                    {status}
                                </motion.p>
                            )}
                        </CardContent>
                    </Card>
                </motion.div>
            </div>
        </div>
    );
}