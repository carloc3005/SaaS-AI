import { EmptyState } from "@/components/empty-state"
import { Button } from "@/components/ui/button"
import { CalendarPlusIcon, HomeIcon } from "lucide-react"
import Link from "next/link"

interface Props {
	meetingId?: string
}

export const CancelledState = ({
	meetingId,
}: Props) => {
	return (
		<div className="bg-white rounded-lg px-4 py-5 flex flex-col gap-y-8 items-center justify-center">
			<EmptyState image="/cancelled.svg" title="Meeting cancelled" description="This meeting has been cancelled and is no longer available" />
			<div className="flex flex-col-reverse lg:flex-row lg:justify-center items-center gap-2 w-full">
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