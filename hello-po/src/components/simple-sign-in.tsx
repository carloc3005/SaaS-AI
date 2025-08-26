"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";

export const SimpleSignInView = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    console.log("SimpleSignInView render");

    return (
        <div className="flex min-h-screen flex-col items-center justify-center gap-10 p-6">
            <Card className="w-full max-w-sm">
                <CardContent className="p-6">
                    <div className="space-y-4">
                        <h1 className="text-2xl font-bold text-center">Sign In</h1>
                        <div className="space-y-2">
                            <Input 
                                type="email" 
                                placeholder="Email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                            <Input 
                                type="password" 
                                placeholder="Password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                            <Button className="w-full">
                                Sign In
                            </Button>
                        </div>
                        <p className="text-center text-sm text-gray-600">
                            Testing - No Auth Logic
                        </p>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};
