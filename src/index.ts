import LS from 'lz-string'
import LunaDataGrid from 'luna-data-grid'
import throttle from 'licia/throttle'
import ResizeSensor from 'licia/ResizeSensor'
import dateFormat from 'licia/dateFormat'

const HOST = 'api.growingio.com'

export default function (eruda: any) {
  class Plugin extends eruda.Tool {
    constructor() {
      super()
      this.name = 'gio'
    }

    init($el: any, container: any) {
      super.init($el, container)
      this._container = container

      this._initTpl()

      this._requestDataGrid = new LunaDataGrid(this._$requests.get(0), {
        columns: [
          {
            id: 't',
            title: 'Type',
            weight: 20,
          },
          {
            id: 'n',
            title: 'EventId',
            weight: 40,
          },
          {
            id: '_tm',
            title: 'Time',
            sortable: true,
            weight: 40,
          },
        ],
      })
      this._resizeSensor = new ResizeSensor($el.get(0))
      this._bindEvent()
    }

    show() {
      super.show()
      this._updateDataGridHeight()
    }

    hide() {
      super.hide()
    }

    destroy() {
      super.destroy()
      window.navigator.sendBeacon = this._sendBeacon
      this._resizeSensor.destroy()
    }

    _updateDataGridHeight() {
      const height = this._$el.offset().height - this._$control.offset().height
      this._requestDataGrid.setOption({
        minHeight: height,
        maxHeight: height,
      })
    }

    _initTpl() {
      const $el = this._$el
      $el.html(
        `<div class="eruda-network">
          <div class="eruda-control">
          </div>
          <div class="eruda-requests"></div>
        </div>
        <div class="eruda-detail"></div>`,
      )
      this._$requests = $el.find('.eruda-requests')
      this._$control = $el.find('.eruda-control')
    }

    _bindEvent() {
      this._resizeSensor.addListener(
        throttle(() => this._updateDataGridHeight(), 15),
      )

      const sendBeacon = window.navigator.sendBeacon
      this._sendBeacon = sendBeacon
      const onBeacon = this._onBeacon.bind(this)
      window.navigator.sendBeacon = function (...arg) {
        onBeacon(arg[0] as string, arg[1] as Uint8Array)
        return sendBeacon.apply(this, arg)
      }
    }

    _onBeacon(url: string, data: Uint8Array) {
      if (!url.includes(HOST))
        return
      try {
        this._addRow(JSON.parse(LS.decompressFromUint8Array(data)))
      }
      catch (error) {
        console.warn(error)
      }
    }

    _addRow(data: any) {
      if (Array.isArray(data)) {
        data.forEach(row => this._addRow(row))
        return
      }

      if (data?.t !== 'cstm')
        return
      this._requestDataGrid.append({
        ...data,
        _tm: dateFormat(new Date(data.tm), 'isoTime'),
      }, { selectable: true })
    }
  }

  return new Plugin()
}
