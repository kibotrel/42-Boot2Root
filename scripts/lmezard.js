const { readdirSync, readFileSync, writeFileSync } = require('fs')
const { exec, execSync } = require('child_process')

execSync('tar -xf fun')

const files = readdirSync('./ft_fun')
const codePieces = []

for (const file of files) {
  const fileData = readFileSync(`./ft_fun/${file}`).toString()
  const fileNumber = parseInt(fileData.split('\n').at(-1).substring('//file'.length))
  const code = fileData.replace(/(\/\/file\d+)/g, '')

  codePieces.push({ code, fileNumber })
}

codePieces.sort((a, b) => (a.fileNumber > b.fileNumber) ? 1 : -1)

let sourceCode = ''

for (const codePiece of codePieces) {
  sourceCode += codePiece.code
}

writeFileSync('main.c', sourceCode)
exec('gcc main.c ; echo -n $(./a.out | grep PASSWORD | cut -d " " -f4) | sha256sum | cut -d " " -f1', (error, stdout, stderr) => {
  console.log(stdout)
})
