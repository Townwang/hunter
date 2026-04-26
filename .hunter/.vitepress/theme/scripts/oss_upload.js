const OSS = require('ali-oss');
const fs = require('fs');
const path = require('path');

const accessKeyId = process.env.OSS_ACCESS_KEY_ID;
const accessKeySecret = process.env.OSS_ACCESS_KEY_SECRET;
const bucket = process.env.OSS_BUCKET;
const region = process.env.OSS_REGION;

// 手动拼接公网 Endpoint
const endpoint = `oss-${region}.aliyuncs.com`;

const client = new OSS({
  accessKeyId,
  accessKeySecret,
  bucket,
  region,
  endpoint,
  secure: true,
  timeout: 120000,
  keepAlive: false,
  agent: false
});

const localDir = path.resolve(__dirname, '...../.hunter/.vitepress/dist');

// 记录上传失败的文件数
let failCount = 0;

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
        failCount++;
        console.error(`⚠️ 上传失败 ${ossKey}：`, e.message);
      }
    }
  }
}

(async () => {
  try {
    await uploadDir(localDir);

    // 判断是否有失败文件
    if (failCount > 0) {
      console.error(`❌ 上传完成，但有 ${failCount} 个文件上传失败`);
      process.exit(1);
    } else {
      console.log('✅ VitePress 全部上传 OSS 完成，无失败文件');
    }
  } catch (err) {
    console.error('❌ 整体上传任务异常失败：', err);
    process.exit(1);
  }
})();
