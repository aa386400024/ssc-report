<template>
	<view  style="position: relative; width: 100vw; height: 100vh;">
		<view>
			<!-- 全屏视频元素，用于播放面试问题或过渡视频 -->
			<video
				class="fullscreen-video position-absolute top-0 left-0"
				autoplay
				http-cache
				:style="videoStyle"
				:src="currentVideo === 'question' ? questionVideoPath : transitionPath"
				:loop="currentVideo === 'transition'"
				:controls="false"
				:show-loading="false"
				:show-center-play-btn="false"
				:show-play-btn="false"
				@ended="videoEnded"
				@loadedmetadata="handleMetadataLoaded"
			></video>
			<view 
			    class="video-mask position-absolute top-0 left-0"
				:style="videoStyle"
			    @touchmove.prevent
			></view>
		</view>
		<!-- 使用同一个位置和大小的容器来显示摄像头或“关闭中”提示 -->
		<view class="camera-wrapper">
			<camera v-if="isCameraActive" device-position="front"></camera>
			<view v-else class="closed-view">摄像头关闭中</view>
		</view> 
		
		<view class="bottom-body padding-xl">
			<view class="question-body border-radius-large">
				<text class="question-text">{{ questionText }}</text>
			</view>
			<view class="btn-wrapper">
				<view 
					class="iconfont toggle-camera-btn" 
					:class="isCameraActive ? 'icon-luxiangguan' : 'icon-luxiang1'" 
					@tap="toggleCamera"
				></view>
				<!-- 根据是否回答中显示不同按钮 -->
				<view class="btn-box">
					<u-button
						v-if="!isAnswering"
						shape="circle" 
						type="primary" 
						size="large" 
						:text="isInterviewFinished ? '结束面试' : '开始答题'"
						:disabled="!canAnswer"
						@click="startAnswering" 
					></u-button>
					<u-button
						v-else
						shape="circle" 
						type="primary" 
						size="large" 
						:text="`回答完毕 ( ${formattedCountdown} )`"
						:disabled="isButtonDisabled"
						@click="debouncedStopAnswering" 
					></u-button>
				</view>
			</view>
		</view>
		<view class="bottom-bg position-absolute bottom-0 left-0 right-0"></view>
	</view>
</template>


<script setup lang="ts">
	import { reactive, ref, toRefs, computed, onMounted, onBeforeUnmount } from 'vue';
	import { debounce } from 'lodash';
	import { fetchIvQuestion, submitInterviewAnswer, audioToText } from '@/api/home';
	import { useInterviewStore } from '@/stores';
	const interviewStore = useInterviewStore();
	const currentJobInfo = computed(() => interviewStore.currentJobInfo);
	const flowNavTitle = currentJobInfo.value ? currentJobInfo.value.name : '模拟面试';
	const ivCustomParams = computed(() => interviewStore.ivCustomParams);
	
	const CONFIG = {
	    INITIAL_COUNTDOWN: 300,
		PROLOGUE_VIDEO_PATH: "https://mp-43f7552d-29af-4d0a-8672-7a2fcdd00dc7.cdn.bspapp.com/interview/iv-prologue.mp4",
		PROLOGUE_VIDEO_TEXT: "您好！欢迎使用我们的AI模拟面试应用。我将会是您今日的面试官。我们致力于为您提供一个公正和真实的面试体验，以帮助您更好地准备实际面试。在开始之前，能请您简短地介绍一下自己吗？",
	    TRANSITION_VIDEO_PATH: "https://mp-43f7552d-29af-4d0a-8672-7a2fcdd00dc7.cdn.bspapp.com/interview/iv-transition.mp4",
	    END_VIDEO_PATH: "https://mp-43f7552d-29af-4d0a-8672-7a2fcdd00dc7.cdn.bspapp.com/interview/iv-end-video.mp4",
		END_VIDEO_TEXT: "您的本次面试已经顺利结束，感谢您的参与与努力。请您稍等片刻，我们正在为您生成专属的面试报告。稍后，您可以在'面试历史'里查看您的面试表现和反馈。再次感谢您，祝您一切顺利！"
		// ... 其他硬编码的值
	};
	
	const RECORDER_OPTIONS = {
		duration: 300000,
		sampleRate: 16000,
		numberOfChannels: 1,
		encodeBitRate: 48000,
		format: 'mp3',
	};

	const myData = reactive({
		sessionId: '',
		commonUUID: '',  // 为录制的视频和音频添加一个共同的UUID属性
		startedAt: '',
		endedAt: '',
		isQuestionsFetched: false,
	    // 视频相关属性
	    video: {
	        recordVideoPath: '',
	        isCameraActive: true, // 预览视频开启状态
	        isRecording: false, // 是否在录制视频中
	        transitionPath: CONFIG.TRANSITION_VIDEO_PATH,
	        questionVideoPath: "",
	        currentVideo: 'question', // 'question', 'transition'
	    },
	
	    // 面试流程属性
	    interview: {
	        isAnswering: false,
	        canAnswer: false,
	        countdown: CONFIG.INITIAL_COUNTDOWN,
	        countdownInterval: null as number | null,
	        questionText: "",
	        isInterviewFinished: false,
	        questions: [] as Questions[],  // 存储所有的面试问题
	        currentQuestionIndex: 0,  // 当前问题的索引
			userAnswers: [] as UserAnswer[],  // 存储用户的回答
			currentVideoUrl: "" // 当前录制的视频传到云存储的url
	    },
	
	    // 界面/显示属性
	    display: {
	        isButtonDisabled: true,
	        sysWidth: 0,
	        sysHeight: 0,
	        videoWidth: 0,
	        videoHeight: 0
	    }
	});
	const {
	    recordVideoPath,
	    isCameraActive,
		isRecording,
		transitionPath,
		questionVideoPath,
		currentVideo
	} = toRefs(myData.video);
	
	const {
	    isAnswering,
	    canAnswer,
	    countdown,
	    countdownInterval,
	    questionText,
	    isInterviewFinished,
	    questions,
	    currentQuestionIndex,
		userAnswers,
		currentVideoUrl
	    // ... 其他面试相关属性
	} = toRefs(myData.interview);
	
	const {
	    isButtonDisabled,
	    sysWidth,
	    sysHeight,
	    videoWidth,
	    videoHeight
	} = toRefs(myData.display);
	
	const cameraCtx = uni.createCameraContext();
	
	// 计算后的视频宽高
	const videoStyle = computed(() => {
	    return {
	        width: `${videoWidth.value}px`,
	        height: `${videoHeight.value}px`
	    };
	});
	
	// 自定义导航标题
	const setCustomNavigationBarTitle = () => {
		uni.setNavigationBarTitle({
			title: flowNavTitle || "模拟面试"
		})
	}
	
	// 倒计时格式化
	const formattedCountdown = computed(() => {
		const minutes = Math.floor(countdown.value / 60);
		const seconds = countdown.value % 60;
		return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
	});
	
	// 倒计时方法
	const startCountdown = () => {
		countdownInterval.value = setInterval(() => {
			if (countdown.value > 0) {
				countdown.value--;
			} else {
				clearInterval(countdownInterval.value!);
				debouncedStopAnswering();  // 使用防抖版本的stopAnswering
			}
		}, 1000);
	};
	
	// 当视频播放结束时，根据当前视频类型进行相应的操作
	const videoEnded = () => {
		if (currentVideo.value === 'question') {
			switchToTransitionVideo();
		} else if (currentVideo.value === 'transition') {
			// ... 其他逻辑
		}
	};
	
	// 切换到过渡视频并更新相关状态
	const switchToTransitionVideo = () => {
	    currentVideo.value = 'transition';
	    canAnswer.value = true;
	    isButtonDisabled.value = false;
	};

	// 开始答题
	const startAnswering = () => {
		if(isInterviewFinished.value) {
			vk.switchTab("/pages/home/index");
		}else {
			
			isAnswering.value = true;
			isButtonDisabled.value = false;
			canAnswer.value = false;
			startCountdown();
			if (isCameraActive.value) {
			    startRecord();
			}
			startRecordingAudio();
		}
		
	}
	
	// 计算属性，判断是否为最后一个面试问题
	const isLastQuestion = computed(() => {
	    // 如果当前问题索引等于问题数组长度减1，返回true，否则返回false
	    const result = currentQuestionIndex.value === questions.value.length - 1;
	    return result;
	});
	
	// 创建一个任务队列，用于存储一系列的异步任务
	const taskQueue: Array<() => Promise<void>> = [];
	// 用于标识是否正在处理任务队列
	let isProcessingQueue = false;
	
	// 定义一个异步函数来处理任务队列
	const processQueue = async (onComplete: () => void) => {
	    // 如果正在处理任务队列或者任务队列为空，则调用onComplete回调并返回
	    if (isProcessingQueue || taskQueue.length === 0) {
	        onComplete();
	        return;
	    }
	
	    // 标记为正在处理任务队列
	    isProcessingQueue = true;
	
	    // 从任务队列中取出一个任务
	    const task = taskQueue.shift();
	
	    // 如果存在任务，则等待任务完成
	    if (task) {
	        await task();
	    }
	    // 重置标识为未在处理任务队列
	    isProcessingQueue = false;
	
	    // 递归调用自身，处理下一个任务
	    processQueue(onComplete);
	};
	
	// 定义一个异步函数来停止回答
	const stopAnswering = async () => {
	    try {
	        // 如果存在倒计时间隔，则清除间隔，并重置倒计时为300
	        if (countdownInterval.value) {
	            clearInterval(countdownInterval.value);
	            countdown.value = 300;
	        }
	        // 标记为不在回答状态
	        isAnswering.value = false;
			
			// 获取当前问题
			const currentQuestion: Questions = questions.value[currentQuestionIndex.value];
			console.log(questions.value, currentQuestionIndex.value, "currentQuestionIndex.value")
	
	        // 如果正在记录，则停止记录并停止录音
	        if (isRecording.value) {
	            await stopRecord();
	            stopRecordingAudio();
	
	            // 获取停止时是否为最后一个问题的标识
	            const wasLastQuestionWhenStarted = isLastQuestion.value;
	
	            // 如果是最后一个问题，则显示结束视频，否则加载下一个问题，并生成新的UUID
	            if (wasLastQuestionWhenStarted) {
	                showEndVideo();
	            } else {
	                nextQuestion();
	                myData.commonUUID = uni.$u.guid();  // 生成新的UUID
	            }
	
	            // 定义一个上传任务
	            const uploadTask = async (): Promise<void> => {
	                return new Promise(async (resolve, reject) => {
	                    try {
	                        // 上传视频并获取上传后的视频URL
	                        const uploadedVideoUrl = await uploadVideo(recordVideoPath.value);
	                        // 构造用户回答对象
	                        const userAnswer = {
	                            question_id: currentQuestion.question_id,
	                            question_text: currentQuestion.text,
	                            skills: currentQuestion.skills,
	                            answer: "Transcribing...",
	                            recording_url: "录音文件URL",
	                            commonUUID: myData.commonUUID,
	                            video_url: uploadedVideoUrl || currentVideoUrl.value
	                        };
	
	                        // 在用户回答数组中查找是否已存在相同问题ID和commonUUID的回答
	                        const existingAnswer = userAnswers.value.find(answer => 
	                            answer.question_id === userAnswer.question_id && 
	                            answer.commonUUID === userAnswer.commonUUID
	                        );
	
	                        // 如果不存在相同的回答，则将新回答添加到用户回答数组，否则在控制台打印警告
	                        if (!existingAnswer) {
	                            userAnswers.value.push(userAnswer);
	                        } else {
	                            console.warn('Duplicate question_id and commonUUID detected:', userAnswer.question_id, userAnswer.commonUUID);
	                        }
	
	                        // 任务完成，解析Promise
	                        resolve();
	                    } catch (error) {
	                        // 打印上传错误，并拒绝Promise
	                        console.error('Upload error:', error);
	                        reject(error);
	                    }
	                });
	            };
	
	            // 将上传任务添加到任务队列
	            taskQueue.push(uploadTask);
	            // 处理任务队列，并在完成后检查是否为最后一个问题，如果是，则调用上传用户回答API
	            processQueue(async () => {
	                if (wasLastQuestionWhenStarted) {
	                    uploadUserAnswersApi();
	                }
	            });
	        }
	    } catch(err) {
	        // 在控制台打印停止回答时的错误
	        console.error('Error while stopping the answer:', err);
	    }
	};

	// 回答完毕按钮防抖
	const debouncedStopAnswering = debounce(function() {
	    stopAnswering()
	}, 300);  // 300毫秒的延迟，可以根据需要调整

	// 随机获取5道面试题数据
	const fetchInterviewQuestions = async () => {
		try {
			const res = await fetchIvQuestion(ivCustomParams.value);
			let resQuestions = res.data || []
			resQuestions.unshift({
				video: CONFIG.PROLOGUE_VIDEO_PATH,
				text: CONFIG.PROLOGUE_VIDEO_TEXT
			})
			
			if (resQuestions.length) {
				questions.value = resQuestions;
				questionVideoPath.value = resQuestions[0].video;
				questionText.value = resQuestions[0].text;
				myData.isQuestionsFetched = true;
			} else {
				console.error("没有获取到面试问题");
			}
			console.log(questions.value.length, "fetchInterviewQuestions方法里的questions长度")
		} catch (error) {
			console.error('Error during fetchInterviewQuestions', error);
			// 可以在这里添加更多的错误处理逻辑，比如设置一个标志，让用户知道出现了错误
		}
	};
	
	// 展示下一个问题
	const nextQuestion = () => {
		console.log("nextQuestion method called");  // 添加这一行
	    currentQuestionIndex.value++;
		console.log("Updated currentQuestionIndex to:", currentQuestionIndex.value);
	    
	    if (currentQuestionIndex.value < questions.value.length) {
	        const currentQuestion = questions.value[currentQuestionIndex.value];
	        console.log("Loading next question:", currentQuestion);
	        if (currentQuestion) {
	            questionVideoPath.value = currentQuestion.video;
	            questionText.value = currentQuestion.text;
	            currentVideo.value = 'question';  // 这里确保设置为播放问题视频
				console.log("Set currentVideo to 'question'");
	        } else {
	            console.error("当前问题索引超出问题数组范围");
	        }
	    } else {
			console.log("All questions answered. Showing end video.");
	        // 所有问题都已回答
	        showEndVideo();
	    }
	}
	
	// 展示结束视频并通知用户报告正在生成
	const showEndVideo = async () => {
		isInterviewFinished.value = true;
		canAnswer.value = true;
		currentVideo.value = 'question';

	    // 设置结束视频
	    questionVideoPath.value = CONFIG.END_VIDEO_PATH;
	    questionText.value = CONFIG.END_VIDEO_TEXT;
		myData.endedAt = vk.pubfn.timeFormat(new Date());
	}
	
	// 上传用户的回答API
	const uploadUserAnswersApi = async () => {
		console.log("Starting uploadUserAnswersApi");
		const params: InterviewAnswer = {
			currentJobInfo: currentJobInfo.value,
			ivCustomParams: ivCustomParams.value,
			answers: userAnswers.value || [],
			sessionId: myData.sessionId,
			startedAt: myData.startedAt,
			endedAt: myData.endedAt
		}
		console.log(params, "uploadUserAnswersApi的参数")
	    try {
			const res = await submitInterviewAnswer(params);
			console.log(res, 'uploadUserAnswersApi result');
	    } catch (error) {
	        console.error('Error uploading user answers:', error);
	    }
		console.log("Finished uploadUserAnswersApi");
	};
	
	// 上传录制的视频到服务器
	const uploadVideo = (recordVideoPath: string): Promise<string> => {
	    return new Promise((resolve, reject) => {
	        if (!recordVideoPath) {
	            reject(new Error("Invalid video path provided"));
	            return;
	        }
	
	        let retryCount = 3;
	
	        const uploadWithRetry = () => {
	            vk.uploadFile({
	                filePath: recordVideoPath,
	                // onUploadProgress: (progressEvent: any) => {
	                //     const { progress } = progressEvent;
	                //     console.log(`Upload progress: ${progress}%`);
	                // },
	                success: (res: any) => {
	                    if (res && res.url) {
	                        currentVideoUrl.value = res.url;
	                        console.log(`Video uploaded successfully: ${recordVideoPath}`);
	                        resolve(res.url);
	                    } else {
	                        reject(new Error("No URL returned from the upload"));
	                    }
	                },
	                fail: (err: any) => {
	                    if (retryCount > 0) {
	                        retryCount--;
	                        console.warn('Upload failed, retrying...');
	                        setTimeout(uploadWithRetry, 5000); // 等待5秒后重试
	                    } else {
	                        console.error('Upload error after all retries:', err);
	                        reject(err);
	                    }
	                },
	                complete: (completeInfo: any) => {
	                    console.log(completeInfo, 'Upload complete');
	                }
	            });
	        };
	
	        uploadWithRetry();
	    });
	};
	
	// 视频录制预览开关
	const toggleCamera = () => {
	    if (isAnswering.value) {
	        vk.toast("正在回答问题，不能切换摄像头");
	        return;  // 如果正在回答问题，直接返回，不执行后面的代码
	    }
	    isCameraActive.value = !isCameraActive.value;  // 切换摄像头状态
	    if (isCameraActive.value) {
	        startRecord()
	    } else {
	        if (isRecording.value) {  // 只有当摄像头正在录制时才尝试停止录制
	            stopRecord();
	        }
	    }
	}

	// 开始录制视频
	const startRecord = () => {
		cameraCtx.startRecord({
			timeout: 300,
			success: () => {
				console.log('开始录制');
			},
			fail: (err: any) => {
				console.error('录制失败:', err);
			}
		} as any);
		isRecording.value = true;
	};

	// 停止录制视频
	const stopRecord = async () => {
	    try {
	        const res = await new Promise<any>((resolve, reject) => {
	            cameraCtx.stopRecord({
	                success: resolve,
					fail(err: any) {
						reject(err)
					},
					complete: (completeInfo: any) => {
					    console.log(completeInfo, 'completeInfo');
					}
	            });
	        });
			console.log(res, '停止录制视频stopRecord的res')
	
	        console.log('录制完成', res.tempVideoPath);
			isRecording.value = false;  // 更新录制状态
	        recordVideoPath.value = res.tempVideoPath;
	        // 其他处理逻辑...
	
	        return res;  // 返回录制的结果，如果需要的话
	
	    } catch (err) {
	        console.error('停止录制失败:', err);
	        throw err;  // 抛出错误，以便在调用函数中进行进一步处理
	    }
	};
	
	// 获取当前设备宽度
	const getSystemDimensions = () => {
	    const systemInfo = uni.getSystemInfoSync();
	    sysWidth.value = systemInfo.safeArea!.width;
	    sysHeight.value = systemInfo.safeArea!.height;
	}
	
	// 获取视频的宽高，并且和设备宽度做计算，防止视频出现黑边
	const handleMetadataLoaded = (event: any) => {
	    const { width, height } = event.detail;
	
	    const videoAspectRatio = width / height;
	    const deviceAspectRatio = sysWidth.value / sysHeight.value;
	
	    if (videoAspectRatio > deviceAspectRatio) {
	        videoWidth.value = sysWidth.value;
	        videoHeight.value = Math.round(sysWidth.value / videoAspectRatio);
	    } else {
	        videoHeight.value = sysHeight.value;
	        videoWidth.value = Math.round(sysHeight.value * videoAspectRatio);
	    }
	}
	
	// 获取全局唯一的录音管理器
	const recorderManager = uni.getRecorderManager();
	
	// 开始录制音频
	const startRecordingAudio = () => {
		myData.commonUUID = uni.$u.guid();
	    recorderManager.start(RECORDER_OPTIONS);
	};
	
	// 结束录制音频
	const stopRecordingAudio = () => {
	    recorderManager.stop();
	};
	
	// 监听录音停止，获取临时文件路径
	const onStopRecordingAudio = () => {
		recorderManager.onStop((res) => {
		    const { tempFilePath } = res;
			vk.uploadFile({
				filePath: tempFilePath,
				success: (res: any) => {
					const { url } = res;
					audioToTextApi(url, myData.commonUUID);
				},
				fail(err: any) {
					console.log('Error:', err);
				},
				complete(complete: any) {
					console.log(complete, 'complete')
				}
			});
		});
	}
	
	// 百度云语音转文字接口
	const audioToTextApi = async (filePath: string, commonUUID: string) => {
		const params = {
			filePath: filePath,
			commonUUID: commonUUID,
			sessionId: myData.sessionId
		}
	    const res = await audioToText(params);
		console.log(res, 'audioToTextApi')
	};

	onMounted(async () => {
		myData.sessionId = uni.$u.guid();
		myData.startedAt = vk.pubfn.timeFormat(new Date());
		console.log(myData.sessionId, 'myData.sessionId')
		setCustomNavigationBarTitle();
		getSystemDimensions();
		await fetchInterviewQuestions();
		onStopRecordingAudio();
	});
	
	// 当组件卸载时，清除计时器
	onBeforeUnmount(() => {
	    if (countdownInterval.value) {
	        clearInterval(countdownInterval.value);
	    }
	});
</script>

<style lang="scss" scoped>
	@import '@/common/css/mixins.scss';
	
	.camera-wrapper {
		position: absolute;  // 使用绝对定位
		top: 30rpx;
		left: 30rpx;
		width: 160rpx;
		height: 220rpx;
		overflow: hidden; // 确保摄像头的预览或“关闭中”的提示不超出容器的边界
		background-color: #eee;  // 给容器一个背景色，以确保在摄像头关闭时有一个背景

		camera {
			width: 100%;   // 宽度和高度为100%确保填充整个容器
			height: 100%;
		}

		.closed-view {
			width: 100%;
			height: 100%;
			display: flex;
			align-items: center;
			justify-content: center;
			background-color: rgba(0, 0, 0, 0.5);  // 为“关闭中”的背景添加一个半透明的黑色，使文字更容易阅读
			font-size: 12px;  // 根据需要调整字体大小
		}
	}
	.bottom-body {
		position: absolute;
		bottom: 50rpx;
		left: 0;
		right: 0;
		z-index: 3;
		.question-body {
			min-height: 240rpx;
			padding: 30rpx;
			background-color: rgba(43, 44, 48, 0.9);
			margin-bottom: 70rpx;
			.question-text {
				line-height: 1.7em;
				color: #fff;
				font-size: 28rpx;
			}
		}
		.btn-wrapper {
			@include flex-layout(between);
			.toggle-camera-btn {
				width: 100rpx;
				height: 100rpx;
				border-radius: 50%;
				overflow: hidden;
				color: #fff;
				background-color: $uni-color-warning;
				box-sizing: border-box;
				font-size: 60rpx;
				@include flex-layout(center);
			}
			.btn-box {
				width: 540rpx;
			}
		}
	}
	
	.fullscreen-video {
		object-fit: cover;
		z-index: 0;  
	}
	
	.video-mask {
	    z-index: 1;  // 确保遮罩层在视频之上
	    background-color: rgba(0, 0, 0, 0);  // 将其设置为极低的不透明度，从而能够捕获事件，但对用户来说几乎是透明的
	}
	.bottom-bg {
		background: linear-gradient(to top, #35363a 0%, #3d4144 70%, rgba(61, 65, 68, 0.5) 85%, rgba(61, 65, 68, 0) 100%);
		height: 300rpx;
		z-index: 2;
	}
</style>
