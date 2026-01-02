FROM node:20-alpine AS base

# 安装依赖
FROM base AS deps
WORKDIR /app
COPY package.json package-lock.json* ./
RUN npm ci

# 构建应用
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
# 确保 public 目录存在（如果不存在则创建）
RUN mkdir -p public || true
ENV NEXT_TELEMETRY_DISABLED=1
RUN npm run build

# 生产运行
FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# 复制 standalone 构建产物
# standalone 模式会将应用打包到 .next/standalone 目录
# standalone 目录包含 server.js, node_modules, package.json 等
# 注意：standalone 模式会将 public 目录复制到 standalone/public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
# 复制静态文件（standalone 模式不包含静态文件，需要单独复制）
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
# 确保 public 目录存在（standalone 模式应该已经包含，但为了安全起见确保存在）
RUN mkdir -p ./public || true

USER nextjs

EXPOSE 3000

ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

CMD ["node", "server.js"]
