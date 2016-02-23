#!/usr/bin/env node

require("shelljs/global")
var LineWrapper = require("stream-line-wrapper")
var rimraf = require("rimraf")
var sysexits = require("sysexits")
var spawn = require("child_process").spawn

cd(__dirname)
var cleanResult = clean()
mkdir('-p', 'dist/es5')

Promise.all([
  babel('lib'),
  babel('bin'),
  babel('index.js')
]).then(function () {
  chmod('a+x', 'dist/es5/bin/*')
})
.then(cleanResult)
.then(function () {
  console.log("\nmake.js: Done!")
})
.catch(function (err) {
  console.error("error: ", err)
  process.exit(sysexits.SOFTWARE)
})

function babel (file) {
  var args = test('-d', file) ?
    ['-s','inline', '-D', file, '-d', 'dist/es5/'+file] :
    ['-s', 'inline', file, '-o', 'dist/es5/'+file]
  return spawner('babel', args)
}

function clean () {
  if (! test('-e', 'dist')) return Promise.resolve()

  mv('dist', 'dist-delete-me')
  return new Promise(function (resolve, reject) {
    rimraf('dist-delete-me', function (err) {
      return err ? reject(err) : resolve()
    })
  })
}

function spawner (cmd, args) {
  return new Promise(function(resolve, reject) {
    var child = spawn(cmd, args, { stdio: ["ignore", process.stdout, "pipe"] })

    var cmdLine = cmd + args.join(" ")
    var cmdPrefixer = new LineWrapper({ prefix: cmdLine+": " })
    child.stderr.pipe(cmdPrefixer).pipe(process.stderr)

    child.on("close", function (code) {
      if (code === 0) return resolve()
      return reject(new Error(cmdLine + ": returned code " + code))
    })
  })
}
