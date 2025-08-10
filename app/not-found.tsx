import Link from "next/link";
import { AlertTriangle } from "lucide-react";

export default function NotFound() {
    return (
        <div className="flex flex-col items-center justify-center h-screen bg-neutral-50 px-4 text-center">
            <AlertTriangle className="text-red-500 w-16 h-16 mb-4" />
            <h1 className="text-5xl font-bold text-gray-800 mb-2">404</h1>
            <p className="text-xl text-gray-600 mb-6">Halaman tidak ditemukan</p>
            <Link
                href="/dashboard"
                className="inline-block px-6 py-3 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
            >
                Kembali ke Dashboard
            </Link>
        </div>
    );
}
