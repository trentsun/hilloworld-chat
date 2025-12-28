// 部署脚本 - 使用 AI Builder API 部署应用
const https = require('https');
const fs = require('fs');
const path = require('path');

// 读取部署配置
const configPath = path.join(__dirname, 'deploy-config.json');
if (!fs.existsSync(configPath)) {
  console.error('错误: 找不到 deploy-config.json 文件');
  console.log('请先创建 deploy-config.json 文件并配置仓库信息');
  process.exit(1);
}

const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));

// 从环境变量获取 API token
const apiToken = process.env.AI_BUILDER_TOKEN;
if (!apiToken) {
  console.error('错误: 未找到 AI_BUILDER_TOKEN 环境变量');
  console.log('请设置环境变量: export AI_BUILDER_TOKEN=your_token');
  process.exit(1);
}

// API 基础 URL
const baseURL = 'space.ai-builders.com';
const apiPath = '/backend/v1/deployments';

// 准备部署请求数据
const deploymentData = {
  repo_url: config.repo_url,
  service_name: config.service_name,
  branch: config.branch || 'main',
  port: config.port || 3000,
  env_vars: config.env_vars || {}
};

const postData = JSON.stringify(deploymentData);

const options = {
  hostname: baseURL,
  port: 443,
  path: apiPath,
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${apiToken}`,
    'Content-Length': Buffer.byteLength(postData)
  }
};

console.log('正在部署应用...');
console.log('配置信息:');
console.log(`  仓库: ${config.repo_url}`);
console.log(`  服务名: ${config.service_name}`);
console.log(`  分支: ${config.branch || 'main'}`);
console.log(`  端口: ${config.port || 3000}`);
console.log('');

const req = https.request(options, (res) => {
  let data = '';

  res.on('data', (chunk) => {
    data += chunk;
  });

  res.on('end', () => {
    if (res.statusCode === 202) {
      const response = JSON.parse(data);
      console.log('✅ 部署请求已提交！');
      console.log('');
      console.log('部署状态:', response.status);
      console.log('服务名称:', response.service_name);
      if (response.public_url) {
        console.log('公共 URL:', response.public_url);
      }
      console.log('');
      console.log('提示:');
      console.log('- 部署通常需要 5-10 分钟');
      console.log('- 使用以下命令检查部署状态:');
      console.log(`  curl -H "Authorization: Bearer ${apiToken}" https://${baseURL}${apiPath}/${config.service_name}`);
      console.log('');
      if (response.message) {
        console.log('消息:', response.message);
      }
    } else {
      console.error('❌ 部署失败');
      console.error('状态码:', res.statusCode);
      console.error('响应:', data);
      process.exit(1);
    }
  });
});

req.on('error', (error) => {
  console.error('❌ 请求错误:', error.message);
  process.exit(1);
});

req.write(postData);
req.end();

