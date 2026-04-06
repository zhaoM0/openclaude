import { afterEach, describe, expect, mock, test } from 'bun:test'
import { join } from 'node:path'

type MockProjectConfig = {
  hasCompletedProjectOnboarding?: boolean
  projectOnboardingSeenCount: number
}

let mockProjectConfig: MockProjectConfig

function installCommonMocks(options: {
  cwd: string
  existingFiles: string[]
  isWorkspaceDirEmpty?: boolean
}) {
  const existingFiles = new Set(options.existingFiles)

  mockProjectConfig = {
    hasCompletedProjectOnboarding: false,
    projectOnboardingSeenCount: 0,
  }

  mock.module('./utils/config.js', () => ({
    getCurrentProjectConfig: () => mockProjectConfig,
    saveCurrentProjectConfig: (
      updater: (current: MockProjectConfig) => MockProjectConfig,
    ) => {
      mockProjectConfig = updater(mockProjectConfig)
    },
  }))

  mock.module('./utils/cwd.js', () => ({
    getCwd: () => options.cwd,
  }))

  mock.module('./utils/file.js', () => ({
    isDirEmpty: () => options.isWorkspaceDirEmpty ?? false,
  }))

  mock.module('./utils/fsOperations.js', () => ({
    getFsImplementation: () => ({
      existsSync: (filePath: string) => existingFiles.has(filePath),
    }),
  }))
}

async function importFreshProjectOnboardingState(options: {
  cwd: string
  existingFiles: string[]
  isWorkspaceDirEmpty?: boolean
}) {
  mock.restore()
  installCommonMocks(options)
  return import(`./projectOnboardingState.ts?ts=${Date.now()}-${Math.random()}`)
}

afterEach(() => {
  mock.restore()
})

describe('project onboarding completion', () => {
  test('is incomplete when neither AGENTS.md nor CLAUDE.md exists', async () => {
    const cwd = '/repo'
    const { getSteps, isProjectOnboardingComplete } =
      await importFreshProjectOnboardingState({
        cwd,
        existingFiles: [],
      })

    expect(isProjectOnboardingComplete()).toBe(false)
    expect(getSteps()[1]?.text).toContain('AGENTS.md')
  })

  test('is complete when only CLAUDE.md exists', async () => {
    const cwd = '/repo'
    const { isProjectOnboardingComplete } =
      await importFreshProjectOnboardingState({
        cwd,
        existingFiles: [join(cwd, 'CLAUDE.md')],
      })

    expect(isProjectOnboardingComplete()).toBe(true)
  })

  test('is complete when only AGENTS.md exists', async () => {
    const cwd = '/repo'
    const { isProjectOnboardingComplete } =
      await importFreshProjectOnboardingState({
        cwd,
        existingFiles: [join(cwd, 'AGENTS.md')],
      })

    expect(isProjectOnboardingComplete()).toBe(true)
  })
})
