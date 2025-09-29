import fs from 'fs' // or 'node:fs' if supported

const readFromTodosFile = () => {
  const foo = fs.readFileSync('./todos.json', 'utf8')
  const bar = JSON.parse(foo)
  console.log(bar)
}

readFromTodosFile()