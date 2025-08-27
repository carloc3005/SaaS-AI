import { auth } from "@/lib/auth";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { email, password } = body;

        console.log('Custom sign-in attempt for:', email);

        // Use the auth library to sign in
        const result = await auth.api.signInEmail({
            body: {
                email,
                password,
            },
            headers: request.headers,
        });

        console.log('Sign-in result:', {
            success: !!result.user,
            hasToken: !!result.token,
            userId: result.user?.id,
            email: result.user?.email
        });

        if (result.user && result.token) {
            // Create response with redirect
            const response = NextResponse.json({
                success: true,
                user: result.user,
                redirect: "/"
            });

            // Set session cookies manually to ensure they're properly set
            if (result.token) {
                response.cookies.set({
                    name: 'better-auth.session_token',
                    value: result.token,
                    httpOnly: true,
                    secure: process.env.NODE_ENV === 'production',
                    sameSite: 'lax',
                    maxAge: 60 * 60 * 24 * 7, // 7 days
                    path: '/'
                });
            }

            return response;
        } else {
            return NextResponse.json({
                success: false,
                error: "Invalid credentials"
            }, { status: 401 });
        }
    } catch (error: any) {
        console.error('Custom sign-in error:', error);
        return NextResponse.json({
            success: false,
            error: error.message || "Sign-in failed"
        }, { status: 500 });
    }
}
