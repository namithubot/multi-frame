import asyncdispatch, asynchttpserver, ws, multi_frame/multi_frame

proc start*(req: Request) {.async, gcsafe.} =
  var connections = newSeq[WebSocket]()
  if req.url.path == "/multi-frame":
    connections = await listen_multi_frame(req, connections)
  await req.respond(Http200, "Hello World")
