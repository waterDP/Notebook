# 继承的镜像
FROM node 

# 拷贝
COPY source dest

# 指定工作路径
WORKDIR /the/workdir/path

# 编译打包阶段运行的命令
RUN npm run build

# 暴露端口
EXPOSE 80

# 容器运行阶段运行的命令
CMD npm start