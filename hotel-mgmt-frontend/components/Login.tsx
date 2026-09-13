"use client"
'eslint-disable'

import { useState } from "react"
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Spinner } from "./ui/spinner";

export default function Login() {
    const [name, setName] = useState<string>('');
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [logging, setLogging] = useState<boolean>(false);

    return (
        <div>
            <Label>Login Component</Label>

            <Input
                type='email'
                value={email}
                onChange={(e) => { setEmail(e.target.value) }}
                required
                placeholder='Enter your Email'
            />

            <Input
                type='password'
                value={password}
                onChange={(e) => { setPassword(e.target.value) }}
                required
                placeholder='Enter your password'
            />

            <Button>{logging ? <><Spinner /><p>Logging in</p></> : <p>Login</p>}</Button>
        </div>
    )
} 