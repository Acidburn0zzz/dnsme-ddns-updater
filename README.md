# dnsme-ddns-updater

DNS Made Easy dynamic record updater

## Installation

For running as a daemon:

```
npm install -g dnsme-ddns-updater
```

For usage as a library:

```
npm install --save dnsme-ddns-updater
```

## Command Line Usage

Run the `dnsme-ddns-updater` command with the following required arguments:

  * `--username` followed by your DNS Made Easy username
  * `--password` followed by the password associated with the record you are updating
  * `--record-id` followed by the record identifier for the record you are updating

Use the following optional argument:

  * `--check-interval` followed by the number of seconds between public IP checks (no less than 30 seconds)

## Library Usage

### With Public IP Address Polling

```js
var DNSMEDDNSUpdater = require('dnsme-ddns-updater')

var updater = new DNSMEDDNSUpdater({
  username: "bob@example.com",
  recordId: "8882239",
  password: "theyllneverguess",
  checkInterval: 120
})

updater
  .on("change", function (ip) { console.log("ip changed: %s", ip)})
  .on("error", function (err) { console.warn(err.message) })
```

### Without Public IP Address Polling

```js
import {RecordUpdater} from 'dnsme-ddns-updater'

const updater = new RecordUpdater({ username, recordId, password })

updater.updateRecord('10.0.0.1')
  .then(() => console.log('Updated!'))
  .catch(err => console.warn(err.message))
```
