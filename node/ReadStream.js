let EventEmitter = require('events');
let fs = require('fs');

module.exports = class ReadStream extends EventEmitter{
    constructor(path,options) {
        super();
        this.path = path;
        this.flags = options.flags || 'r';
        this.highWaterMark = options.highWaterMark || 64*1024;
        this.start = options.start || 0;
        this.end = options.end;
        this.autoClose = options.autoClose || true;

        this.flowing = null; // 默认非流动模式
        this.pos = this.start;

        this.open(); // 只要创建可读流就会默认将这个文件打开

        this.on('newListener',function (type) {
            if(type === 'data'){ // 用户监听了data事件
                this.flowing = true;
                this.read();
            }
        })
    }
    destroy(err){
        if(this.autoClose){
            if(typeof this.fd === 'number'){
                fs.close(this.fd,()=>{
                    this.emit('close');
                })
            }
            if(err){
                this.emit('error');
            }
        }
    }
    pipe(ws){
        this.on('data',  (chunk) => {
            let flag = ws.write(chunk);
            if (!flag) {
                this.pause();
            }
        });
        this.on('end',()=>{
            ws.end();
        })
        ws.on('drain',  () =>{
            this.resume();
        })
    }
    open(){
        fs.open(this.path,this.flags,(err,fd)=>{
            if(err){
                return this.destroy(err); // 公用
            }
            this.fd = fd;
            this.emit('open',fd)
        })
    }
    read(){
        if(typeof this.fd !== 'number'){
            return this.once('open',()=>this.read())
        }
        let buffer = Buffer.alloc(this.highWaterMark);
        //  计算一下每次读取多少个

        // 0 - 4  100个字节   读取5个 每次读取3
        let howMuchToRead = this.end ? Math.min(this.end - this.pos + 1, buffer.length) : buffer.length
        fs.read(this.fd, buffer, 0, howMuchToRead,this.pos, (err,bytesRead)=> {
            if(err){
                return this.destroy(err);
            }
            if (bytesRead){
                this.pos += bytesRead;
                this.emit('data', buffer.slice(0, bytesRead)); // 因为buffer很长，我们需要截取有效的长度
                if(this.flowing){                
                    this.read();
                }
            }else{
                this.emit('end');
                this.destroy();
            }
        })
    }
    resume(){
        this.flowing = true;
        this.read();
    }
    pause(){
        this.flowing = false;
    }
}