/**
 * 使用方法：
 * main.js:
 *    import '...clamp.js'
 *
 * vue 文件：
 *   <div v-clamp="line" cursor="..." tip="...">{{ context }}</div>
 *   line：行数 (Number)
 *   context: 文本内容
 *   cursor: 鼠标悬浮样式 (String, 默认 default)
 *   tip: 鼠标悬浮显示文本 (String, 默认 context)
 */

import Vue from 'vue'

const style = {
  position: 'fixed',
  top: 0,
  zIndex: -9999,
  opacity: 0,
  wordBreak: 'break-all'
}

const clampCompute = (el, text, line, more, inline, maxWidth) => {
  if (!line) return text
  const hideBox = document.createElement('div')
  Object.assign(hideBox.style, style)
  const elWidth = el.clientWidth
  let { fontSize, maxWidth: mw } = getComputedStyle(el)
  maxWidth = maxWidth || (mw ? parseFloat(mw) : null)
  fontSize = parseInt(fontSize)
  hideBox.style.width = (maxWidth || elWidth) + 'px'
  hideBox.style.fontSize = fontSize + 'px'
  hideBox.style.whiteSpace = 'pre-wrap'
  // (text.match(/\b[a-z]+\b|./ig) || [])
  text.split('')
    .forEach(s => {
      const span = document.createElement('span')
      span.className = 'hide-span'
      span.innerHTML = s
      hideBox.appendChild(span)
    })
  document.body.appendChild(hideBox)
  const hideSpans = [].map.call(hideBox.querySelectorAll('.hide-span'), span => span)
  const keys = []
  for (let span of hideSpans) {
    const { offsetTop, textContent } = span
    if (textContent.replace(/ /g, '') && !keys.includes(offsetTop)) keys.push(offsetTop)
    if (keys.length >= line) break
  }
  let result = text

  if ([].some.call(hideSpans, span => span.textContent.replace(/ /g, '') && !keys.includes(span.offsetTop))) {
    const index = hideSpans.reverse().findIndex(span => {
      const { offsetTop, offsetLeft } = span
      const { width: sw } = span.getBoundingClientRect()
      return span.textContent.replace(' ', '') // 是否有内容
        // 存在 offsetTop 属性
        && keys.includes(offsetTop)
        // 是否能显示下 ...
        && ((maxWidth || elWidth) - offsetLeft - sw > (more && inline ? 6 : 1.5) * fontSize)
    })
    result = hideSpans.reverse().slice(0, -index).map(span => span.textContent).join('') + '...'
  }
  document.body.removeChild(hideBox)
  return result
}

const clampFun = (el, binding, vnode) => {
  const text = (vnode && vnode.children && vnode.children[0] && vnode.children[0].text && vnode.children[0].text.replace(/(^\s+|\s+$)|\s+/g, (kw, $1) => $1 ? '' : ' ')) || ''
  const cursor = vnode.data.attrs ? vnode.data.attrs.cursor : 'default'
  const placement = vnode.data.placement
  const tip = vnode.data.attrs ? vnode.data.attrs.tip : ''
  const untip = binding.modifiers.untip || false
  const more = binding.modifiers.more || false
  const inline = binding.modifiers.inline || false
  const maxWidth = +(vnode.data.attrs || {})['max-width'] || undefined
  const showText = clampCompute(el, text, binding.value, more, inline, maxWidth)
  el.childNodes.forEach(node => el.removeChild(node))

  const events = {}
  if (vnode.data.on) {
    Object.keys(vnode.data.on).forEach(event => {
      events[event] = vnode.data.on[event].fns
      vnode.data.on[event].fns = () => {}
    })
  }

  // let showMore = false

  const props = {
    content: tip || text,
    effect: 'light',
    disabled: more || untip || showText === text,
    showMore: false
  }

  placement && (props.placement = placement)


  const tooltip = new (Vue.extend({
    render(h) {
      const vm = this
      const children = [
        h(
          'span',
          {
            style: { cursor },
            on: events
          },
          [
            (more && vm.showMore) ? text : showText,
            (more && showText !== text) ? vm.showMore ? h(
              'el-button',
              {
                style: { padding: '0 5px' },
                props: { type: 'text' },
                on: {
                  click() {
                    vm.showMore = false
                    events.more && events.more()
                    tooltip.$forceUpdate()
                  }
                }
              },
              ['收起', h('i', { class: 'el-icon-arrow-up' })]
            ) : h(
              'el-button',
              {
                style: { padding: '0' },
                props: { type: 'text' },
                on: {
                  click() {
                    vm.showMore = true
                    events.more && events.more()
                    tooltip.$forceUpdate()
                  }
                }
              },
              ['查看更多', h('i', { class: 'el-icon-arrow-down' })]
            ) : ''
          ]
        )
      ]

      return h(
        'el-tooltip',
        {
          props: props
        },
        children
      )
    }
  }))()

  el.tooltip && el.tooltip.$destroy()

  tooltip.$mount()
  el.appendChild(tooltip.$el)

  el.tooltip = tooltip

}

Vue.directive('clamp', {
  inserted: clampFun,
  componentUpdated: clampFun
})
