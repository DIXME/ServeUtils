(module
  ;; Import a 'print' function from JS (env)
  (import "env" "print" (func $print (param i32 i32)))

  ;; Memory for strings
  (memory (export "memory") 1)

  ;; Data segment with our string
  (data (i32.const 0) "Hello, WebAssembly!")

  ;; Exported main function
  (func (export "main")
    i32.const 0      ;; pointer to start of string
    i32.const 19     ;; length of string in bytes
    call $print
  )
)
