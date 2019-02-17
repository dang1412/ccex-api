/**
 * Create symlink folder to root's dist as ccex-api
 */

'use strict'
const symlinkDir = require('symlink-dir')
const path = require('path')
const dist = path.resolve(__dirname, '../../dist')

symlinkDir(dist, 'node_modules/ccex-api')
  .then(result => {
    console.log('symlink ccex-api created', result)
  })
  .catch(err => console.error(err))
