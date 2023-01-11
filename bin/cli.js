#!/usr/bin/env node

const { execSync } = require('child_process')
const fs = require('fs')

const runCommand = command => {
  try {
    execSync(`${command}`, { stdio: 'inherit' })
  } catch (error) {
    console.log(`Failed to execute ${command}`, error)
    return false
  }
  return true
}

const repoName = process.argv[2] ? process.argv[2] : 'lambda-sqs-consumer'

const gitCheckoutCommand = `git clone https://github.com/MeetBit/lambda-sqs-consumer.git ${repoName}`
const removeGitCommand = `cd ${repoName} && rm -rf .git`
const removeGithubActionsCommand = `cd ${repoName} && rm -rf .github/workflows/release.yml`
const removeBin = `cd ${repoName} && rm -rf bin/cli.js`
const renameCommand = `cd ${repoName} && node -e "let pkg=require('./package.json'); pkg.name='${repoName}'; require('fs').writeFileSync('package.json', JSON.stringify(pkg, null, 2));"`
const gitInitCommand = `cd ${repoName} && git init .`
const installDepsCommand = `cd ${repoName} && yarn`

console.log(`Cloning repository and creating ${repoName} project...`)
const checkedOut = runCommand(gitCheckoutCommand)
if (!checkedOut) process.exit(-1)

console.log(`Removing unnecessary files and folders...`)
const removedGit = runCommand(removeGitCommand)
if (!removedGit) process.exit(-1)

const removedGithubActions = runCommand(removeGithubActionsCommand)
if (!removedGithubActions) process.exit(-1)

console.log(`Renaming project to ${repoName}...`)
const renamed = runCommand(renameCommand)
if (!renamed) process.exit(-1)

console.log(`Initializing Git...`)
const initializedGit = runCommand(gitInitCommand)
if (!initializedGit) process.exit(-1)

console.log(`Installing dependencies for ${repoName}...`)
const installedDeps = runCommand(installDepsCommand)
if (!installedDeps) process.exit(-1)

console.log(`Lambda SQS Consumer created. Read README.md to get started.`)