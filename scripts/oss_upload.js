const OSS = require('ali-oss');
const fs = require('fs');
const path = require('path');

const accessKeyId = process.env.OSS_ACCESS_KEY_ID;
const accessKeySecret = process.env.OSS_ACCESS_KEY_SECRET;
const bucket = process.env.OSS_BUCKET;
const region = process.env.OSS_REGION;

// 关键：手动拼接公网 Endpoint，不让 SDK 自动解析域名
const endpoint = `oss-${region}.aliyuncs.com`;

const client = new OSS({
  accessKeyId,
  accessKeySecret,
  bucket,
  region,
  endpoint,        // 手动指定，绕过 SDK 自动域名解析
  secure: true,
  timeout: 120000,
  keepAlive: false,// 关闭长连接，解决 Actions 网络池 DNS 缓存问题
  agent: false     // 禁用内置 HTTP 代理，走系统 DNS
});

// 你的 VitePress 打包目录不变
const localDir = path.resolve(__dirname, '../.townwang/.vitepress/dist');

async function uploadDir(dir, prefix = '') {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      await uploadDir(fullPath, `${prefix}${file}/`);
    } else {
      const ossKey = `${prefix}${file}`;
      try {
        console.log(`上传: ${fullPath} → ${ossKey}`);
        await client.put(ossKey, fullPath);
      } catch (e) {
        console.error(`⚠️ 上传失败 ${ossKey}：`, e.message);
      }
    }
  }
}

(async () => {
  try {
    await uploadDir(localDir);
    console.log('✅ VitePress 全部上传 OSS 完成');
  } catch (err) {
    console.error('❌ 整体上传任务失败：', err);
    process.exit(1);
  }
})();
