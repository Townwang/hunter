const OSS = require('ali-oss');
const fs = require('fs');
const path = require('path');

const client = new OSS({
  accessKeyId: process.env.OSS_ACCESS_KEY_ID,
  accessKeySecret: process.env.OSS_ACCESS_KEY_SECRET,
  bucket: process.env.OSS_BUCKET,
  // 修正：使用正确的 Region，比如 oss-cn-hangzhou
  region: process.env.OSS_REGION, 
  // 不要手动拼接 endpoint，让 SDK 自动生成
  // endpoint: 这里删掉你之前手动拼接的内容
  secure: true, // 强制 HTTPS
  timeout: 60000
});

// 已适配你的目录：.townwang/.vitepress/dist
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
        console.error(`⚠️ 单个文件上传失败 ${ossKey}`, e.message);
      }
    }
  }
}

(async () => {
  try {
    await uploadDir(localDir);
    console.log('✅ VitePress 已全部上传到阿里云OSS');
  } catch (err) {
    console.error('❌ 上传失败：', err);
    process.exit(1);
  }
})();
