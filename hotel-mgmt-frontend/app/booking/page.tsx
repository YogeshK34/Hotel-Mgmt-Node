"use client"

import { useEffect, useState } from "react"
import { toast } from "sonner";

export default function Booking() {
    const [rooms, setRooms] = useState<[]>([]);
    const [fetchingRooms, setFetchingRooms] = useState<boolean>(false)

    useEffect(() => {
        async function fetchRooms() {
            try {
                setFetchingRooms(true);
                const res = await fetch('http://localhost:3001/rooms', {
                    method: 'GET',
                    headers: { 'Content-type': 'application/json' }
                });

                const data = await res.json();
                if (!res.ok) return toast.error(data.error);

                setRooms(data.result)

            } catch (error: any) {
                console.error(error);
                toast.error(error.message)
                return;
            } finally {
                setFetchingRooms(false);
            }
        }
        fetchRooms()
    }, [])
    return (
        <div>
            {rooms.map((room) => (
                <div key={room.id}>

                    <p>{room.no}</p>
                    <p>{room.is_available}</p>
                </div>
            ))}
        </div>
    )
}

// I need to fetch all rooms so users can select which room to book and what not to 