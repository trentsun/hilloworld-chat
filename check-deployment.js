// 检查部署状态脚本
const https = require('https');

const apiToken = process.env.AI_BUILDER_TOKEN;
if (!apiToken) {
  console.error('错误: 未找到 AI_BUILDER_TOKEN 环境变量');
  console.log('请设置环境变量: export AI_BUILDER_TOKEN=your_token');
  process.exit(1);
}
const serviceName = 'hilloworld-chat';
const baseURL = 'space.ai-builders.com';
const apiPath = `/backend/v1/deployments/${serviceName}`;

const options = {
  hostname: baseURL,
  port: 443,
  path: apiPath,
  method: 'GET',
  headers: {
    'Authorization': `Bearer ${apiToken}`
  }
};

console.log(`正在检查部署状态: ${serviceName}`);
console.log('');

const req = https.request(options, (res) => {
  let data = '';

  res.on('data', (chunk) => {
    data += chunk;
  });

  res.on('end', () => {
    try {
      const response = JSON.parse(data);
      console.log('部署状态:', response.status);
      console.log('服务名称:', response.service_name);
      
      if (response.public_url) {
        console.log('公共 URL:', response.public_url);
      }
      
      if (response.message) {
        console.log('消息:', response.message);
      }
      
      if (response.koyeb_status) {
        console.log('Koyeb 状态:', response.koyeb_status);
      }
      
      console.log('');
      
      if (response.status === 'HEALTHY') {
        console.log('✅ 部署成功！应用已就绪。');
        if (response.public_url) {
          console.log(`访问地址: ${response.public_url}`);
        }
      } else if (response.status === 'ERROR' || response.status === 'UNHEALTHY') {
        console.log('❌ 部署失败或应用不健康');
        console.log('请查看部署日志了解详细信息');
      } else {
        console.log('⏳ 部署进行中，请稍候...');
      }
    } catch (error) {
      console.error('解析响应失败:', error.message);
      console.log('原始响应:', data);
    }
  });
});

req.on('error', (error) => {
  console.error('请求错误:', error.message);
});

req.end();

