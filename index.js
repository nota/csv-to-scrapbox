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

for (const row of rows) {
  let columns = {}
  for (let i = 0; i < row.length; i++) {
    columns[columnNames[i]] = row[i]
  }
  const text = ejs.render(template, columns)
  const title = text.split('\n', 1)[0] // use first line

  if (!title) {
    console.warn('skip: empty title')
    continue
  }

  console.log(title)
  const page = { title, text }
  scrapboxPages.push(page)
}

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
