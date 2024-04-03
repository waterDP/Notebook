# 基础镜像
FROM node
# 添加宿主机文件到窗口内 自动解压 Copy指令不会自动解压
ADD source dest
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

# 作用和CMD一样，都是在指定容器启动程序以及参数
# 当指定ENTRYPOINT之后，CMD指令的语义就有了变化
# 是把CMD的内容当作参数传递给ENTRYPOINT指令
ENTRYPOINT [ "executable" ]
