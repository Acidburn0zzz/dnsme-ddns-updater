import fetch from 'node-fetch'

export default class RecordUpdater {
  constructor ({username, password, recordId}) {
    if (username === undefined) {
      throw new Error(`Missing username parameter.`)
    }
    else if (password === undefined) {
      throw new Error(`Missing password parameter.`)
    }
    else if (recordId === undefined) {
      throw new Error(`Missing recordId parameter.`)
    }

    this._fetch = fetch
    this.username = username
    this.password = password
    this.recordId = recordId
  }

  updateRecord (ipAddress) {
    const uri = 'https://cp.dnsmadeeasy.com/servlet/updateip'
    const q = [
      `username=${encodeURIComponent(this.username)}`,
      `password=${encodeURIComponent(this.password)}`,
      `id=${encodeURIComponent(this.recordId)}`,
      `ip=${encodeURIComponent(ipAddress)}`,
    ]

    return (this._fetch)(`${uri}?${q.join('&')}`)
  }
}
