(async () => {
    const bytes = (await (await fetch(path)).arrayBuffer())
    WebAssembly.instantiate(bytes).then(results => {
        document.writeln("[+] WASM Loaded!")
        document.writeln(results)
    }).catch(err => console.error("[-] Failed Loading Wasm! err ["+err+"]"))
    console.log(r)
})()