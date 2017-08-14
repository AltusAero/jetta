#! /usr/local/bin/node
'use strict'

const fs = require('fs')
const path = require('path')

const tape = require('tape')

const jetta = require('../../')
const testTools = require('../tools')

tape('make-nested-directory', (t) => {
  const testMakeNestedDirectories = ['t-d1', 't-d2', 't-d3', 't-d4']
  const testMakeNestedDirectoriesJoined = path.join(...testMakeNestedDirectories)

  function deleteTestDirectories () {
    for (let i = 0, len = testMakeNestedDirectories.length; i < len; i++) {
      try {
        fs.rmdirSync(path.join(...testMakeNestedDirectories.slice(0, len - i)))
      } catch (e) {}
    }
  }

  t.equal(typeof jetta.makeNestedDirectory, 'function', `makeNestedDirectory should be a object`)
  t.doesNotThrow(jetta.makeNestedDirectory, `makeNestedDirectory (no arguments) should not throw`)

  deleteTestDirectories()

  jetta.makeNestedDirectory(testMakeNestedDirectories[0])

  t.true(fs.existsSync(testMakeNestedDirectories[0]), `makeNestedDirectory('${testMakeNestedDirectories[0]}') should create ${testMakeNestedDirectories[0]}`)

  deleteTestDirectories()

  jetta.makeNestedDirectory(testMakeNestedDirectoriesJoined)

  t.true(fs.existsSync(testMakeNestedDirectoriesJoined), `makeNestedDirectory('${testMakeNestedDirectoriesJoined}') should create ${testMakeNestedDirectoriesJoined}`)

  deleteTestDirectories()

  jetta.makeNestedDirectory(testMakeNestedDirectories[0])
  jetta.makeNestedDirectory(testMakeNestedDirectoriesJoined)

  t.true(fs.existsSync(testMakeNestedDirectoriesJoined), `makeNestedDirectory('${testMakeNestedDirectoriesJoined}') should create ${testMakeNestedDirectoriesJoined}, even if one of the parent directories exist`)

  deleteTestDirectories()

  fs.writeFileSync(testMakeNestedDirectories[0], '')

  t.throws(() => { jetta.makeNestedDirectory(testMakeNestedDirectoriesJoined) }, `makeNestedDirectory('${testMakeNestedDirectoriesJoined}') should throw if nested directories cannot be created`)

  testTools.cleanupFiles(testMakeNestedDirectories[0])

  t.end()
})
