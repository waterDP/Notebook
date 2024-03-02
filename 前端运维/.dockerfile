# 基础镜像
FROM node
# 拷贝一个文件（夹）
COPY web /web
# 镜像构建时执行的命令
RUN npm install
# 为窗口打开指定监听端口协议以实现与外界通信
EXPOSE 80/tcp
# 设置工作目录
WORKDIR /the/workdir/path
# 设置镜像中的环境变量
ENV key=value
# 实现挂载功能，将宿主机目录挂载到容器中
VOLUME [ "/data" ]
# 为容器设置默认启动命令
CMD npm start
