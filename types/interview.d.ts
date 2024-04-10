declare interface FetchIvQuestion {
	selectedStyleRadio: string
	selectedLevelRadio: string
	selectedSkillRadios: string[]
}

declare interface UserAnswer {
	question_id: string
	question_text: string
	skills: string[]
	answer: string
	recording_url: string
	video_url: string
	commonUUID: string
}

declare interface Questions {
	question_id: string
	question_text: string
	skills: string[]
	value: string
	label: string
	video: string
	text: string
}

declare interface CurrentJobInfo {
	name?: string
	position_id?: string
}

declare interface InterviewAnswer {
	currentJobInfo: CurrentJobInfo
	ivCustomParams: FetchIvQuestion
	answers: UserAnswer[]
	sessionId: string
	startedAt: string
	endedAt: string
}

interface InterviewStatus {
	is_completed?: boolean // 假设您的代码中有这个字段，我在此添加它
	is_assessed?: boolean // 同上
	is_passed?: boolean // 同上
	is_feedback_generated: boolean
}

declare interface Interviews {
	session_id: string
	interview_started_at: string
	interview_ended_at: string
	interview_duration: string
	interview_level?: string
	interview_style?: string
	position_name: string
	label: string
	video: string
	text: string
	status: InterviewStatus
	answers: any
}

declare interface IvHsitory {
	pageNo: number
	pageSize: number
}

declare interface IvFeedback {
	session_id: string
}
