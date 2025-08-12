'use client'

import { useEffect, useState, useCallback } from 'react'
import {
    Card, CardHeader, CardTitle, CardContent, CardFooter, CardDescription
} from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Copy, RefreshCcw, Trash2, MailCheck, Inbox } from 'lucide-react'
import { cn } from '@/lib/utils'

type Email = {
    id: number
    sender: string
    from: string
    subject: string
    time: string
}

type MailAPIResponse = {
    mail_id: number
    from_name: string
    from_mail: string
    subject: string
    time: string
}

export default function Mail() {
    const [selectedEmail, setSelectedEmail] = useState<Email | null>(null)
    const [tempEmail, setTempEmail] = useState<string>('Memuat...')
    const [copied, setCopied] = useState(false)
    const [inboxMessages, setInboxMessages] = useState<Email[]>([])
    const [inboxReady, setInboxReady] = useState(false)
    const [loading, setLoading] = useState(false)

    const fetchEmail = useCallback(async () => {
        const res = await fetch('/api/mail')
        const data = await res.json()
        setTempEmail(data.email)
        setSelectedEmail(null)
        setInboxMessages([])
        setInboxReady(false)
    }, [])

    const fetchInbox = useCallback(async () => {
        setLoading(true)
        try {
            if (!tempEmail || tempEmail === 'Memuat...') return
            const res = await fetch(`/api/inbox?email=${encodeURIComponent(tempEmail)}`)
            const data = await res.json()
            const mails: MailAPIResponse[] = data.mails || []

            const formatted: Email[] = mails.map((mail) => ({
                id: mail.mail_id,
                sender: mail.from_name,
                from: mail.from_mail,
                subject: mail.subject,
                time: mail.time,
            }))

            setInboxMessages(formatted)
            setInboxReady(true)
        } finally {
            setLoading(false)
        }
    }, [tempEmail])

    useEffect(() => {
        fetchEmail()
    }, [fetchEmail])

    useEffect(() => {
        const interval = setInterval(fetchInbox, 10000)
        return () => clearInterval(interval)
    }, [fetchInbox])

    const handleCopy = () => {
        navigator.clipboard.writeText(tempEmail)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
    }

    const handleReset = () => {
        setTempEmail('—')
        setSelectedEmail(null)
        setInboxMessages([])
        setInboxReady(false)
        fetchEmail()
    }

    return (
        <main className="h-full bg-white">
            <header className="bg-blue-500 bg-opacity-50 backdrop-blur-md shadow-lg border-b border-gray-700 p-4">
                <div className="max-w-full mx-auto py-4 px-4 sm:px-6 lg:px-8">
                    <h1 className="text-3xl font-bold text-white">Mail Generator</h1>
                </div>
            </header>
            <div className='justify-center flex p-4 sm:p-6'>
                <Card className="w-full max-w-5xl bg-gray-700 border border-gray-700 text-white">
                    <CardHeader>
                        <CardTitle className="text-center mb-4 text-2xl sm:text-4xl">
                            📨 Temp Mail Plus Generator
                        </CardTitle>
                        <CardDescription className="text-gray-300 text-center mb-4 text-base sm:text-2xl">
                            Gunakan email sementara ini untuk verifikasi. Klik pesan untuk melihat atau menyembunyikan detail.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="grid gap-2">
                            <Label className="h-[50px] sm:h-[60px] border border-gray-700 w-full justify-center text-lg sm:text-[26px] text-white flex items-center px-2 sm:px-4 break-all">
                                {tempEmail}
                            </Label>

                            {/* Button Group */}
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-4 mb-4 w-full px-1">
                                <Button className="flex items-center justify-center h-[45px] sm:h-[50px]" onClick={handleCopy}>
                                    <Copy size={20} className="mr-2" />
                                    {copied ? 'Copied!' : 'Copy'}
                                </Button>

                                <Button
                                    className="flex items-center justify-center h-[45px] sm:h-[50px]"
                                    onClick={fetchInbox}
                                >
                                    <RefreshCcw
                                        size={20}
                                        className={cn("mr-2", loading && "animate-spin")}
                                    />
                                    {inboxReady && inboxMessages.length > 0 ? (
                                        <span className="flex items-center gap-1 text-green-400">
                                            <MailCheck size={18} /> Message In!
                                        </span>
                                    ) : (
                                        'Check Inbox'
                                    )}
                                </Button>

                                <Button className="flex items-center justify-center h-[45px] sm:h-[50px]" onClick={handleReset}>
                                    <Trash2 size={20} className="mr-2" /> Delete
                                </Button>
                            </div>
                        </div>

                        {/* Inbox List */}
                        <div className="p-3 sm:p-4 border border-gray-700 mt-4 rounded-md max-h-[400px] overflow-y-auto bg-gray-900">
                            {inboxReady && inboxMessages.length > 0 ? (
                                inboxMessages.map((email) => (
                                    <Card
                                        key={email.id}
                                        className={`cursor-pointer hover:bg-gray-700 transition bg-gray-700 border border-gray-600 p-3 sm:p-4 mb-2 ${selectedEmail?.id === email.id ? 'ring-2 ring-indigo-400' : ''}`}
                                        onClick={() =>
                                            setSelectedEmail(selectedEmail?.id === email.id ? null : email)
                                        }
                                    >
                                        <div className="flex justify-between items-center">
                                            <div>
                                                <h3 className="text-white font-semibold text-sm sm:text-base">{email.sender}</h3>
                                                <p className="text-xs sm:text-sm text-gray-300">{email.subject}</p>
                                            </div>
                                            <span className="text-xs text-gray-400">{email.time}</span>
                                        </div>
                                    </Card>
                                ))
                            ) : (
                                <p className="text-gray-400 text-center">Belum ada pesan masuk.</p>
                            )}

                            {selectedEmail && (
                                <Card className="relative bg-gray-100 text-gray-800 border border-gray-300 rounded-md shadow-md p-4 sm:p-6 mt-4">
                                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4">
                                        <div>
                                            <h2 className="font-semibold text-md">{selectedEmail.sender}</h2>
                                            <p className="text-xs text-gray-600">{selectedEmail.from}</p>
                                        </div>
                                        <span className="text-xs text-gray-600 mt-2 sm:mt-0">{selectedEmail.time}</span>
                                    </div>

                                    <div className="border-t border-gray-300 my-2"></div>

                                    <div className="space-y-4 text-sm sm:text-base">
                                        <p><strong>Subject:</strong> {selectedEmail.subject}</p>
                                        <p>Email dari <strong>{selectedEmail.sender}</strong> ke <strong>{tempEmail}</strong></p>
                                        <p><i>Konten email bisa ditampilkan di sini jika endpoint detail tersedia.</i></p>
                                    </div>
                                </Card>
                            )}
                        </div>
                    </CardContent>

                    <CardFooter className="justify-center items-center text-sm sm:text-xl text-gray-300">
                        <Inbox size={20} className="mr-2 sm:w-8 sm:h-8" /> Inbox Messages
                    </CardFooter>
                </Card>
            </div>
        </main>
    )
}
