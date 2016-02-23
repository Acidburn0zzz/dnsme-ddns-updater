import {EventEmitter} from 'events'

import RecordUpdater from './RecordUpdater.js'
import PublicIPAddressResolver from './PublicIPAddressResolver.js'

export default class DNSMEDDNSUpdater extends EventEmitter {
  constructor ({username, password, recordId, checkInterval}) {
    super()

    this.recordUpdater = new RecordUpdater({ username, password, recordId })
    this.publicIPAddressResolver = new PublicIPAddressResolver({ checkInterval })

    this.publicIPAddressResolver.resolve()
      .then(ip => {
        // Always update record on first run.
        this.recordUpdater.update(ip)

        // Watch for public IP address changes.
        this.publicIPAddressResolver
          .on('change', ip => this.recordUpdater.update(ip))
          .on('error', err => this.emit('error', err))
      })
      .catch(err => this.emit('error', err))
  }
}
