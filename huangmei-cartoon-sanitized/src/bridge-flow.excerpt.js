// Public sanitized excerpt of the Huangmei WebView bridge flow.
// This file documents the API sequence without real keys, signed APK assets, or private runtime config.

const runtimeConfig = {
  aliyunApiKey: "__SET_ALIYUN_API_KEY__",
  aliyunImageModel: "wan2.6-image",
  aliyunVideoModel: "wan2.6-i2v",
  aliyunGuideModel: "qwen-max",
  aliyunFastGuideModel: "qwen-turbo",
  aliyunAsrModel: "qwen3-asr-flash",
  aliyunVoiceEnrollmentModel: "qwen-voice-enrollment",
  aliyunVoiceSynthesisModel: "qwen3-tts-vc-2026-01-22",
  enableAliyunVideoEnhance: true,
  aliyunVideoEnhanceAction: "EnhancePortraitVideo",
  aliyunVideoEnhanceAccessKeyId: "__SET_ALIYUN_VIDEO_ENHANCE_ACCESS_KEY_ID__",
  aliyunVideoEnhanceAccessKeySecret: "__SET_ALIYUN_VIDEO_ENHANCE_ACCESS_KEY_SECRET__",
};

async function createCartoonPortrait(sourceImageUrl, faceDetails) {
  return postJson("https://dashscope.aliyuncs.com/api/v1/services/aigc/multimodal-generation/generation", {
    model: runtimeConfig.aliyunImageModel,
    input: {
      image: sourceImageUrl,
      prompt: [
        "把上传照片中的本人生成卡通黄梅戏头像",
        "照片本人必须是前景主角，不得作为背景墙、海报、相框、屏幕或贴图",
        "保留眼镜、镜框、痣点、耳饰、胡须等可见人脸细节",
        faceDetails || "",
      ].join("；"),
    },
  });
}

async function createVoiceSong(recordingDataUrl, durationMs, lyricText) {
  if (durationMs < 8000 || durationMs > 22000) {
    throw new Error("录音需控制在 8-22 秒");
  }

  // ASR is auxiliary only. Recognition failure must not block voice cloning.
  const transcript = await tryAsr(recordingDataUrl).catch(() => "识别不稳定，已按录音继续生成声纹");

  const voice = await postJson("https://dashscope.aliyuncs.com/api/v1/services/audio/tts/customization", {
    model: runtimeConfig.aliyunVoiceEnrollmentModel,
    input: { audio: { data: recordingDataUrl } },
  });

  const voiceSong = await postJson("https://dashscope.aliyuncs.com/api/v1/services/aigc/multimodal-generation/generation", {
    model: runtimeConfig.aliyunVoiceSynthesisModel,
    input: { text: lyricText, voice: voice.output.voice },
  });

  return { transcript, voiceSong };
}

async function createSingingVideo(cartoonImageUrl, voiceAudioUrl, faceDetails) {
  const task = await postJson("https://dashscope.aliyuncs.com/api/v1/services/aigc/video-generation/video-synthesis", {
    model: runtimeConfig.aliyunVideoModel,
    input: {
      img_url: cartoonImageUrl,
      audio_url: voiceAudioUrl,
      prompt: [
        "15秒卡通人物黄梅戏声纹唱段短视频",
        "首帧卡通头像就是全片唯一主角",
        "单镜头连续唱戏，不能中途换脸、换人、替身、双人唱或多人轮唱",
        "保留眼镜、镜框、脸部装饰和面部特征",
        faceDetails || "",
      ].join("；"),
      negative_prompt: "多人、双人、换脸、换人、替身、对唱、轮唱、切镜头、转场、背景照片、海报、相框、水印",
    },
    parameters: { duration: 15, resolution: "720P", watermark: false, shot_type: "single" },
  });

  return pollDashScopeTask(task.output.task_id);
}

async function enhanceVideoConservatively(videoUrl) {
  try {
    const enhanceTask = await callAliyunRpc("videoenhan.cn-shanghai.aliyuncs.com", {
      Action: runtimeConfig.aliyunVideoEnhanceAction,
      Version: "2020-03-20",
      VideoUrl: videoUrl,
    });
    return await pollAliyunVideoEnhance(enhanceTask.JobId || enhanceTask.RequestId);
  } catch (error) {
    // Conservative rule: enhancement must never interrupt delivery.
    return { videoUrl, enhanceError: String(error && error.message ? error.message : error) };
  }
}

async function fullFlow(inputPhotoUrl, recordingDataUrl, lyricText, durationMs, faceDetails) {
  const cartoon = await createCartoonPortrait(inputPhotoUrl, faceDetails);
  const voice = await createVoiceSong(recordingDataUrl, durationMs, lyricText);
  const rawVideo = await createSingingVideo(cartoon.url, voice.voiceSong.url, faceDetails);
  const finalVideo = await enhanceVideoConservatively(rawVideo.url);
  return finalVideo.videoUrl || rawVideo.url;
}

async function postJson(url, body) {
  throw new Error("placeholder: implemented by Android WebView bridge in the private APK build");
}

async function tryAsr(recordingDataUrl) {
  throw new Error("placeholder: ASR is auxiliary and non-blocking");
}

async function pollDashScopeTask(taskId) {
  throw new Error("placeholder: poll https://dashscope.aliyuncs.com/api/v1/tasks/{taskId}");
}

async function callAliyunRpc(endpoint, params) {
  throw new Error("placeholder: signed Aliyun RPC request, do not commit real AK/SK");
}

async function pollAliyunVideoEnhance(jobId) {
  throw new Error("placeholder: poll GetAsyncJobResult");
}
