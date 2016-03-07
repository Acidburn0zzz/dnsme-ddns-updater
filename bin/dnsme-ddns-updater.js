#!/usr/bin/env node

import cmdline from 'commander'
import findUpSync from 'findup-sync'
import sysexits from 'sysexits'
import DNSMEDDNSUpdater from '../index.js'

const packageInfo = require(findUpSync('package.json', {cwd:__dirname}))

cmdline
  .description('Keeps DNS Made Easy dynamic DNS records up-to-date')
  .version(packageInfo.version)
  .option('--username [username]', 'DNS Made Easy username (required)')
  .option('--record-id [recordId]', 'Record identifier (required)')
  .option('--password [password]', 'Record password (required)')
  .option('--check-interval [checkInterval]', 'Seconds between public IP checks', parseInt)
  .parse(process.argv)

const {username, recordId, password, checkInterval} = cmdline

if (username === undefined || recordId === undefined || password === undefined) {
  cmdline.outputHelp()
  process.exit(sysexits.USAGE)
}

const updater = new DNSMEDDNSUpdater({username, recordId, password, checkInterval})
updater
  .on('change', ip => warn(`public IP change: ${ip}`))
  .on('error', err => warn((err && err.message) || err))

info(`starting`)
process.title = packageInfo.name

function info (message) {
  console.info(formatLogMessage(message))
}

function warn (message) {
  console.warn(formatLogMessage(message))
}

function formatLogMessage (message) {
  const datetime = (new Date()).toUTCString()
  return `[${datetime}]: ${message}`
}
