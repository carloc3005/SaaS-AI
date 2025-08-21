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
      toast.success(`${type === 'pin' ? 'PIN' : 'Link'} copied to clipboard!`);
    } catch (err) {
      toast.error('Failed to copy to clipboard');
    }
  };

  const meetingUrl = createdMeeting ? `${window.location.origin}/call/${createdMeeting.id}` : "";

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
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
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-green-600" />
                Private Meeting Created!
              </DialogTitle>
              <DialogDescription>
                Your private meeting has been created successfully. Share the details below with participants.
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4">
              {/* Meeting Details */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg">{createdMeeting.name}</CardTitle>
                  <CardDescription className="flex items-center gap-2">
                    <Lock className="h-4 w-4" />
                    Private Meeting
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* PIN */}
                  {createdMeeting.pin && (
                    <div>
                      <label className="text-sm font-medium text-gray-700">Meeting PIN</label>
                      <div className="flex items-center gap-2 mt-1">
                        <div className="bg-purple-50 border border-purple-200 rounded-lg px-4 py-3 font-mono text-xl font-bold text-purple-900 tracking-widest flex-1 text-center">
                          {createdMeeting.pin}
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => copyToClipboard(createdMeeting.pin, 'pin')}
                          className="shrink-0"
                        >
                          {copiedPin ? <CheckCircle className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                        </Button>
                      </div>
                      <p className="text-xs text-gray-500 mt-1">
                        Participants will need this PIN to join the meeting
                      </p>
                    </div>
                  )}
                  
                  {/* Meeting Link */}
                  <div>
                    <label className="text-sm font-medium text-gray-700">Meeting Link</label>
                    <div className="flex items-center gap-2 mt-1">
                      <div className="bg-gray-50 border rounded-lg px-3 py-2 text-sm font-mono flex-1 truncate">
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
                  </div>
                </CardContent>
              </Card>

              {/* Actions */}
              <div className="flex gap-2">
                <Button
                  onClick={() => window.open(meetingUrl, '_blank')}
                  className="flex-1 bg-purple-600 hover:bg-purple-700"
                >
                  Join Meeting Now
                </Button>
                <Button variant="outline" onClick={handleClose}>
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
