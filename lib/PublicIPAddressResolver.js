import {EventEmitter} from 'events'

import ipify from 'ipify'

export default class PublicIPAddressResolver extends EventEmitter {
  constructor ({ checkInterval=300 } = {}) {
    super()

    const limit = 30
    if (checkInterval < limit) {
      throw new Error('A checkInterval option may not be less than ${limit}s.')
    }

    this._api = ipify
    this.checkInterval = checkInterval
    this.resultCache = null
    this._changeIntervalId = null

    this.on('newListener', event => this._handleNewListener(event))
    this.on('removeListener', event => this._handleRemoveListener(event))
  }

  resolve () {
    return new Promise((resolve, reject) =>
      (this._api)((err, ip) => {
        if (err) {
          if (this.listenerCount('error') > 0) {
            this.emit('error', err)
          }
          return reject(err)
        }

        const prevIp = this.resultCache
        this.resultCache = ip

        if (prevIp !== null && prevIp !== ip) {
          this.emit('change', ip)
        }

        return resolve(ip)
      })
    )
  }

  _handleNewListener (event) {
    if (event === 'change') {
      this._handleNewChangeListener()
    }
  }

  _handleNewChangeListener () {
    if (this._changeIntervalId === null) {
      if (this.resultCache === null) {
        this.resolve()
      }

      const interval = this.checkInterval * 1000
      this._changeIntervalId = setInterval(() => this.resolve(), interval)
    }
  }

  _handleRemoveListener (event) {
    if (event === 'change') {
      this._handleRemoveChangeListener()
    }
  }

  _handleRemoveChangeListener () {
    if (this.listenerCount('change') === 0) {
      if (this._changeIntervalId !== null) {
        clearInterval(this._changeIntervalId)
        this._changeIntervalId = null
      }
    }
  }
}
