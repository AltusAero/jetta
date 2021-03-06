#! /usr/local/bin/node
'use strict'

const Bronze = require('bronze')
const tape = require('tape')

const jetta = require('../../')
const config = require('./.config')
const defaults = require('../../data/defaults')
const packageInfo = require('../../package')
const testTools = require('../tools')

const instanceDefaultTests = require('./instance-default')
const instancePublicSuffixInstanceTests = require('./instance-public-suffix-instance')
const instancePublicSuffixInstanceReadyTests = require('./instance-public-suffix-instance-ready')
const instancePublicSuffixOptionsTests = require('./instance-public-suffix-options')

const m = testTools.generateTestMessage
const ev = testTools.errorVerification
const errorCategory = 'cookie'
const b = new Bronze({name: 'test-cookie-manager'})
let shared = {jetta, config, defaults, testTools, errorCategory, m, ev, packageInfo, b}

tape('cookie-manager', {timeout: 60 * 1000}, (t) => {
  process.on('unhandledRejection', (error) => {
    throw error
  })

  async function asyncTests () {
    t.equal(typeof jetta.CookieManager, 'function', `jetta.CookieManager should be a function (class)`)
    t.equal(typeof jetta.CookieManagerCookie, 'function', `jetta.CookieManagerCookie should be a function (class)`)
    t.doesNotThrow(() => new jetta.CookieManagerCookie(), `new jetta.CookieManagerCookie should not throw when no params have been passed`)
    t.equal(typeof jetta.CookieManager.keysToDestroy, 'object', `jetta.CookieManager.keysToDestroy should be an object`)
    t.notEqual(jetta.CookieManager.keysToDestroy, null, `jetta.CookieManager.keysToDestroy should be \`null\``)

    await testTools.prepareCachedDefaultPublicSuffixList(shared.defaults)
    testTools.cleanupFiles(defaults.publicSuffix.path)

    await instanceDefaultTests(t, [], shared)
    await instancePublicSuffixInstanceTests(t, [], shared)
    await instancePublicSuffixInstanceReadyTests(t, [], shared)
    await instancePublicSuffixOptionsTests(t, [], shared)

    testTools.cleanupFiles(defaults.publicSuffix.path)

    t.end()
  }

  asyncTests()
})
