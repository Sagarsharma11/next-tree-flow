"use client"
import { useState } from "react";
import { Button } from "@/components/ui/button"
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { loginApi } from "@/utils/apis/api";
import { setLocalStorage } from "@/utils/localstorage/localStorage";

import { useRouter } from "next/navigation";

const Login = () => {
    const router = useRouter();
    const [data, setData] = useState({
        username: "",
        password: "",
    })

    const [message, setMessage] = useState("");


    const handleChange = (e: any) => {
        setData((prev: any) => ({
            ...prev,
            [e.target.name]: e.target.value
        }))
        console.log("data => ", data)
    }

    const handleClick = async (e: any) => {
        e.preventDefault()
        try {
            //@ts-ignore
            const response = await loginApi(data);
            console.log(response)
            if (response.status === 200) {
                setLocalStorage("token", response.data.access_token);
                setLocalStorage("refresh_token", response.data.refresh_token);
                setLocalStorage("email", data.username)
                router.replace("/secure-code");
            }
            setMessage(response.data.message || "Signup successful!");
        } catch (error) {
            setMessage("Signup failed. Please try again.");
        }
    };
    
    return (
        <div >
            <Card>
                <CardHeader>
                    <CardTitle className="text-2xl">Login</CardTitle>
                    <CardDescription>
                        Enter your email below to login to your account
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form>
                        <div className="flex flex-col gap-6">
                            <div className="grid gap-2">
                                <Label htmlFor="email">Email</Label>
                                <Input
                                    id="email"
                                    type="text"
                                    name="username"
                                    placeholder="m@example.com"
                                    required
                                    onChange={handleChange}
                                />
                            </div>
                            <div className="grid gap-2">
                                <div className="flex items-center">
                                    <Label htmlFor="password">Password</Label>
                                    {/* <a
                                        href="#"
                                        className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
                                    >
                                        Forgot your password?
                                    </a> */}
                                </div>
                                <Input onChange={handleChange} id="password" type="password" name="password" required />
                            </div>
                            <Button onClick={handleClick} type="submit" className="w-full">
                                Login
                            </Button>
                            {/* <Button variant="outline" className="w-full">
                                Login with Google
                            </Button> */}
                        </div>
                        <div className="mt-4 text-center text-sm">
                            {/* Don&apos;t have an account?{" "} */}
                            {/* <a href="/signup" className="underline underline-offset-4">
                                Sign up
                            </a> */}
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    )
}

export default Login