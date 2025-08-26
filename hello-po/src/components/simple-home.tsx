"use client";

export const SimpleHomeView = () => {
    console.log("SimpleHomeView render");

    return (
        <div className="flex min-h-screen flex-col items-center justify-center gap-10 p-6">
            <div className="text-center">
                <h1 className="text-4xl font-bold mb-4">Welcome Home!</h1>
                <p className="text-lg text-gray-600 mb-8">
                    You are now on the home page - No Auth Logic
                </p>
                <a 
                    href="/sign-in" 
                    className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                    Go to Sign In
                </a>
            </div>
        </div>
    );
};
