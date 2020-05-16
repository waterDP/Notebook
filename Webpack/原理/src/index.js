// todo 懒加载
document.getElementById('main1-loadC1').addEventListener('click', () => {
  import(/*webpackChunkName: "c1"*/'c1').then(c1 => {
    console.log(c1)
  })
})