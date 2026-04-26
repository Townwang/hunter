const OSS = require('ali-oss');
const fs = require('fs');
const path = require('path');

const accessKeyId = process.env.OSS_ACCESS_KEY_ID;
const accessKeySecret = process.env.OSS_ACCESS_KEY_SECRET;
const bucket = process.env.OSS_BUCKET;
// 必须是标准地域：oss-cn-hangzhou / oss-cn-shanghai 这种
const region = process.env.OSS_REGION;

// 手动固定公网 endpoint，不再让SDK自动拼
const endpoint = `${bucket}.${region}.aliyuncs.com`;

const client = new OSS({
  accessKeyId,
  accessKeySecret,
  bucket,
  region,
  endpoint,
  secure: true,
  timeout: 120000,
  keepAlive: false, // 关键：关闭长连接，规避DNS缓存问题
  agent: false      // 禁用内置http代理，走系统DNS
});

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
        await client.put(ossKey, fullPath, {
          timeout: 120000
        });
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
