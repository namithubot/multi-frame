import nimpkg/router, asynchttpserver, asyncdispatch

when isMainModule:
  var server = newAsyncHttpServer()
  waitFor server.serve(Port(3000), start)
