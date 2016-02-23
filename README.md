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

## OS X launchd Setup

Create a `.plist` file in `/Library/LaunchDaemons`, for example:

```xml
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
  <key>Label</key>
  <string>com.example.dnsme-ddns-updater</string>
  <key>ProgramArguments</key>
  <array>
    <string>/usr/local/bin/node</string>
    <string>/usr/local/bin/dnsme-ddns-updater</string>
    <string>--username=bob@example.com</string>
    <string>--record-id=8882239</string>
    <string>--password=theyllneverguess</string>
    <string>--check-interval=300</string>
  </array>
  <key>KeepAlive</key>
  <true/>
  <key>StandardOutPath</key>
  <string>/var/log/dnsme-ddns-updater.log</string>
  <key>StandardErrorPath</key>
  <string>/var/log/dnsme-ddns-updater.log</string>
</dict>
</plist>
```

Then, for example, run:

```sh
sudo launchctl load /Library/LaunchDaemons/com.example.dnsme-ddns-updater.plist
```
