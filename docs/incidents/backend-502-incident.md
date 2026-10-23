# Backend 停止导致 Nginx 502 故障排查记录

## 故障现象
停止 backend 容器后，访问 /api/ 返回 502 Bad Gateway。

## 排查过程
1. 使用 docker compose ps -a 检查容器状态，发现 backend 为 Exited (143)。
2. nginx、frontend、mongo 容器仍保持 Up 状态。
3. 查看 Nginx 日志，发现 connect() failed while connecting to upstream。
4. 确认 Nginx 无法连接 backend:3000。

## 根因
backend 容器停止运行，导致 Nginx 无法连接上游服务，因此返回 502 Bad Gateway。

## 故障恢复
执行 sudo docker compose start backend 重新启动后端服务。

## 恢复验证
再次检查容器状态，backend 恢复为 Up。

重新访问 /api/ 后，响应从 502 变为 HTTP 404，并出现 X-Powered-By: Express。

404 是因为 Express 没有定义根路由，但该响应证明请求已经成功到达 backend，Nginx 到 backend 的代理链路恢复正常。

## 总结
完成了故障模拟、容器状态检查、Nginx 日志分析、根因定位、服务恢复和恢复验证的完整排障流程。
