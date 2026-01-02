# Docker 构建测试脚本
Write-Host "开始测试 Dockerfile 构建..." -ForegroundColor Cyan

# 检查 Docker 是否运行
$dockerRunning = docker info 2>&1
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Docker 未运行，请先启动 Docker Desktop" -ForegroundColor Red
    exit 1
}

Write-Host "✅ Docker 正在运行" -ForegroundColor Green

# 构建镜像
Write-Host "`n开始构建 Docker 镜像..." -ForegroundColor Cyan
docker build -t hilloworld-chat-test -f Dockerfile .

if ($LASTEXITCODE -eq 0) {
    Write-Host "`n✅ Docker 镜像构建成功！" -ForegroundColor Green
    Write-Host "`n测试运行容器..." -ForegroundColor Cyan
    docker run -d -p 3000:3000 --name hilloworld-chat-test hilloworld-chat-test
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ 容器启动成功！" -ForegroundColor Green
        Write-Host "`n应用运行在: http://localhost:3000" -ForegroundColor Yellow
        Write-Host "`n查看容器日志: docker logs hilloworld-chat-test" -ForegroundColor Yellow
        Write-Host "停止容器: docker stop hilloworld-chat-test" -ForegroundColor Yellow
        Write-Host "删除容器: docker rm hilloworld-chat-test" -ForegroundColor Yellow
    } else {
        Write-Host "❌ 容器启动失败" -ForegroundColor Red
        docker logs hilloworld-chat-test
    }
} else {
    Write-Host "`n❌ Docker 镜像构建失败" -ForegroundColor Red
    exit 1
}

