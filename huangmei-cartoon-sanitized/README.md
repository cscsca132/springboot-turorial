# 黄梅戏卡通短视频 APK 脱敏上传包

本目录是 Codex 从本机 APK 生成的公开仓库脱敏包。

## 当前保留版本

- 最新测试版：`黄梅戏卡通短视频v3.1.8-保守增强.apk`
- 回滚版：`黄梅戏卡通短视频v3.1.7.apk`

APK 二进制没有上传到 public GitHub，因为 APK 内置了真实 API key/AccessKey，直接公开会泄露密钥。

## 本次公开上传内容

- `private.runtime.example.json`：脱敏后的运行配置模板
- `docs/api-interfaces.md`：当前接口与作用说明
- `docs/release-notes.md`：版本说明与回滚规则
- `.gitignore`：防止提交 APK、签名文件和真实配置

## 本机 APK 校验

- v3.1.8 SHA-256: `d54b9a05b0c94376df106a96183569b55ea017304c15ca1f46a9053486d43f18`
- v3.1.7 SHA-256: `372169c1b44cb7e402a1b7bb1e657e8c55b53b51326ba13a48746054d49ad1bd`

## 安全规则

不要向 public 仓库提交：

- `private.runtime.json` 真实配置
- `*.apk` 正式包
- `*.jks`、`*.pk8`、`*.pem` 签名文件
- DashScope `sk-...` key
- 阿里云 AccessKey ID / AccessKey Secret
