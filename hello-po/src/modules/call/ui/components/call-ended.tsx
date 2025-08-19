import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircleIcon, HomeIcon } from "lucide-react";
import Link from "next/link";

export const CallEnded = () => {
    return (
        <div className="min-h-screen bg-background flex items-center justify-center p-4">
            <div className="w-full max-w-4xl">
                <Card className="mx-auto max-w-md">
                    <CardHeader className="text-center">
                        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/20">
                            <CheckCircleIcon className="h-8 w-8 text-green-600 dark:text-green-400" />
                        </div>
                        <CardTitle className="text-xl">Call Ended</CardTitle>
                        <p className="text-sm text-muted-foreground">
                            Thank you for using our platform
                        </p>
                    </CardHeader>
                    
                    <CardContent className="space-y-6">
                        {/* Call Summary */}
                        <div className="p-4 bg-muted rounded-lg text-center">
                            <p className="text-sm text-muted-foreground">
                                Your call has ended successfully
                            </p>
                        </div>

                        {/* Return Home Button */}
                        <Button 
                            asChild
                            className="w-full"
                            size="lg"
                        >
                            <Link href="/">
                                <HomeIcon className="size-4 mr-2" />
                                Return to Dashboard
                            </Link>
                        </Button>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
