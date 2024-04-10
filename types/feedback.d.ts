declare interface interviewInfoType {
	session_id?: string
	position_name: string
	industry_name: string
	interview_started_at: string
	interview_ended_at: string
	interview_duration: string
	interview_level_name: string
	interview_style_name: string
}

declare interface Evaluation {
	label: string
	message: string
	color: string
}

declare interface QuestionsFeedback {
	question: string
	feedbacks: Feedback[]
	// ... 其他属性
}

// 定义一个接口来描述每个反馈的结构
declare interface Feedback {
	index: string
	type: string
	score: string
	description: string
}
