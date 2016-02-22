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
    const endpoint = 'https://cp.dnsmadeeasy.com/servlet/updateip'
    const query = [
      `username=${encodeURIComponent(this.username)}`,
      `password=${encodeURIComponent(this.password)}`,
      `id=${encodeURIComponent(this.recordId)}`,
      `ip=${encodeURIComponent(ipAddress)}`,
    ]
    const request = `${endpoint}?${query.join('&')}`

    return (this._fetch)(request)
      .then(response => {
        if (response.ok !== true) {
          throw new Error(`DNS Made Easy response failed with HTTP status: ${response.status}.`)
        }

        return response.text()
      })
      .then(body => {
        if (!body.match(/^\s*success\s*$/)) {
          throw new Error(`DNS Made Easy response failed with message: ${body}`)
        }

        return Promise.resolve()
      })
  }
}
