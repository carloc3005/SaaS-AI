import { EmptyState } from "@/components/empty-state"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CalendarPlusIcon, HomeIcon, PlayIcon, BrainIcon, MessageSquareIcon, SparklesIcon, CheckCircleIcon } from "lucide-react"
import Link from "next/link"
import { useState } from "react"

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

	const formatSummary = (text: string) => {
		// Split the text into sections
		const sections = text.split(/(?=###)/);
		
		return sections.map((section, index) => {
			if (section.trim().startsWith('### Overview')) {
				const content = section.replace('### Overview', '').trim();
				return `<div key=${index} class="mb-8">
					<h2 class="text-xl font-bold text-gray-900 mb-4 flex items-center gap-3">
						<span class="w-6 h-6 bg-blue-500 rounded-lg flex items-center justify-center">
							<svg class="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
								<path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
							</svg>
						</span>
						Overview
					</h2>
					<p class="text-gray-700 leading-relaxed pl-9">${content}</p>
				</div>`;
			} else if (section.trim().startsWith('### Notes')) {
				let content = section.replace('### Notes', '').trim();
				
				// Parse subsections within Notes
				const noteSections = content.split(/(?=####)/);
				
				const formattedNotes = noteSections.map((noteSection, noteIndex) => {
					if (noteSection.trim().startsWith('####')) {
						const lines = noteSection.split('\n');
						const title = lines[0].replace('####', '').trim();
						const bullets = lines.slice(1).filter(line => line.trim().startsWith('-'));
						
						return `<div class="mb-6">
							<h4 class="text-base font-semibold text-gray-800 mb-3 flex items-center gap-2">
								<span class="w-1.5 h-1.5 bg-blue-500 rounded-full"></span>
								${title}
							</h4>
							<ul class="space-y-2 ml-6">
								${bullets.map(bullet => `<li class="flex items-start gap-3 text-gray-700">
									<span class="w-1 h-1 bg-gray-400 rounded-full mt-2 flex-shrink-0"></span>
									<span>${bullet.replace('-', '').trim()}</span>
								</li>`).join('')}
							</ul>
						</div>`;
					}
					return '';
				}).join('');
				
				return `<div key=${index} class="mb-8">
					<h2 class="text-xl font-bold text-gray-900 mb-6 flex items-center gap-3">
						<span class="w-6 h-6 bg-teal-500 rounded-lg flex items-center justify-center">
							<svg class="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
								<path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z"/>
								<path fill-rule="evenodd" d="M4 5a2 2 0 012-2v1a1 1 0 102 0V3a2 2 0 012 2v6a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 2a1 1 0 000 2h2a1 1 0 100-2H7zm0 4a1 1 0 100 2h2a1 1 0 100-2H7z" clip-rule="evenodd"/>
							</svg>
						</span>
						Key Notes
					</h2>
					<div class="space-y-4 pl-9">
						${formattedNotes}
					</div>
				</div>`;
			}
			return '';
		}).join('');
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
						<TabsTrigger 
							value="ask-ai" 
							className="flex items-center gap-2 px-4 py-2 data-[state=active]:bg-purple-50 data-[state=active]:text-purple-700 rounded-md"
						>
							<MessageSquareIcon className="h-4 w-4" />
							Ask AI
						</TabsTrigger>
					</TabsList>
					
					{/* Summary Tab */}
					<TabsContent value="summary" className="mt-0">
						<div className="bg-white rounded-lg border border-gray-200 shadow-sm">
							{summary ? (
								<div className="p-6">
									<div 
										className="max-w-none"
										dangerouslySetInnerHTML={{ 
											__html: formatSummary(summary)
										}}
									/>
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
					
					{/* Ask AI Tab */}
					<TabsContent value="ask-ai" className="mt-0">
						<div className="bg-white rounded-lg border border-gray-200 shadow-sm p-12 text-center">
							<div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mx-auto mb-4">
								<MessageSquareIcon className="h-6 w-6 text-purple-600" />
							</div>
							<h3 className="text-lg font-semibold text-gray-900 mb-2">Ask AI About This Meeting</h3>
							<p className="text-gray-600 mb-6 max-w-md mx-auto">
								Chat with AI to get deeper insights, ask questions, and explore meeting content in detail.
							</p>
							<div className="bg-purple-50 rounded-lg p-4 border border-purple-100 max-w-lg mx-auto">
								<p className="text-purple-700 font-medium mb-1">🚀 Coming Soon</p>
								<p className="text-gray-600 text-sm">
									We're building an intelligent chat interface for your meeting insights.
								</p>
							</div>
						</div>
					</TabsContent>
				</Tabs>
			</div>
		</div>
	)
}