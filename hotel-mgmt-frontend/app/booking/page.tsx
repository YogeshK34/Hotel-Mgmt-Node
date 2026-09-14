"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Spinner } from "@/components/ui/spinner"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { toast } from "sonner"

interface Room {
    id: number
    room_no: number
    is_available: boolean
}

interface BookingResult {
    id: number
    room_id: number
    customer_id: number
    booked_at: string
}

export default function Booking() {
    const [rooms, setRooms] = useState<Room[]>([])
    const [fetchingRooms, setFetchingRooms] = useState<boolean>(false)
    const [roomNo, setRoomNo] = useState<string>('')
    const [bookingData, setBookingData] = useState<BookingResult | null>(null)
    const [booking, setBooking] = useState<boolean>(false)
    const router = useRouter();

    useEffect(() => {
        async function fetchRooms() {
            try {
                setFetchingRooms(true)
                const res = await fetch('http://localhost:3001/rooms', {
                    method: 'GET',
                    headers: { 'Content-type': 'application/json' },
                    credentials: 'include'
                })

                const data = await res.json()
                if (!res.ok) return toast.error(data.error)

                setRooms(data.result)

            } catch (error: any) {
                console.error(error)
                toast.error(error.message)
            } finally {
                setFetchingRooms(false)
            }
        }
        fetchRooms()
    }, [])

    async function bookRoom() {
        try {
            setBooking(true)
            const res = await fetch('http://localhost:3001/booking', {
                method: 'POST',
                headers: { 'Content-type': 'application/json' },
                body: JSON.stringify({ room_no: roomNo }),  // ✅ matches backend
                credentials: 'include'
            })

            const data = await res.json()
            if (!res.ok) return toast.error(data.error)

            setBookingData(data.result)  // single object
            toast.success(data.message)

        } catch (error: any) {
            console.error(error)
            toast.error(error.message)
        } finally {
            setBooking(false)
        }
    }

    return (
        <div className="min-h-screen bg-zinc-950 px-6 py-10">
            <div className="max-w-2xl mx-auto space-y-8">

                <div className="space-y-1">
                    <p className="text-zinc-500 text-sm">Hotel Management</p>
                    <h1 className="text-white text-3xl font-semibold tracking-tight">Book a room</h1>
                </div>

                {/* Room list */}
                {fetchingRooms && (
                    <div className="flex items-center gap-2 text-zinc-500 text-sm">
                        <Spinner /> Fetching rooms...
                    </div>
                )}

                {!fetchingRooms && (
                    <div className="space-y-3">
                        {rooms.map((room) => (
                            <div
                                key={room.id}
                                className="border border-zinc-800 rounded-lg px-5 py-4 flex items-center justify-between cursor-pointer hover:border-zinc-600 transition-colors"
                                onClick={() => setRoomNo(String(room.room_no))}  // click to select
                            >
                                <p className="text-white font-medium">Room {room.room_no}</p>
                                <span className={`text-xs px-2.5 py-1 rounded-full border ${room.is_available
                                    ? 'bg-green-950 border-green-800 text-green-400'
                                    : 'bg-zinc-900 border-zinc-700 text-zinc-500'
                                    }`}>
                                    {room.is_available ? 'Available' : 'Booked'}
                                </span>
                            </div>
                        ))}
                    </div>
                )}

                {/* Booking input */}
                <div className="space-y-3">
                    <Input
                        type='text'
                        value={roomNo}
                        onChange={(e) => setRoomNo(e.target.value)}
                        placeholder='Enter room number'
                        className="bg-zinc-900 border-zinc-800 text-white placeholder:text-zinc-600"
                    />

                    <Button
                        onClick={bookRoom}
                        disabled={booking || !roomNo}
                        className="w-full bg-white text-zinc-950 hover:bg-zinc-200 font-medium"
                    >
                        {booking ? (
                            <span className="flex items-center gap-2">
                                <Spinner /> Confirming booking...
                            </span>
                        ) : 'Book room'}
                    </Button>
                </div>

                <Button onClick={() => { router.push('/dashboard') }}>Check your Bookings</Button>

                {/* Booking confirmation */}
                {bookingData && (
                    <div className="border border-zinc-800 rounded-lg px-5 py-4 space-y-1">
                        <p className="text-white font-medium">Booking confirmed</p>
                        <p className="text-zinc-500 text-sm">Room {bookingData.room_id} · Booking #{bookingData.id}</p>
                        <p className="text-zinc-600 text-xs">
                            {new Date(bookingData.booked_at).toLocaleDateString('en-IN', {
                                day: 'numeric', month: 'short', year: 'numeric'
                            })}
                        </p>
                    </div>
                )}

            </div>
        </div>
    )
}