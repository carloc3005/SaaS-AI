"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useTRPC } from "@/trpc/client";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { Lock, LoaderIcon } from "lucide-react";

interface PinVerificationDialogProps {
  open: boolean;
  meetingId: string;
  meetingName: string;
  onSuccess: () => void;
}

export const PinVerificationDialog = ({
  open,
  meetingId,
  meetingName,
  onSuccess,
}: PinVerificationDialogProps) => {
  const [pin, setPin] = useState("");
  const trpc = useTRPC();

  const verifyPin = useMutation(
    trpc.meetings.verifyPin.mutationOptions({
      onSuccess: () => {
        toast.success("PIN verified successfully!");
        onSuccess();
      },
      onError: (error) => {
        toast.error(error.message);
        setPin(""); // Clear the PIN on error
      },
    })
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (pin.length !== 4) {
      toast.error("PIN must be 4 digits");
      return;
    }
    verifyPin.mutate({ id: meetingId, pin });
  };

  const handlePinChange = (value: string) => {
    // Only allow numbers and limit to 4 digits
    const numericValue = value.replace(/\D/g, "").slice(0, 4);
    setPin(numericValue);
  };

  return (
    <Dialog open={open} onOpenChange={() => {}}>
      <DialogContent className="sm:max-w-md" showCloseButton={false}>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-x-2">
            <Lock className="size-5 text-blue-600" />
            Private Meeting Access
          </DialogTitle>
          <DialogDescription>
            "{meetingName}" is a private meeting. Please enter the 4-digit PIN to join.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="pin">Meeting PIN</Label>
            <Input
              id="pin"
              type="text"
              value={pin}
              onChange={(e) => handlePinChange(e.target.value)}
              placeholder="Enter 4-digit PIN"
              className="text-center text-lg tracking-wider font-mono"
              maxLength={4}
              autoComplete="off"
              autoFocus
            />
          </div>
          <div className="flex justify-center">
            <Button 
              type="submit" 
              disabled={pin.length !== 4 || verifyPin.isPending}
              className="w-full"
            >
              {verifyPin.isPending ? (
                <>
                  <LoaderIcon className="size-4 mr-2 animate-spin" />
                  Verifying...
                </>
              ) : (
                "Join Meeting"
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
