import { writeFile } from 'node:fs/promises'

const endpoint = 'https://api.ipsw.me/v4/devices'
const response = await fetch(endpoint, { headers: { 'user-agent': 'Brxvih/1.0 (+https://brxvih.com)' } })
if (!response.ok) throw new Error(`ipsw.me returned ${response.status}`)

const devices = await response.json()
const iphones = devices
  .filter((device) => /^iPhone\d+,\d+$/.test(device.identifier) && /iPhone/i.test(device.name))
  .map((device) => ({
    name: device.name,
    identifier: device.identifier,
    platform: device.platform,
    board: device.boardconfig,
  }))

if (iphones.length < 30) throw new Error(`Unexpectedly few iPhone devices: ${iphones.length}`)

iphones.sort((a, b) => {
  const av = a.identifier.match(/\d+/g).map(Number)
  const bv = b.identifier.match(/\d+/g).map(Number)
  return bv[0] - av[0] || bv[1] - av[1] || a.name.localeCompare(b.name)
})

const output = {
  generatedAt: new Date().toISOString(),
  source: 'ipsw.me device catalogue',
  sourceUrl: 'https://ipsw.me/',
  count: iphones.length,
  devices: iphones,
}

await writeFile(new URL('../data/iphones.json', import.meta.url), JSON.stringify(output, null, 2) + '\n')
console.log(`Wrote ${iphones.length} iPhone identifiers to data/iphones.json`)
