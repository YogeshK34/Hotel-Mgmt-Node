"use client"

import { Button } from "@/components/ui/button"
import { Spinner } from "@/components/ui/spinner"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { toast } from "sonner"

interface Booking {
    id: number
    room_id: number
    customer_id: number
    booked_at: string
}

export default function Dashboard() {
    const [loading, setLoading] = useState<boolean>(false)
    const [bookings, setBookings] = useState<Booking[]>([])
    const router = useRouter();

    useEffect(() => {
        async function fetchBookings() {
            try {
                setLoading(true)
                const res = await fetch('http://localhost:3001/booking', {
                    method: 'GET',
                    headers: { 'Content-type': 'application/json' },
                    credentials: 'include'
                })

                const data = await res.json()
                if (!res.ok) return toast.error(data.error)

                setBookings(data.result)

            } catch (error: any) {
                console.error(error)
                toast.error(error.message)
            } finally {
                setLoading(false)
            }
        }
        fetchBookings()
    }, [])

    async function logout() {
        try {
            const res = await fetch('http://localhost:3001/logout', {
                method: 'POST',
                headers: { 'Content-type': 'application/json' },
                credentials: 'include'
            });

            const data = await res.json();
            if (!res.ok) return toast.error(data.error);

            toast.success(data.message);
            router.push('/login');

        } catch (error: any) {
            console.error(error);
            return toast.error(error.message);
        }
    }

    return (
        <div className="min-h-screen bg-zinc-950 px-6 py-10">
            <div className="max-w-2xl mx-auto space-y-8">

                {/* Header */}
                <div className="space-y-1">
                    <p className="text-zinc-500 text-sm">Hotel Management</p>
                    <h1 className="text-white text-3xl font-semibold tracking-tight">Your bookings</h1>
                </div>

                {/* States */}
                {loading && (
                    <div className="flex items-center gap-2 text-zinc-500 text-sm">
                        <Spinner /> Fetching bookings...
                    </div>
                )}

                {!loading && bookings.length === 0 && (
                    <div className="border border-zinc-800 rounded-lg px-6 py-12 text-center space-y-2">
                        <p className="text-zinc-400 font-medium">No bookings yet</p>
                        <p className="text-zinc-600 text-sm">Book a room to see it here.</p>
                    </div>
                )}

                {/* Booking list */}
                {!loading && bookings.length > 0 && (
                    <div className="space-y-3">
                        {bookings.map((booking) => (
                            <div
                                key={booking.id}
                                className="border border-zinc-800 rounded-lg px-5 py-4 flex items-center justify-between"
                            >
                                <div className="space-y-1">
                                    <p className="text-white font-medium">Room {booking.room_id}</p>
                                    <p className="text-zinc-500 text-sm">
                                        {new Date(booking.booked_at).toLocaleDateString('en-IN', {
                                            day: 'numeric',
                                            month: 'short',
                                            year: 'numeric'
                                        })}
                                    </p>
                                </div>
                                <div className="text-right space-y-1">
                                    <span className="inline-block bg-zinc-900 border border-zinc-700 text-zinc-300 text-xs px-2.5 py-1 rounded-full">
                                        Confirmed
                                    </span>
                                    <p className="text-zinc-600 text-xs">Booking #{booking.id}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                <Button onClick={() => { router.push('/booking') }}>Book Rooms</Button>
                <Button onClick={() => { logout() }}>Logout</Button>
            </div>
        </div>
    )
}