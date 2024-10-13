
// todo 此为图片进入视口的懒加载

const ob = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const img = entry.target
      img.src = img.dataset.src
      ob.unobserve(img)
    }
  })
}, {
  // root: null,
  // rootMargin: 0, 
  threshold: 0 // 阈值 0 表示元素刚进入视口就触发回调 1表示元素完全进入视口才回调
})

const imgs = document.querySelectorAll('img[data-src]')

imgs.forEach(img => {
  ob.observe(img)
})

