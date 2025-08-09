import { EmptyState } from "@/components/empty-state"
import { Button } from "@/components/ui/button"
import { Loader2Icon, HomeIcon } from "lucide-react"
import Link from "next/link"

interface Props {
	meetingId: string,
}

export const ProcessingState = ({
	meetingId,
}: Props) => {
	return (
		<div className="bg-white rounded-lg px-4 py-5 flex flex-col gap-y-8 items-center justify-center">
			<EmptyState image="/processing.svg" title="Processing meeting" description="Your meeting is being processed. This may take a few minutes." />
			<div className="flex items-center gap-2 text-sm text-muted-foreground">
				<Loader2Icon className="h-4 w-4 animate-spin" />
				Processing...
			</div>
			<div className="flex flex-col-reverse lg:flex-row lg:justify-center items-center gap-2 w-full">
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