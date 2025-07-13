"use client";

import { Card, CardContent } from "@/components/ui/card";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { OctagonAlert, OctagonAlertIcon } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Alert, AlertTitle } from "@/components/ui/alert";
import { useForm } from "react-hook-form";
import Link from "next/link";
import { authClient } from "@/lib/auth-client";
import { useState } from "react";

const formSchema = z.object({
    email: z.string().email(),
    password: z.string().min(1, { message: "Password is required" }),

});

export const SignInView = () => {

    const [error, setError] = useState<string | null>(null);
    const [pending, setPending] = useState(false);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            email: "",
            password: "",
        },
    });

    const onSubmit = (data: z.infer<typeof formSchema>) => {
        setError(null);
        setPending(true);

        authClient.signIn.email({
            email: data.email,
            password: data.password,

            callbackURL: "/"
        },
            {
                onSuccess: () => {
                    setPending(false);
                },
                onError: ({ error }) => {
                    setPending(false);
                    setError(error.message)
                },
            }
        );

    };

    const onSocial = (provider: "github" | "google" | "discord" | "spotify") => {
        setError(null);
        setPending(true);

        authClient.signIn.social({
            provider: provider,
            callbackURL: "/",
        },
            {
                onSuccess: () => {
                    setPending(false)
                },
                onError: ({ error }) => {
                    setPending(false);
                    setError(error.message)
                },
            }
        );
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
                                    <Button disabled={pending} type="submit" className="w-full">
                                        Sign In
                                    </Button>
                                    <div className="relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t after:border-border">
                                        <span className="relative z-10 bg-background px-2 text-muted-foreground">
                                            or
                                        </span>
                                    </div>
                                    <div className="grid grid-cols-4 gap-4">
                                        <Button disabled={pending} onClick={() => onSocial("google")}
                                            variant="outline" type="button" className="w-full flex items-center justify-center">
                                            <img src="/google.svg" alt="Google" className="w-5 h-5" />
                                        </Button>
                                        <Button disabled={pending} onClick={() => onSocial("discord")} variant="outline" type="button" className="w-full flex items-center justify-center">
                                            <img src="/discord.svg" alt="Discord" className="w-5 h-5" />
                                        </Button>
                                        <Button disabled={pending} onClick={() => onSocial("spotify")} variant="outline" type="button" className="w-full flex items-center justify-center">
                                            <img src="/spotify.svg" alt="Spotify" className="w-5 h-5" />
                                        </Button>
                                        <Button disabled={pending} onClick={() => onSocial("github")} variant="outline" type="button" className="w-full flex items-center justify-center">
                                            <img src="/github.svg" alt="GitHub" className="w-5 h-5" />
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