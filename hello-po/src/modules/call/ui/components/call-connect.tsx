"use client"

import { useState, useEffect } from "react";
import { LoaderIcon } from "lucide-react";
import { useTRPC } from "@/trpc/client";
import { useMutation } from "@tanstack/react-query";
import {
	Call,
	CallingState,
	StreamCall,
	StreamVideo,
	StreamVideoClient,
} from "@stream-io/video-react-sdk"

import "@stream-io/video-react-sdk/css/styles.css"

interface Props {
	meetingId: string;
	meetingName: string;
	userId: string;
	userName: string;
	userImage: string;
}

export const CallConnect = ({
	meetingId,
	meetingName,
	userId,
	userName,
	userImage
}: Props) => {
	const trpc = useTRPC();
	const {mutateAsync: generateToken} = useMutation(
		trpc.meetings.generateToken.mutationOptions(),
	);

	const [client, setClient] = useState<StreamVideoClient>();
	useEffect (() => {
		const _client = new StreamVideoClient({
			apiKey: process.env.NEXT_PUBLIC_STREAM_VIDEO_API_KEY!,
			user: {
				id: userId,
				name: userName,
				image: userImage,
			},
			tokenProvider: generateToken
		})
	}, []);

	return (
		<div>
			Call Connect
		</div>
	)
}