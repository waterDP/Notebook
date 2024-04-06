"use strict"

const iptUname = document.querySelector('input#uname')
const iptPwd = document.querySelector('input#pwd')
const btnRegist = document.querySelector('button#regist')
const btnLogin = document.querySelector('button#login')

function login() {
  if (iptUname.value === '' || iptPwd.value === '') {
    alert('请输入用记名和密码')
    return 
  }

}

btnLogin.onclick = login
