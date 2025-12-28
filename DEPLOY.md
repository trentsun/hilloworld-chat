# 部署指南

本应用可以通过 AI Builder Space 平台进行部署。

## 部署前准备

### 1. 创建 Git 仓库

首先，你需要将代码推送到一个公开的 Git 仓库（GitHub、GitLab 等）。

```bash
# 初始化 Git 仓库
git init

# 添加所有文件
git add .

# 提交代码
git commit -m "Initial commit"

# 添加远程仓库（替换为你的仓库 URL）
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git

# 推送到远程仓库
git push -u origin main
```

### 2. 配置部署信息

编辑 `deploy-config.json` 文件，填入你的仓库信息：

```json
{
  "repo_url": "https://github.com/YOUR_USERNAME/YOUR_REPO_NAME",
  "service_name": "chatgpt-clone",
  "branch": "main",
  "port": 3000,
  "env_vars": {
    "NODE_ENV": "production"
  }
}
```

**重要提示：**
- `repo_url`: 必须是公开的 Git 仓库 URL
- `service_name`: 将作为子域名使用（例如：chatgpt-clone.ai-builders.space）
- `branch`: 要部署的分支名称（通常是 main 或 master）
- `port`: 应用监听的端口（Next.js 默认 3000）

### 3. 设置环境变量

确保 `AI_BUILDER_TOKEN` 环境变量已设置：

```bash
# Windows PowerShell
$env:AI_BUILDER_TOKEN="your_token_here"

# Linux/Mac
export AI_BUILDER_TOKEN="your_token_here"
```

## 部署方法

### 方法 1: 使用部署脚本（推荐）

```bash
node deploy.js
```

### 方法 2: 使用 curl

```bash
curl -X POST https://space.ai-builders.com/backend/v1/deployments \
  -H "Authorization: Bearer $AI_BUILDER_TOKEN" \
  -H "Content-Type: application/json" \
  -d @deploy-config.json
```

### 方法 3: 使用 API 客户端

你可以使用任何 HTTP 客户端（如 Postman、Insomnia）调用部署 API。

## 检查部署状态

部署通常需要 5-10 分钟。你可以使用以下命令检查部署状态：

```bash
curl -H "Authorization: Bearer $AI_BUILDER_TOKEN" \
  https://space.ai-builders.com/backend/v1/deployments/YOUR_SERVICE_NAME
```

## 部署后的访问

部署成功后，你的应用将在以下 URL 可用：

```
https://YOUR_SERVICE_NAME.ai-builders.space
```

例如，如果服务名是 `chatgpt-clone`，则访问：
```
https://chatgpt-clone.ai-builders.space
```

## 注意事项

1. **环境变量**: `AI_BUILDER_TOKEN` 会在部署时自动注入，无需在 `env_vars` 中配置
2. **端口**: Next.js 会自动读取 `PORT` 环境变量，无需额外配置
3. **构建**: 部署平台会自动运行 `npm install` 和 `npm run build`
4. **启动**: 部署平台会自动运行 `npm start`

## 故障排除

### 部署失败

1. 检查仓库 URL 是否正确且公开
2. 检查分支名称是否正确
3. 检查服务名称是否唯一（不能与其他用户的服务名冲突）
4. 查看部署日志了解详细错误信息

### 应用无法访问

1. 等待 5-10 分钟让部署完成
2. 检查部署状态是否为 `HEALTHY`
3. 检查应用日志查看是否有错误

## 更新部署

要更新已部署的应用，只需：

1. 将代码更改推送到 Git 仓库
2. 重新运行部署脚本或 API 调用

部署平台会自动检测更改并重新部署。

