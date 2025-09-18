interface StyleInjectOptions {
  insertAt?: 'top' | 'bottom'
}

export function styleInject(css: string, ref: StyleInjectOptions = {}): void {
  const insertAt = ref.insertAt

  if (!css || typeof document === 'undefined') return

  const head = document.head || document.getElementsByTagName('head')[0]
  const style = document.createElement('style')
  style.type = 'text/css'

  if (insertAt === 'top') {
    if (head.firstChild) {
      head.insertBefore(style, head.firstChild)
    } else {
      head.appendChild(style)
    }
  } else {
    head.appendChild(style)
  }

  if ((style as any).styleSheet) {
    // 兼容 IE
    ;(style as any).styleSheet.cssText = css
  } else {
    style.appendChild(document.createTextNode(css))
  }
}