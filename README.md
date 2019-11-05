# CSV to Scrapbox

## Install

`$ npm install`

## See sample demo

Run
`$ node index.js sample.csv`

Then you will get
`sample-scrapbox.json`

## How to use

### Prepare template

Write a template in [EJS](https://ejs.co/) format.
Place the CSV and the template file in the root directrory of the repository.
The template's file name must be `xxx-template.csv`

```
xxx.csv
xxx-template.ejs
```

Run
`$ node index.js xxx.csv`

Then you will get
`xxx-scrapbox.json`

Note: You can use Non-ascii column name in the CSV
