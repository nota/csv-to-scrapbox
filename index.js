const fs = require('fs')
const path = require('path')
const parse = require('csv-parse/lib/sync')
const ejs = require('ejs')

const csvPath = process.argv[2]
if (!csvPath) {
  console.log('Requires csv path name. Call: node index.js xxx.csv')
  process.exit(1)
}

const projectName = path.basename(csvPath, '.csv')
console.log('Got projectName:', projectName)
const raw = fs.readFileSync(csvPath)
const rows = parse(raw)

const template = fs.readFileSync(`${projectName}-template.ejs`, 'utf-8')

const scrapboxPages = []
const columnNames = rows.shift().map(c => c.trim())
console.log('Columns:', columnNames)

let row_num = 0
let skipped = 0
let added = 0
for (const row of rows) {
  const columns = {}
  for (let i = 0; i < row.length; i++) {
    columns[columnNames[i]] = row[i]
  }
  const text = ejs.render(template, columns)
  const title = text.split('\n', 1)[0] // use first line
  row_num++

  if (!title) {
    console.warn(row_num, 'skip: empty title')
    skipped++
    continue
  }

  added++

  console.log(row_num, title)
  const page = { title, text }
  scrapboxPages.push(page)
}

console.log('added', added, ', skipped', skipped)

saveScrapboxProject({ projectName, scrapboxPages })

function saveScrapboxProject ({ projectName, scrapboxPages }) {
  const scrapboxProject = {
    name: projectName,
    displayName: projectName,
    pages: scrapboxPages.map(({ title, text }) => {
      return {
        title: title,
        lines: text.split('\n')
      }
    })
  }
  const json = JSON.stringify(scrapboxProject, null, 2)
  const path = `${projectName}-scrapbox.json`
  fs.writeFileSync(path, json)
  console.log('wrote scrapbox json file at', path)
}
