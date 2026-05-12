# 当前接口说明

## 主生成链路

| 接口/模型 | 作用 | 鉴权 |
|---|---|---|
| `wan2.6-image` | 真人照片生成卡通头像 | DashScope API Key |
| `qwen-vl-max` | 识别人脸细节：眼镜、镜框、痣点、耳饰、胡须等 | DashScope API Key |
| `qwen-max` | 黄梅戏跟唱词生成与修正 | DashScope API Key |
| `qwen-turbo` | 快速跟唱引导备用 | DashScope API Key |
| `qwen3-asr-flash` | 跟唱录音识别，失败不阻断声纹生成 | DashScope API Key |
| `qwen-voice-enrollment` | 声纹提取/音色注册 | DashScope API Key |
| `qwen3-tts-vc-2026-01-22` | 声纹唱段合成 | DashScope API Key |
| `wan2.6-i2v` | 卡通头像 + 声纹音频生成 15 秒唱戏视频 | DashScope API Key |
| `EnhancePortraitVideo` | 视频生成后做人像增强，失败保留原片 | 阿里云视觉智能 AK/SK |
| 腾讯 COS | 存储图片、音频、视频素材 | 服务端或受控配置 |

## 保守增强流程

```text
上传照片
-> Qwen-VL 识别人脸细节
-> wan2.6-image 生成卡通头像
-> qwen-max/qwen-turbo 生成跟唱词
-> qwen3-asr-flash 辅助识别录音
-> qwen-voice-enrollment 提取声纹
-> qwen3-tts-vc 合成声纹唱段
-> wan2.6-i2v 生成 15 秒唱戏视频
-> EnhancePortraitVideo 做保守人像增强
-> 增强失败则使用原视频
```

## 不能互换的接口

`EnhancePortraitVideo` 只能增强已有视频，不能替代 `wan2.6-i2v` 从头像和音频生成唱戏视频。

如果要替换主生成链路，优先评估 `EMO`、`LivePortrait` 或模板换脸类方案。
