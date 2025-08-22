import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Lock, Copy, CheckCircle } from "lucide-react";
import { useState } from "react";
import { PrivateMeetingForm } from "./private-meeting-form";
import { toast } from "sonner";

interface PrivateMeetingDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const PrivateMeetingDialog = ({ open, onOpenChange }: PrivateMeetingDialogProps) => {
  const [createdMeeting, setCreatedMeeting] = useState<any>(null);
  const [copiedPin, setCopiedPin] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  const handleSuccess = (meetingData: any) => {
    console.log("Meeting created:", meetingData);
    setCreatedMeeting(meetingData);
  };

  const handleClose = () => {
    setCreatedMeeting(null);
    setCopiedPin(false);
    setCopiedLink(false);
    onOpenChange(false);
  };

  const copyToClipboard = async (text: string, type: 'pin' | 'link') => {
    try {
      await navigator.clipboard.writeText(text);
      if (type === 'pin') {
        setCopiedPin(true);
        setTimeout(() => setCopiedPin(false), 2000);
      } else {
        setCopiedLink(true);
        setTimeout(() => setCopiedLink(false), 2000);
      }
      toast.success(`${type === 'pin' ? 'PIN' : 'Meeting link'} copied to clipboard!`);
    } catch (err) {
      toast.error('Failed to copy to clipboard');
    }
  };

  const meetingUrl = createdMeeting ? `${window.location.origin}/call/${createdMeeting.id}` : "";

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-lg">
        {!createdMeeting ? (
          <>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Lock className="h-5 w-5 text-purple-600" />
                Create Private Meeting
              </DialogTitle>
              <DialogDescription>
                Create a secure, encrypted meeting with a 4-digit PIN for access.
              </DialogDescription>
            </DialogHeader>
            <PrivateMeetingForm 
              onSuccess={handleSuccess}
              onCancel={() => onOpenChange(false)}
            />
          </>
        ) : (
          <>
            <DialogHeader className="text-center">
              <DialogTitle className="flex items-center justify-center gap-2 text-xl">
                <CheckCircle className="h-6 w-6 text-green-600" />
                Private Meeting Created!
              </DialogTitle>
              <DialogDescription className="text-center">
                Your secure meeting room is ready. Share these details with participants.
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-6">
              {/* Meeting Name */}
              <div className="text-center">
                <h3 className="text-lg font-semibold text-gray-900">{createdMeeting.name}</h3>
                <div className="flex items-center justify-center gap-2 text-sm text-gray-600 mt-1">
                  <Lock className="h-4 w-4" />
                  Private Meeting
                </div>
              </div>

              {/* PIN - Centered and Prominent */}
              {createdMeeting.pin && (
                <div className="text-center py-6">
                  <label className="text-sm font-medium text-gray-700 block mb-3">Meeting PIN</label>
                  <div className="bg-gradient-to-br from-purple-50 to-purple-100 border-2 border-purple-200 rounded-2xl p-8 mb-4">
                    <div className="text-4xl font-bold text-purple-900 tracking-[0.5em] font-mono mb-2">
                      {createdMeeting.pin}
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => copyToClipboard(createdMeeting.pin, 'pin')}
                      className="mt-4 border-purple-300 text-purple-700 hover:bg-purple-50"
                    >
                      {copiedPin ? (
                        <>
                          <CheckCircle className="h-4 w-4 mr-2" />
                          Copied!
                        </>
                      ) : (
                        <>
                          <Copy className="h-4 w-4 mr-2" />
                          Copy PIN
                        </>
                      )}
                    </Button>
                  </div>
                  <p className="text-sm text-gray-500">
                    Participants need this PIN to join the meeting
                  </p>
                </div>
              )}
              
              {/* Meeting Link */}
              <Card className="border-gray-200">
                <CardContent className="p-4">
                  <label className="text-sm font-medium text-gray-700 block mb-2">Meeting Link</label>
                  <div className="flex items-center gap-2">
                    <div className="bg-gray-50 border rounded-lg px-3 py-2 text-sm font-mono flex-1 truncate text-gray-700">
                      {meetingUrl}
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => copyToClipboard(meetingUrl, 'link')}
                      className="shrink-0"
                    >
                      {copiedLink ? <CheckCircle className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Actions */}
              <div className="flex gap-3 pt-4">
                <Button
                  onClick={() => window.open(meetingUrl, '_blank')}
                  className="flex-1 bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white"
                >
                  Join Meeting Now
                </Button>
                <Button variant="outline" onClick={handleClose} className="px-6">
                  Done
                </Button>
              </div>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};
