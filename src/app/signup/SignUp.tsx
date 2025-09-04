"use client"
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
import { signupApi } from "@/utils/apis/api"
import { useEffect, useState } from "react"

const SignUp = () => {
    const [data, setData] = useState({
        username: "",
        password: "",
    })
    
    const [message, setMessage] = useState("");
    
    useEffect(() => {
        console.log("re render signup")
    }, [])
    
    const handleChange = (e: any) => {
        setData((prev) => ({
            ...prev,
            [e.target.name]: e.target.value
        }))
        console.log("data => ", data)
    }

    const handleClick = async (e: any) => {
        e.preventDefault()
        try {
            //@ts-ignore
            const response = await signupApi(data);
            setMessage(response.message || "Signup successful!");
        } catch (error) {
            setMessage("Signup failed. Please try again.");
        }
    };


    return (
        <div>
            <Card>
                <CardHeader>
                    <CardTitle className="text-2xl">Sign Up</CardTitle>
                    <CardDescription>
                        Enter your details to create a new account
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    {/* <form> */}
                    <div className="flex flex-col gap-6">
                        <div className="grid gap-2">
                            {/* <Label htmlFor="name">Full Name</Label>
                                <Input
                                    id="name"
                                    type="text"
                                    placeholder="John Doe"
                                    required={false}
                                /> */}
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="email">Email</Label>
                            <Input
                                id="email"
                                type="text"
                                placeholder="m@example.com"
                                required
                                name="username"
                                onChange={handleChange}
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="password">Password</Label>
                            <Input id="password" type="password" required
                                name="password"
                                onChange={handleChange}
                            />
                        </div>
                        <div className="grid gap-2">
                            {/* <Label htmlFor="confirm-password">Confirm Password</Label>
                                <Input id="confirm-password" type="password" required /> */}
                        </div>
                        <Button onClick={(e) => handleClick(e)} className="w-full">
                            Sign Up
                        </Button>
                        {/* <Button variant="outline" className="w-full">
                            Sign Up with Google
                        </Button> */}
                    </div>
                    <div className="mt-4 text-center text-sm">
                        Already have an account?{" "}
                        <a href="/login" className="underline underline-offset-4">
                            Login
                        </a>
                    </div>
                    <div>
                        {message}
                    </div>
                    {/* </form> */}
                </CardContent>
            </Card>
        </div>
    )
}

export default SignUp