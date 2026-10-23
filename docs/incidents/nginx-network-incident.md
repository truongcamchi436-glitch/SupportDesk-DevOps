# Nginx 容器网络异常故障排查记录
## 1. 故障现象
SupportDesk 项目启动后无法正常访问 Web 服务。 执行： sudo docker 
compose ps -a 发现 backend、frontend、mongo 容器运行正常，但 
nginx 容器处于 Restarting 状态。
## 2. 日志分析
查看 Nginx 容器日志： sudo docker compose logs nginx --tail=30 
发现关键报错： host not found in upstream "backend" 初步判断 
Nginx 无法解析 backend 服务。
## 3. 网络检查
分别检查 backend 和 nginx 容器网络： sudo docker inspect 
supportdesk-backend-1 --format='{{json 
.NetworkSettings.Networks}}' sudo docker inspect 
supportdesk-nginx-1 --format='{{json .NetworkSettings.Networks}}' 
backend 已加入 supportdesk_default 网络，而 nginx 网络信息为空。
## 4. 配置检查
执行： sudo docker compose config 确认 Compose 配置中 nginx 
应加入 supportdesk_default 网络，判断 Compose 
配置正常，异常集中在 nginx 容器状态。
## 5. 故障处理
重新创建 nginx 容器： sudo docker compose up -d --force-recreate 
nginx 重新创建后 nginx 成功启动。
## 6. 恢复验证
执行： curl -I http://127.0.0.1 返回： HTTP/1.1 200 OK 确认 Nginx 
及 Web 服务恢复正常。
## 7. 排障总结
本次排障流程：
服务异常 → 容器状态检查 → 日志分析 → Docker 网络检查 → Compose 配置核对 → 重建异常容器 → HTTP 请求验证
