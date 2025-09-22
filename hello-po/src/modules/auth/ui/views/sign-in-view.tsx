"use client";

import { Card, CardContent } from "@/components/ui/card";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { OctagonAlert, OctagonAlertIcon, CheckCircle } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Alert, AlertTitle } from "@/components/ui/alert";
import { useForm } from "react-hook-form";
import Link from "next/link";
import { authClient } from "@/lib/auth-client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

const formSchema = z.object({
    email: z.string().email(),
    password: z.string().min(1, { message: "Password is required" }),

});

export const SignInView = () => {

    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);
    const [pending, setPending] = useState(false);
    const router = useRouter();

    // Removed auto auth check to prevent session conflicts
    // The server-side check in the page component handles this

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            email: "",
            password: "",
        },
    });

    const onSubmit = async (data: z.infer<typeof formSchema>) => {
        setError(null);
        setSuccess(null);
        setPending(true);

        try {
            console.log('Starting sign-in process...');
            
            // Use Better Auth client directly instead of custom API route
            const authResult = await authClient.signIn.email({
                email: data.email,
                password: data.password,
            });

            console.log('Auth client result:', authResult);

            if (authResult.data && !authResult.error) {
                console.log('Login successful:', authResult.data);
                setSuccess("Signed in successfully! Redirecting...");
                
                // Use Next.js router for better navigation
                setTimeout(async () => {
                    console.log('Redirecting to home page...');
                    console.log('Current location before redirect:', window.location.href);
                    
                    // Check if session is available before redirecting
                    try {
                        const sessionCheck = await authClient.getSession();
                        console.log('Session check before redirect:', sessionCheck);
                    } catch (sessionError) {
                        console.log('Session check failed:', sessionError);
                    }
                    
                    // Try multiple redirect strategies for maximum compatibility
                    try {
                        // First try Next.js router
                        router.push('/');
                        console.log('Next.js router redirect attempted');
                    } catch (routerError) {
                        console.log('Router redirect failed, using window.location:', routerError);
                        // Fallback to window.location
                        window.location.replace("/");
                    }
                }, 2000); // Increased delay to 2 seconds
                
            } else if (authResult.error) {
                console.error('Login failed:', authResult.error);
                setPending(false);
                
                // Better error messages
                if (authResult.error.message?.includes("Invalid credentials") || authResult.error.message?.includes("incorrect")) {
                    setError("Invalid email or password. Please check your credentials and try again.");
                } else if (authResult.error.message?.includes("User not found")) {
                    setError("No account found with this email. Please sign up first.");
                } else {
                    setError(authResult.error.message || "Login failed. Please try again.");
                }
            } else {
                setPending(false);
                setError("Login failed. Please try again.");
            }
        } catch (error: any) {
            console.error('Login error:', error);
            setPending(false);
            
            // Better error messages
            if (error.message?.includes("Invalid credentials") || error.message?.includes("incorrect")) {
                setError("Invalid email or password. Please check your credentials and try again.");
            } else if (error.message?.includes("User not found")) {
                setError("No account found with this email. Please sign up first.");
            } else {
                setError(error.message || "An error occurred during sign in. Please try again.");
            }
        }
    };

    const onSocial = async (provider: "google" | "discord") => {
        setError(null);
        setSuccess(null);
        setPending(true);

        try {
            const result = await authClient.signIn.social({
                provider: provider,
                callbackURL: "/",
            });
            
            // Social login usually redirects automatically
            setSuccess("Redirecting to " + provider + "...");
            
            // Social providers handle their own redirects, no need for manual handling
        } catch (error: any) {
            setPending(false);
            setError(error.message || "An error occurred during social sign in.");
        }
    };

    return (
        <div className="flex min-h-screen flex-col items-center justify-center gap-10 p-6">
                <Card className="w-full max-w-sm overflow-hidden p-0 md:max-w-3xl">
                    <CardContent className="grid p-0 md:grid-cols-2">
                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col justify-center p-6 md:p-8">
                                <div className="flex flex-col gap-6">
                                    <div className="flex flex-col items-center text-center">
                                        <h1 className="text-2xl font-bold">
                                            Welcome back
                                        </h1>
                                        <p className="text-muted-foreground text-balance">
                                            Login to your account
                                        </p>
                                    </div>
                                    <div className="grid gap-4">
                                        <FormField
                                            control={form.control}
                                            name="email"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Email</FormLabel>
                                                    <FormControl>
                                                        <Input type="email" placeholder="JohnDoe@example.com" {...field} />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        <FormField
                                            control={form.control}
                                            name="password"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Password</FormLabel>
                                                    <FormControl>
                                                        <Input type="password" placeholder="********" {...field} />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </div>
                                    {!!error && (
                                        <Alert className="bg-destructive/10 border-none ">
                                            <OctagonAlertIcon className="h-4 w-4 !text-destructive" />
                                            <AlertTitle>{error}</AlertTitle>
                                        </Alert>
                                    )}
                                    {!!success && (
                                        <Alert className="bg-green-50 border-green-200 border-none">
                                            <CheckCircle className="h-4 w-4 !text-green-600" />
                                            <AlertTitle className="text-green-800">
                                                {success}
                                            </AlertTitle>
                                        </Alert>
                                    )}
                                    <Button disabled={pending || !!success} type="submit" className="w-full">
                                        {pending ? "Signing in..." : success ? "Redirecting..." : "Sign In"}
                                    </Button>
                                    {error && error.includes("No account found") && (
                                        <Button 
                                            type="button" 
                                            variant="outline" 
                                            className="w-full" 
                                            onClick={() => router.push("/sign-up")}
                                        >
                                            Create New Account
                                        </Button>
                                    )}
                                    <div className="relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t after:border-border">
                                        <span className="relative z-10 bg-background px-2 text-muted-foreground">
                                            or
                                        </span>
                                    </div>
                                    <div className="flex gap-4 justify-center">
                                        <Button disabled={pending || !!success} onClick={() => onSocial("google")}
                                            variant="outline" type="button" className="px-8 py-6 flex items-center justify-center">
                                            <img src="/google.svg" alt="Google" className="w-6 h-6" />
                                        </Button>
                                        <Button disabled={pending || !!success} onClick={() => onSocial("discord")} variant="outline" type="button" className="px-8 py-6 flex items-center justify-center">
                                            <img src="/discord.svg" alt="Discord" className="w-6 h-6" />
                                        </Button>
                                    </div>
                                    <div className="text-center text-sm">
                                        Don't have an account? <Link href="/sign-up" className="underline underline-offset-4">
                                            Sign up
                                        </Link>
                                    </div>
                                </div>
                            </form>
                        </Form>

                        <div className="bg-zinc-100 relative hidden md:flex flex-col gap-y-4 items-center justify-center">
                            <img src="/logoipsum-381.svg" alt="Image" className="h-[92px] w-[92px]" />
                            <p className="text-2xl font-semibold text-zinc-900">
                                Hello Po
                            </p>
                        </div>
                    </CardContent>
                </Card>

                <div className="w-full max-w-sm text-center text-xs text-balance text-muted-foreground md:max-w-3xl">
                    By clicking continue, you agree to our{" "}
                    <Link href="/terms" className="underline underline-offset-4 hover:text-primary">
                        Terms of Service
                    </Link>{" "}
                    and{" "}
                    <Link href="/privacy" className="underline underline-offset-4 hover:text-primary">
                        Privacy Policy
                    </Link>
                </div>
            </div>
        );
}