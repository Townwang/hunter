const OSS = require('ali-oss');
const fs = require('fs');
const path = require('path');

const client = new OSS({
  accessKeyId: process.env.OSS_ACCESS_KEY_ID,
  accessKeySecret: process.env.OSS_ACCESS_KEY_SECRET,
  bucket: process.env.OSS_BUCKET,
  region: process.env.OSS_REGION,
  // 关键新增配置
  endpoint: `${process.env.OSS_BUCKET}.oss-${process.env.OSS_REGION}.aliyuncs.com`,
  secure: true, // 强制 HTTPS
  internal: false, // 公网访问
  timeout: 60000
});

const localDir = path.resolve(__dirname, '../.townwang/.vitepress/dist');

// 其余上传代码不动
async function uploadDir(dir, prefix = '') {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      await uploadDir(fullPath, `${prefix}${file}/`);
    } else {
      const ossKey = `${prefix}${file}`;
      console.log(`上传: ${fullPath} → ${ossKey}`);
      await client.put(ossKey, fullPath);
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
