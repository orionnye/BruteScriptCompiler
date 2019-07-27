let fs = require("fs")
let path = require("path")

let readingFile = path.join(process.cwd(), "index.html")
let newFile = path.join(process.cwd(), "compiled.html")
console.log(readingFile)
let readFile = fs.readFileSync(readingFile).toString()
let findScripts = /<script src="[^"]*"><[/]script>/g
let scriptTags = readFile.match(findScripts)
let scriptFiles = stripScripts(scriptTags)
console.log(scriptFiles)
let scriptData = compileScripts(scriptFiles)
console.log(scriptData.toString())
compile()

function stripScripts(scriptTagArray) {
    let tagStrip = /"[^"]*"/g
    let scripts = []
    scriptTagArray.forEach(scriptTag => {
        let script = scriptTag.match(tagStrip).toString()
        let stripped = script.substring(1, script.length - 1)
        scripts.push(stripped)
    })
    return scripts
}
function compileScripts(Files) {
    let data = []
    Files.forEach(file => {
        let filePath = path.join(process.cwd(), file)
        let fileData = fs.readFileSync(filePath).toString()
        data.push(fileData)
    })
    return data.join("\n\n")
}
function compile() {
    //html data
    let fileData = readFile
    let scriptAndTagStart = "<script>\n" + scriptData
    let scriptTagEnd = "\n</script>"
    for(let i = 0; i < scriptTags.length; i++) {
        if (i == 0) {
            fileData = fileData.replace(scriptTags[i], scriptAndTagStart)
        }
        else if (i == scriptTags.length - 1) {
            fileData = fileData.replace(scriptTags[i], scriptTagEnd)
        }
        else {
            fileData = fileData.replace(scriptTags[i], "")
        }
    }
    //add script data
    console.log(fileData)
    fs.writeFileSync(newFile, fileData, (err) => {
        if (err) {
            console.log("error writing file")
        }
        console.log("wrote file")
    })
}