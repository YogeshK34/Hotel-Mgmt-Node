"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Spinner } from "@/components/ui/spinner"
import { toast } from "sonner"
import { useRouter } from "next/navigation"

export default function Login() {
    const [email, setEmail] = useState<string>('')
    const [password, setPassword] = useState<string>('')
    const [logging, setLogging] = useState<boolean>(false)
    const router = useRouter()

    async function login() {
        try {
            setLogging(true)

            const res = await fetch('http://localhost:3001/login', {
                method: 'POST',
                headers: { 'Content-type': 'application/json' },
                body: JSON.stringify({ email, password }),
                credentials: 'include'
            })

            const data = await res.json()
            if (!res.ok) return toast.error(data.error)

            toast.success(data.message)
            router.push('/dashboard')

        } catch (error: any) {
            console.error(error)
            toast.error(error.message)
        } finally {
            setLogging(false)
        }
    }

    return (
        <div className="min-h-screen bg-zinc-950 flex items-center justify-center px-4">
            <div className="w-full max-w-sm space-y-8">

                {/* Header */}
                <div className="space-y-1">
                    <p className="text-zinc-500 text-sm">Hotel Management</p>
                    <h1 className="text-white text-3xl font-semibold tracking-tight">Sign in</h1>
                </div>

                {/* Form */}
                <div className="space-y-4">
                    <div className="space-y-1.5">
                        <label className="text-zinc-400 text-sm">Email</label>
                        <Input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="you@example.com"
                            className="bg-zinc-900 border-zinc-800 text-white placeholder:text-zinc-600 focus-visible:ring-zinc-600"
                        />
                    </div>

                    <div className="space-y-1.5">
                        <label className="text-zinc-400 text-sm">Password</label>
                        <Input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="••••••••"
                            className="bg-zinc-900 border-zinc-800 text-white placeholder:text-zinc-600 focus-visible:ring-zinc-600"
                            onKeyDown={(e) => e.key === 'Enter' && login()}
                        />
                    </div>

                    <Button
                        onClick={login}
                        disabled={logging || !email || !password}
                        className="w-full bg-white text-zinc-950 hover:bg-zinc-200 font-medium mt-2"
                    >
                        {logging ? (
                            <span className="flex items-center gap-2">
                                <Spinner /> Signing in...
                            </span>
                        ) : 'Sign in'}
                    </Button>
                </div>

                <p className="text-zinc-600 text-sm text-center">
                    Don't have an account?{' '}
                    <a href="/register" className="text-zinc-400 hover:text-white transition-colors">
                        Register
                    </a>
                </p>
            </div>
        </div>
    )
}