import { EmptyState } from "@/components/empty-state"
import { Button } from "@/components/ui/button"
import { CalendarPlusIcon, HomeIcon, DownloadIcon } from "lucide-react"
import Link from "next/link"

interface Props {
	meetingId: string,
	onDownloadRecording?: () => void,
	isDownloading?: boolean,
}

export const CompletedState = ({
	meetingId,
	onDownloadRecording,
	isDownloading = false,
}: Props) => {
	return (
		<div className="bg-white rounded-lg px-4 py-5 flex flex-col gap-y-8 items-center justify-center">
			<EmptyState image="/completed.svg" title="Meeting completed" description="The meeting has ended successfully. You can download the recording if available." />
			<div className="flex flex-col-reverse lg:flex-row lg:justify-center items-center gap-2 w-full">
				{onDownloadRecording && (
					<Button variant="secondary" className="w-full lg:w-auto" onClick={onDownloadRecording} disabled={isDownloading}>
						<DownloadIcon />
						{isDownloading ? "Downloading..." : "Download recording"}
					</Button>
				)}
				<Button variant="secondary" asChild className="w-full lg:w-auto">
					<Link href="/meetings">
						<CalendarPlusIcon />
						Schedule new meeting
					</Link>
				</Button>
				<Button asChild className="w-full lg:w-auto">
					<Link href="/dashboard">
						<HomeIcon />
						Back to dashboard
					</Link>
				</Button>
			</div>
		</div>
	)
}