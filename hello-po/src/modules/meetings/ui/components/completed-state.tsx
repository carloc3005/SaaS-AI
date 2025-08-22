"use client";

import { EmptyState } from "@/components/empty-state"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { CalendarPlusIcon, HomeIcon, PlayIcon, BrainIcon, MessageSquareIcon, CheckCircleIcon, SearchIcon, CopyIcon, DownloadIcon } from "lucide-react"
import Link from "next/link"
import { useState, useEffect } from "react"
import Highlighter from "react-highlight-words"

interface Props {
	meetingId: string,
	summary?: string | null,
	recordingUrl?: string | null,
	onDownloadRecording?: () => void,
	isDownloading?: boolean,
}

export const CompletedState = ({
	meetingId,
	summary,
	recordingUrl,
	onDownloadRecording,
	isDownloading = false,
}: Props) => {
	const [activeTab, setActiveTab] = useState("summary");
	const [searchTerm, setSearchTerm] = useState("");
	const [isClient, setIsClient] = useState(false);

	useEffect(() => {
		setIsClient(true);
	}, []);

	const highlightText = (text: string) => {
		const searchWords = searchTerm.trim() ? searchTerm.trim().split(/\s+/) : [];
		
		if (searchWords.length === 0) {
			return <span>{text}</span>;
		}
		
		return (
			<Highlighter
				highlightClassName="bg-yellow-200 text-yellow-900 px-1 rounded font-medium"
				searchWords={searchWords}
				autoEscape={true}
				textToHighlight={text}
			/>
		);
	};

	const handleCopySummary = async () => {
		if (summary && isClient && typeof navigator !== 'undefined') {
			try {
				await navigator.clipboard.writeText(summary);
				// You could add a toast notification here
			} catch (err) {
				console.error('Failed to copy summary:', err);
			}
		}
	};

	const handleDownloadSummary = () => {
		if (summary && isClient && typeof document !== 'undefined') {
			const blob = new Blob([summary], { type: 'text/markdown' });
			const url = URL.createObjectURL(blob);
			const a = document.createElement('a');
			a.href = url;
			a.download = `meeting-summary-${meetingId}.md`;
			document.body.appendChild(a);
			a.click();
			document.body.removeChild(a);
			URL.revokeObjectURL(url);
		}
	};

	const renderSummaryContent = (text: string) => {
		// Simple summary rendering without complex parsing
		return (
			<div className="space-y-4">
				<div className="mb-6">
					<h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-3">
						<span className="w-6 h-6 bg-blue-500 rounded-lg flex items-center justify-center">
							<CheckCircleIcon className="w-3 h-3 text-white" />
						</span>
						Meeting Summary
					</h2>
					<div className="text-gray-700 leading-relaxed space-y-3">
						{text.split('\n').map((line, idx) => 
							line.trim() ? (
								<p key={idx} className="pl-9">{highlightText(line.trim())}</p>
							) : null
						)}
					</div>
				</div>
			</div>
		);
	};

	return (
		<div className="flex-1 bg-gray-50">
			{/* Header - aligned with sidebar */}
			<div className="bg-white border-b border-gray-200">
				<div className="px-6 py-6">
					<div className="flex items-center justify-between">
						<div className="flex items-center gap-4">
							<div className="w-10 h-10 bg-green-500 rounded-xl flex items-center justify-center">
								<CheckCircleIcon className="h-5 w-5 text-white" />
							</div>
							<div>
								<h1 className="text-xl font-bold text-gray-900">Meeting Completed</h1>
								<p className="text-sm text-gray-600">Review your meeting content and insights</p>
							</div>
						</div>
						<div className="flex items-center gap-3">
							<Button variant="outline" size="sm" asChild>
								<Link href="/meetings">
									<CalendarPlusIcon className="h-4 w-4 mr-2" />
									New Meeting
								</Link>
							</Button>
							<Button size="sm" asChild>
								<Link href="/dashboard">
									<HomeIcon className="h-4 w-4 mr-2" />
									Dashboard
								</Link>
							</Button>
						</div>
					</div>
				</div>
			</div>

			{/* Main Content - aligned with sidebar */}
			<div className="px-6 py-6">
				<Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
					<TabsList className="bg-white border border-gray-200 p-1 rounded-lg shadow-sm mb-6">
						<TabsTrigger 
							value="summary" 
							className="flex items-center gap-2 px-4 py-2 data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700 rounded-md"
						>
							<BrainIcon className="h-4 w-4" />
							AI Summary
						</TabsTrigger>
						<TabsTrigger 
							value="recording" 
							className="flex items-center gap-2 px-4 py-2 data-[state=active]:bg-red-50 data-[state=active]:text-red-700 rounded-md"
						>
							<PlayIcon className="h-4 w-4" />
							Recording
						</TabsTrigger>
					</TabsList>
					
					{/* Summary Tab */}
					<TabsContent value="summary" className="mt-0">
						<div className="bg-white rounded-lg border border-gray-200 shadow-sm">
							{summary ? (
								<div className="p-6">
									{/* Search and Actions Bar */}
									<div className="mb-6 flex items-center justify-between gap-3 pb-4 border-b border-gray-100">
										<div className="relative flex-1 max-w-md">
											<SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
											<Input
												type="text"
												placeholder="Search in summary and notes..."
												value={searchTerm}
												onChange={(e) => setSearchTerm(e.target.value)}
												className="pl-10"
											/>
										</div>
										<div className="flex items-center gap-2">
											{searchTerm && (
												<Button
													variant="ghost"
													size="sm"
													onClick={() => setSearchTerm("")}
												>
													Clear
												</Button>
											)}
											{isClient && (
												<>
													<Button
														variant="outline"
														size="sm"
														onClick={handleCopySummary}
													>
														<CopyIcon className="h-4 w-4 mr-2" />
														Copy
													</Button>
													<Button
														variant="outline"
														size="sm"
														onClick={handleDownloadSummary}
													>
														<DownloadIcon className="h-4 w-4 mr-2" />
														Download
													</Button>
												</>
											)}
										</div>
									</div>
									{renderSummaryContent(summary)}
								</div>
							) : (
								<div className="p-12 text-center">
									<div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mx-auto mb-4">
										<BrainIcon className="h-6 w-6 text-blue-600" />
									</div>
									<h3 className="text-lg font-semibold text-gray-900 mb-2">Generating AI Summary</h3>
									<p className="text-gray-600 mb-4">Our AI is analyzing your meeting content...</p>
									<div className="flex items-center justify-center space-x-1">
										<div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
										<div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" style={{animationDelay: '0.2s'}}></div>
										<div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" style={{animationDelay: '0.4s'}}></div>
									</div>
								</div>
							)}
						</div>
					</TabsContent>
					
					{/* Recording Tab */}
					<TabsContent value="recording" className="mt-0">
						<div className="bg-white rounded-lg border border-gray-200 shadow-sm">
							{recordingUrl ? (
								<div className="p-6">
									<div className="flex items-center justify-between mb-6">
										<div>
											<h3 className="text-lg font-semibold text-gray-900">Meeting Recording</h3>
											<p className="text-sm text-gray-600">Watch the full meeting playback</p>
										</div>
										<Button 
											onClick={onDownloadRecording} 
											disabled={isDownloading}
											size="sm"
											className="bg-red-600 hover:bg-red-700"
										>
											{isDownloading ? "Downloading..." : "Download"}
										</Button>
									</div>
									<div className="bg-black rounded-lg overflow-hidden">
										<video 
											controls 
											className="w-full aspect-video"
											src={recordingUrl}
										>
											Your browser does not support the video tag.
										</video>
									</div>
								</div>
							) : (
								<div className="p-12 text-center">
									<div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center mx-auto mb-4">
										<PlayIcon className="h-6 w-6 text-red-600" />
									</div>
									<h3 className="text-lg font-semibold text-gray-900 mb-2">Processing Recording</h3>
									<p className="text-gray-600 mb-4">Your meeting recording is being processed...</p>
									<div className="flex items-center justify-center space-x-1">
										<div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
										<div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" style={{animationDelay: '0.2s'}}></div>
										<div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" style={{animationDelay: '0.4s'}}></div>
									</div>
								</div>
							)}
						</div>
					</TabsContent>
				</Tabs>
			</div>
		</div>
	)
}