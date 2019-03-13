'use strict'

const gitHelpers = require('../lib/git-helpers')

const env = process.env

function getRepoSlug () {
  const gitURL = env.GIT_URL
  if (gitURL) {
    return gitHelpers.getRepoSlug(gitURL)
  }
  console.warn('Failed to extract repoSlug, pushes will probably fail.')
  console.warn('Set repository.url with the repo GitHub url in package.json.')
  return env.SCM_URL
}

/**
 * Last commit is a lockfile update
 */
function isLockfileUpdate () {
  const reUpdateLockfile = /^chore\(package\): update lockfiles*$/mi
  const lastCommitMessage = gitHelpers.getLastCommitMessage()
  return reUpdateLockfile.test(lastCommitMessage)
}

module.exports = {
  gitUrl: env.GIT_URL,
  // The GitHub repo slug
  repoSlug: getRepoSlug(),
  // The name of the current branch
  branchName: env.GIT_BRANCH,
  // Is this a regular build
  correctBuild: (!env.SD_PULL_REQUEST || 0 === env.SD_PULL_REQUEST.length),
  // Should the lockfile be uploaded from this build
  uploadBuild: isLockfileUpdate()
}
