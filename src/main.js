
const $siteList = $('.sitelist')
const $lastLi = $siteList.find('li.last')
const x = localStorage.getItem('x')
// x是字符串 需要转成对象
const xObject = JSON.parse(x)
//需要注意第一次的时候xObject是空的 若为空则使用默认值 否则获取localStorage里面的值
const hashMap = xObject || [
  { logo: 'A', url: 'https://www.acfun.cn' },
  { logo: 'B', url: 'https://www.bilibili.com' },
]

//将新增的url中的https前缀去除
const simplifyUrl = (url) => {
  return url.replace('https://', '').replace('http://', '').replace('www.', '').replace(/\/.*/, '') //删除/开头的内容
}

const render = () => {
  // 添加新的li之后再次进行渲染需要将之前加入的li先清空掉
  $siteList.find('li:not(.last)').remove()
  hashMap.forEach((node, index) => {
    const $li = $(`<li>
        <div class="site">
          <div class="logo">${node.logo}</div>
          <div class="link">${simplifyUrl(node.url)}</div>
          <div class="close">
            <svg class="icon">
              <use xlink:href="#icon-close"></use>
            </svg>
          </div>
        </div>
    </li>`).insertBefore($lastLi)
    $li.on('click', () => {
      window.open(node.url)
    })
    // //阻止事件冒泡 使得点击关闭按钮不会跳转到相应页面
    $li.on('click', '.close', (e) => {
      //阻止冒泡 防止调用了window.open
      e.stopPropagation()
      // console.log(hashMap);
      hashMap.splice(index, 1)
      render()
    })
  })
}

render()

$('.add-button').on('click', () => {
  let url = window.prompt('请问你要添加的网址是什么？')
  if (url.indexOf('http') !== 0) {
    url = 'https://' + url
  }
  hashMap.push({
    logo: simplifyUrl(url)[0].toUpperCase(),
    url: url
  })
  render()
})

// 用户页面关闭时触发
window.onbeforeunload = () => {
  // localStorage只能存字符串 不能存对象 需要将对象转成字符串
  const string = JSON.stringify(hashMap)
  localStorage.setItem('x', string)
}

$(document).on('keypress', (e) => {
  const { key } = e
  for (let i = 0; i < hashMap.length; i++) {
    if (hashMap[i].logo.toLowerCase() === key) {
      window.open(hashMap[i].url)
    }
  }

})