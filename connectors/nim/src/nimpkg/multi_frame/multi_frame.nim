import asyncdispatch, asynchttpserver, ws

proc listen_multi_frame*(req: Request, connections: seq[WebSocket]): Future[seq[WebSocket]] {.async, gcsafe.} =
    try:
      var ws = await newWebSocket(req)
      connections.add(ws)
      while ws.readyState == Open:
        let packet = await ws.receiveStrPacket()
        echo "Received packet: " & packet
        for other in connections:
          if other.readyState == Open:
            asyncCheck other.send(packet)
    except WebSocketClosedError:
      echo "Socket closed. "
    except WebSocketProtocolMismatchError:
      echo "Socket tried to use an unknown protocol: ", getCurrentExceptionMsg()
    except WebSocketError:
      echo "Unexpected socket error: ", getCurrentExceptionMsg()
    
    return connections
