import { feature } from 'bun:bundle'
import { isEnvTruthy } from '../utils/envUtils.js'

export function isNewInitEnabled(): boolean {
  return (
    feature('NEW_INIT') &&
    (process.env.USER_TYPE === 'ant' ||
      isEnvTruthy(process.env.CLAUDE_CODE_NEW_INIT))
  )
}
