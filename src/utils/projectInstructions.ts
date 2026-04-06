import { join } from 'path'

export const PRIMARY_PROJECT_INSTRUCTION_FILE = 'AGENTS.md'
export const FALLBACK_PROJECT_INSTRUCTION_FILE = 'CLAUDE.md'

export function getProjectInstructionFilePath(
  dir: string,
  existsSync: (path: string) => boolean,
): string {
  const primaryPath = join(dir, PRIMARY_PROJECT_INSTRUCTION_FILE)
  return existsSync(primaryPath)
    ? primaryPath
    : join(dir, FALLBACK_PROJECT_INSTRUCTION_FILE)
}

export function hasProjectInstructionFile(
  dir: string,
  existsSync: (path: string) => boolean,
): boolean {
  return (
    existsSync(join(dir, PRIMARY_PROJECT_INSTRUCTION_FILE)) ||
    existsSync(join(dir, FALLBACK_PROJECT_INSTRUCTION_FILE))
  )
}

export function isProjectInstructionFileName(name: string): boolean {
  return (
    name === PRIMARY_PROJECT_INSTRUCTION_FILE ||
    name === FALLBACK_PROJECT_INSTRUCTION_FILE
  )
}
