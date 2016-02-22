import ipify from 'ipify'

export default class PublicIPAddressResolver {
  constructor () {
    this._api = ipify
  }

  resolve () {
    return new Promise((resolve, reject) =>
      (this._api)((err, ip) => err ? reject(err) : resolve(ip))
    )
  }
}
