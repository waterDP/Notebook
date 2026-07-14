# Kafka + CrewAI 一键启动脚本（PowerShell 原生版）

Write-Host "🚀 正在启动 Kafka 集群..." -ForegroundColor Cyan
Set-Location "e:\Notebook\Agent\demo\kafka-rag"
docker-compose up -d

Start-Sleep -Seconds 5

Write-Host "👂 启动 Kafka 监听器（新窗口）..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd 'e:\Notebook\Agent\demo\kafka-rag'; python kafka_consumer.py" 

Write-Host "🤖 启动 CrewAI 示例（新窗口）..." -ForegroundColor Green
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd 'e:\Notebook\Agent\demo\kafka-rag'; python crewai_with_kafka.py" 

Write-Host "✅ 全部启动完成！查看弹出窗口获取实时状态。" -ForegroundColor Magenta
Write-Host "💡 提示：关闭任一窗口不会影响其他服务（Kafka 持续运行）" -ForegroundColor DarkGray