declare global {
  interface Window {
    vds: any
  }
}
export default class Detail {
  $el: HTMLElement

  constructor(el: HTMLElement) {
    this.$el = el

    this.$el.style.position = 'absolute'
    this.$el.style.top = '0'
    this.$el.style.left = '0'
    this.$el.style.width = '100%'
    this.$el.style.height = '100%'
    this.$el.style.background = '#fff'
    this.$el.style.display = 'none'

    this.$el.addEventListener('click', (e) => {
      if ((e.target as HTMLElement).classList.contains('eruda-back'))
        this.hide()
    })
  }

  show(data: any) {
    this.$el.style.display = 'block'
    const vds = window.vds
    const headerHtml = `<div style="height: 40px; display: flex; align-items: center; background-color: #f3f3f3;">
                          <span class="eruda-icon-arrow-left eruda-back" style="padding: 0 10px; margin-right: 5px"></span>
                          <span>${vds.origin} (${vds.accountId})</span>
                        </div>`
    this.$el.innerHTML = `
      <div style="width: 100%;height:100%">
        ${headerHtml}
        <pre style="padding: 20px; word-break: break-all;">${JSON.stringify({
          ...data,
          _tm: undefined,
        }, null, 2)}</pre>
      </div>
    `
  }

  hide() {
    this.$el.style.display = 'none'
  }
}
