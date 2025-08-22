"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { LockIcon, ShieldIcon, EyeOffIcon, UserCheckIcon, KeyIcon, VideoOffIcon } from "lucide-react"
import Link from "next/link"
import { useState } from "react"
import { PrivateMeetingDialog } from "@/modules/meetings/ui/components/private-meeting-dialog"

export default function PrivateMeetingsPage() {
  const [dialogOpen, setDialogOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-indigo-50">
      {/* Private Meeting Dialog */}
      <PrivateMeetingDialog open={dialogOpen} onOpenChange={setDialogOpen} />
      
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-purple-100">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
              <LockIcon className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Private Meetings</h1>
              <p className="text-gray-600 mt-1">Secure conversations with enhanced privacy</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-purple-100 text-purple-800 px-4 py-2 rounded-full text-sm font-medium mb-4">
            <ShieldIcon className="h-4 w-4" />
            Enhanced Security
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Start Your Private Meeting</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Create secure meeting rooms with PIN protection and advanced privacy features for confidential discussions.
          </p>
        </div>

        {/* Create Meeting CTA */}
        <div className="text-center mb-16">
          <Button 
            size="lg"
            className="bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white px-8 py-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105"
            onClick={() => setDialogOpen(true)}
          >
            <LockIcon className="h-5 w-5 mr-2" />
            Create Private Meeting
          </Button>
          <div className="mt-4">
            <Button variant="ghost" asChild className="text-gray-600">
              <Link href="/meetings">
                ← Back to All Meetings
              </Link>
            </Button>
          </div>
        </div>

        {/* Feature Grid */}
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3 mb-16">
          <Card className="border-0 shadow-lg bg-white/60 backdrop-blur-sm hover:shadow-xl transition-all duration-300 group">
            <CardHeader className="text-center pb-4">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                <ShieldIcon className="h-8 w-8 text-white" />
              </div>
              <CardTitle className="text-xl text-gray-900">Secure Encryption</CardTitle>
              <CardDescription className="text-gray-600 leading-relaxed">
                Your conversations are protected with advanced encryption technology
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="border-0 shadow-lg bg-white/60 backdrop-blur-sm hover:shadow-xl transition-all duration-300 group">
            <CardHeader className="text-center pb-4">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                <VideoOffIcon className="h-8 w-8 text-white" />
              </div>
              <CardTitle className="text-xl text-gray-900">No Recording</CardTitle>
              <CardDescription className="text-gray-600 leading-relaxed">
                Private meetings are never recorded to ensure complete confidentiality
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="border-0 shadow-lg bg-white/60 backdrop-blur-sm hover:shadow-xl transition-all duration-300 group">
            <CardHeader className="text-center pb-4">
              <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                <KeyIcon className="h-8 w-8 text-white" />
              </div>
              <CardTitle className="text-xl text-gray-900">PIN Protection</CardTitle>
              <CardDescription className="text-gray-600 leading-relaxed">
                Access controlled with secure 4-digit PIN codes for invited participants only
              </CardDescription>
            </CardHeader>
          </Card>
        </div>

        {/* Additional Features */}
        <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-8 shadow-lg">
          <h3 className="text-xl font-bold text-gray-900 mb-6 text-center">Why Choose Private Meetings?</h3>
          <div className="grid gap-6 md:grid-cols-2">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center shrink-0">
                <UserCheckIcon className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 mb-1">Controlled Access</h4>
                <p className="text-gray-600 text-sm">Only invited participants with the correct PIN can join your meeting</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center shrink-0">
                <EyeOffIcon className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 mb-1">Privacy First</h4>
                <p className="text-gray-600 text-sm">Enhanced privacy controls ensure your sensitive discussions stay private</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
