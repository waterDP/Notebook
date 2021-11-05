/*
 * @Description: 
 * @Date: 2021-07-14 16:00:47
 * @Author: water.li
 */
const Docker = require('dockerode')

class DockerImgPlugin {
  constructor(options) {
    this.target = options.target
    this.imageName = options.imageName
    this.docker = new Docker(options.config)
  }
  apply(compiler) {
    compiler.hooks.done.tapAsync('BuildDockerImage', (_, cb) => {
      this.docker.buildImage(this.target, {t: this.imageName}, cb)
    })
  }
}

module.exports = DockerImgPlugin


/* 
  new DockerImgPlugin({
    target: path.resolve(__dirname, 'dist/dist.tar'),
    imageName: imageName(),
    config:{
      host: '10.2.2.2',
      port: '2372',
      username: 'water.li',
      sshAuthAgent: 'fwiqnice'
    }
  })
 */