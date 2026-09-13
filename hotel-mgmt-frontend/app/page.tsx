"use client"

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import { useRouter } from "next/navigation";
import { useState } from "react"
import { toast } from "sonner";

export default function Register() {
  const [name, setName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const router = useRouter();
  const [registering, setRegistering] = useState<boolean>(false);

  async function register() {
    try {
      setRegistering(true);
      const res = await fetch('http://localhost:3001/register', {
        method: 'POST',
        headers: { 'Content-type': 'application/json' },
        body: JSON.stringify({ name, email, password }),
        credentials: 'include'
      });

      const data = await res.json();
      if (!res.ok) return toast.error(data.error);

      toast.success('Register successful');
      router.push('/login')

    } catch (error: any) {
      console.error(error);
      toast.error(error.message);
      return;
    } finally {
      setRegistering(false);
    }
  }
  return (
    <div className="min-h-screen bg-zinc-950 flex items-center justify-center px-4">
      <div className="w-full max-w-sm space-y-8">

        {/* Header */}
        <div className="space-y-1">
          <p className="text-zinc-500 text-sm">Hotel Management</p>
          <h1 className="text-white text-3xl font-semibold tracking-tight">Sign up</h1>
        </div>

        {/* Form */}
        <div className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-zinc-400 text-sm">Name</label>
            <Input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="John Doe"
              className="bg-zinc-900 border-zinc-800 text-white placeholder:text-zinc-600 focus-visible:ring-zinc-600"
            />
          </div>

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
              onKeyDown={(e) => e.key === 'Enter' && register()}
            />
          </div>

          <Button
            onClick={register}
            disabled={registering || !email || !password}
            className="w-full bg-white text-zinc-950 hover:bg-zinc-200 font-medium mt-2"
          >
            {registering ? (
              <span className="flex items-center gap-2">
                <Spinner /> Signing up...
              </span>
            ) : 'Sign up'}
          </Button>
        </div>

        <p className="text-zinc-600 text-sm text-center">
          Already have an account?{' '}
          <a href="/login" className="text-zinc-400 hover:text-white transition-colors">
            Login
          </a>
        </p>
      </div>
    </div>
  )
}