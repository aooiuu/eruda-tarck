import LS from 'lz-string'
import LunaDataGrid from 'luna-data-grid'
import throttle from 'licia/throttle'
import ResizeSensor from 'licia/ResizeSensor'
import dateFormat from 'licia/dateFormat'
import copy from 'licia/copy'
import Detail from './Detail'

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
      this._detail = new Detail($el.find('.eruda-detail').get(0))

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

    clear() {
      this._requests = {}
      this._requestDataGrid.clear()
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
      // <span class="eruda-icon-filter eruda-filter"></span>
      $el.html(
        `<div class="eruda-track" style="width:100%; height: 100%;">
          <div class="eruda-network">
            <div class="eruda-control" style="display: flex; height: 40px; padding: 10px; line-height: 20px; gap: 5px; font-size: 16px; background: #f3f3f3">
              <span class="eruda-icon-record eruda-record eruda-recording" style="color: #f20"></span>
              <span class="eruda-icon-clear eruda-clear-request"></span>
              <div style="flex: 1;"></div>
              <span class="eruda-icon-eye eruda-icon-disabled eruda-show-detail"></span>
              <span class="eruda-icon-copy eruda-icon-disabled eruda-copy-curl"></span>
              <span class="eruda-filter-text"></span>
            </div>
            <div class="eruda-requests"></div>
          </div>
          <div class="eruda-detail"></div>
        </div>
        `,
      )
      this._$requests = $el.find('.eruda-requests')
      this._$control = $el.find('.eruda-control')
    }

    _updateButtons() {
      const $control = this._$control
      const $showDetail = $control.find('.eruda-show-detail')
      const $copyCurl = $control.find('.eruda-copy-curl')
      const iconDisabled = 'eruda-icon-disabled'

      $showDetail.addClass(iconDisabled)
      $copyCurl.addClass(iconDisabled)

      if (this._selectedRequest) {
        $showDetail.rmClass(iconDisabled)
        $copyCurl.rmClass(iconDisabled)
      }
    }

    _copy = () => {
      copy(JSON.stringify(this._selectedRequest))
      this._container.notify('已复制')
    }

    _bindEvent() {
      const $control = this._$control

      $control
        .on('click', '.eruda-clear-request', () => this.clear())
        .on('click', '.eruda-show-detail', () => { this._detail.show(this._selectedRequest) })
        .on('click', '.eruda-copy-curl', () => this._copy())

      const requestDataGrid = this._requestDataGrid

      requestDataGrid.on('select', (node: any) => {
        this._selectedRequest = node.data
        this._updateButtons()
      })

      requestDataGrid.on('deselect', () => {
        // this._detail.hide()
        this._selectedRequest = null
        this._updateButtons()
      })

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
      this._requestDataGrid.append(
        {
          ...data,
          _tm: dateFormat(new Date(data.tm), 'isoTime'),
        },
        { selectable: true },
      )
    }
  }

  return new Plugin()
}
