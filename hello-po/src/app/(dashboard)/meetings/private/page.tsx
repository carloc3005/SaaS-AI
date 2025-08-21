"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { LockIcon, ShieldIcon, EyeOffIcon } from "lucide-react"
import Link from "next/link"
import { useState } from "react"
import { PrivateMeetingDialog } from "@/modules/meetings/ui/components/private-meeting-dialog"

export default function PrivateMeetingsPage() {
  const [dialogOpen, setDialogOpen] = useState(false);

  return (
    <div className="flex-1 bg-gray-50">
      {/* Private Meeting Dialog */}
      <PrivateMeetingDialog open={dialogOpen} onOpenChange={setDialogOpen} />
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="px-6 py-6">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-purple-500 rounded-xl flex items-center justify-center">
              <LockIcon className="h-5 w-5 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">Private Meetings</h1>
              <p className="text-sm text-gray-600">Secure, encrypted meetings for sensitive discussions</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="px-6 py-6">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {/* Feature Cards */}
          <Card>
            <CardHeader>
              <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center mb-2">
                <ShieldIcon className="h-4 w-4 text-purple-600" />
              </div>
              <CardTitle className="text-lg">End-to-End Encryption</CardTitle>
              <CardDescription>
                All private meetings are protected with military-grade encryption
              </CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center mb-2">
                <EyeOffIcon className="h-4 w-4 text-blue-600" />
              </div>
              <CardTitle className="text-lg">No Recording</CardTitle>
              <CardDescription>
                Private meetings are never recorded to ensure complete privacy
              </CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center mb-2">
                <LockIcon className="h-4 w-4 text-green-600" />
              </div>
              <CardTitle className="text-lg">Invite Only</CardTitle>
              <CardDescription>
                Only invited participants can join your private meetings
              </CardDescription>
            </CardHeader>
          </Card>
        </div>

        {/* Create Private Meeting */}
        <div className="mt-8">
          <Card>
            <CardHeader>
              <CardTitle>Start a Private Meeting</CardTitle>
              <CardDescription>
                Create a secure, encrypted meeting room for sensitive discussions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex gap-4">
                <Button 
                  className="bg-purple-600 hover:bg-purple-700"
                  onClick={() => setDialogOpen(true)}
                >
                  <LockIcon className="h-4 w-4 mr-2" />
                  Create Private Meeting
                </Button>
                <Button variant="outline" asChild>
                  <Link href="/meetings">
                    Back to Meetings
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Coming Soon Notice - Remove this since we're implementing it */}
        {/* 
        <div className="mt-6">
          <Card className="border-purple-200 bg-purple-50">
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <LockIcon className="h-6 w-6 text-purple-600" />
                </div>
                <h3 className="text-lg font-semibold text-purple-900 mb-2">🚀 Coming Soon</h3>
                <p className="text-purple-700 max-w-md mx-auto">
                  We're working on implementing private meetings with advanced security features. 
                  This functionality will be available in the next update.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
        */}
      </div>
    </div>
  )
}
