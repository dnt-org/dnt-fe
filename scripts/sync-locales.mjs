import fs from 'fs'
import path from 'path'

const root = process.cwd()
const viPath = path.join(root, 'src', 'locales', 'vi.json')
const enPath = path.join(root, 'src', 'locales', 'en.json')

function syncObject(viObj, enObj) {
  if (!enObj || typeof enObj !== 'object') enObj = {}
  for (const key of Object.keys(viObj)) {
    const viVal = viObj[key]
    const enKeySibling = key + 'En'
    const hasSiblingEn = Object.prototype.hasOwnProperty.call(viObj, enKeySibling)

    if (viVal && typeof viVal === 'object' && !Array.isArray(viVal)) {
      enObj[key] = syncObject(viVal, enObj[key])
      if (hasSiblingEn && typeof viObj[enKeySibling] === 'object') {
        enObj[enKeySibling] = syncObject(viObj[enKeySibling], enObj[enKeySibling])
      }
    } else {
      const enValFromSibling = hasSiblingEn && typeof viObj[enKeySibling] === 'string' ? viObj[enKeySibling] : undefined
      const existingEnVal = enObj[key]
      enObj[key] = enValFromSibling !== undefined ? enValFromSibling : existingEnVal !== undefined ? existingEnVal : viVal
      if (hasSiblingEn && enObj[enKeySibling] === undefined) {
        enObj[enKeySibling] = viObj[enKeySibling]
      }
    }
  }
  return enObj
}

function main() {
  const viRaw = fs.readFileSync(viPath, 'utf8')
  const enRaw = fs.readFileSync(enPath, 'utf8')
  const viJson = JSON.parse(viRaw)
  const enJson = JSON.parse(enRaw)
  const merged = syncObject(viJson, enJson)
  fs.writeFileSync(enPath, JSON.stringify(merged, null, 2) + '\n', 'utf8')
  console.log('Synced en.json with vi.json')
}

main()