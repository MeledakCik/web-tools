'use client'

import { useEffect, useState } from 'react'
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

export default function Mail() {
    const [selectedEmail, setSelectedEmail] = useState<Email | null>(null)
    const [tempEmail, setTempEmail] = useState<string>('Memuat...')
    const [copied, setCopied] = useState(false)
    const [inboxMessages, setInboxMessages] = useState<Email[]>([])
    const [inboxReady, setInboxReady] = useState(false)
    const [loading, setLoading] = useState(false)

    const fetchEmail = async () => {
        const res = await fetch('/api/mail')
        const data = await res.json()
        setTempEmail(data.email)
        setSelectedEmail(null)
        setInboxMessages([])
        setInboxReady(false)
    }

    const fetchInbox = async () => {
        setLoading(true)
        try {
            if (!tempEmail || tempEmail === 'Memuat...') return
            const res = await fetch(`/api/inbox?email=${encodeURIComponent(tempEmail)}`)
            const data = await res.json()
            const mails = data.mails || []

            const formatted: Email[] = mails.map((mail: any) => ({
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
    }

    useEffect(() => {
        fetchEmail()
    }, [])

    useEffect(() => {
        const interval = setInterval(fetchInbox, 10000)
        return () => clearInterval(interval)
    }, [tempEmail])

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
        <main className="flex min-h-screen p-6 bg-gray-900">
            <Card className="w-full bg-gray-800 border border-gray-700 text-white">
                <CardHeader>
                    <CardTitle className="text-center mb-4 text-4xl">📨 Temp Mail Plus Generator</CardTitle>
                    <CardDescription className="text-gray-300 text-center mb-4 text-2xl">
                        Gunakan email sementara ini untuk verifikasi. Klik pesan untuk melihat atau menyembunyikan detail.
                    </CardDescription>
                </CardHeader>

                <CardContent className="space-y-6">
                    <div className="grid gap-2">
                        <Label className="h-[60px] border border-gray-700 w-full justify-center text-[26px] text-white flex items-center px-4">
                            {tempEmail}
                        </Label>

                        <div className="flex flex-wrap justify-center gap-4 mt-4 mb-4 w-full px-2">
                            <Button size="icon" className="flex-1 h-[50px] min-w-[140px]" onClick={handleCopy}>
                                <Copy size={24} className="mr-2" />
                                {copied ? 'Copied!' : 'Copy'}
                            </Button>

                            <Button
                                size="icon"
                                className="flex-1 h-[50px] min-w-[140px]"
                                onClick={fetchInbox}
                            >
                                <RefreshCcw
                                    size={24}
                                    className={cn(
                                        "mr-2",
                                        loading && "animate-spin"
                                    )}
                                />
                                {inboxReady && inboxMessages.length > 0 ? (
                                    <span className="flex items-center gap-1 text-green-400">
                                        <MailCheck size={20} /> Message In!
                                    </span>
                                ) : (
                                    'Check Inbox'
                                )}
                            </Button>


                            <Button size="icon" className="flex-1 h-[50px] min-w-[140px]" onClick={handleReset}>
                                <Trash2 size={24} className="mr-2" /> Delete
                            </Button>
                        </div>
                    </div>

                    <div className="p-4 border border-gray-700 mt-4 rounded-md h-full overflow-y-auto bg-gray-900">
                        {inboxReady && inboxMessages.length > 0 ? (
                            inboxMessages.map((email) => (
                                <Card
                                    key={email.id}
                                    className={`cursor-pointer hover:bg-gray-700 transition bg-gray-800 border border-gray-600 p-4 mb-2 ${selectedEmail?.id === email.id ? 'ring-2 ring-indigo-400' : ''}`}
                                    onClick={() =>
                                        setSelectedEmail(selectedEmail?.id === email.id ? null : email)
                                    }
                                >
                                    <div className="flex justify-between items-center">
                                        <div>
                                            <h3 className="text-white font-semibold">{email.sender}</h3>
                                            <p className="text-sm text-gray-300">{email.subject}</p>
                                        </div>
                                        <span className="text-xs text-gray-400">{email.time}</span>
                                    </div>
                                </Card>
                            ))
                        ) : (
                            <p className="text-gray-400 text-center">Belum ada pesan masuk.</p>
                        )}

                        {selectedEmail && (
                            <Card className="relative bg-gray-100 text-gray-800 border border-gray-300 rounded-md shadow-md p-6 mt-4">
                                <div className="flex justify-between items-center mb-4">
                                    <div>
                                        <h2 className="font-semibold text-md">{selectedEmail.sender}</h2>
                                        <p className="text-xs text-gray-600">{selectedEmail.from}</p>
                                    </div>
                                    <span className="text-xs text-gray-600">{selectedEmail.time}</span>
                                </div>

                                <div className="border-t border-gray-300 my-2"></div>

                                <div className="space-y-4">
                                    <p><strong>Subject:</strong> {selectedEmail.subject}</p>
                                    <p>Email dari <strong>{selectedEmail.sender}</strong> ke <strong>{tempEmail}</strong></p>
                                    <p><i>Konten email bisa ditampilkan di sini jika endpoint detail tersedia.</i></p>
                                </div>
                            </Card>
                        )}
                    </div>
                </CardContent>

                <CardFooter className="justify-center items-center text-xl text-gray-300">
                    <Inbox size={32} className="mr-2" /> Inbox Messages
                </CardFooter>
            </Card>
        </main>
    )
}
