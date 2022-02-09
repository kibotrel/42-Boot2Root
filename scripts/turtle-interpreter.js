const { readFileSync, writeFileSync } = require('fs')
const { execSync } = require('child_process')

const fileData = readFileSync('turtle').toString().split('\n')
const turtleCode = [
  '#!/usr/bin/python3',
  'from turtle import *',
  'pensize(3)',
  'left(90)',
]

for (const line of fileData) {
  const [value] = line.match(/\d+/) || []
  if (line.match(/gauche/)) {
    turtleCode.push(`left(${value})`)
  } else if (line.match(/Avance/)) {
    turtleCode.push(`forward(${value})`)
  } else if (line.match(/droite/)) {
    turtleCode.push(`right(${value})`)
  } else if (line.match(/Recule/)) {
    turtleCode.push(`backward(${value})`)
  }
}

turtleCode.push('delay(1000)', 'forward(0)')
writeFileSync('thor.py', turtleCode.join('\n'))
execSync('python3 thor.py')
