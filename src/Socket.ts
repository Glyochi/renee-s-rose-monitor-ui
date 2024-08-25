import { io } from "socket.io-client";

export type SocketProps = {
  url: string;
  setWebsocketConnected: (connected: boolean) => void;
  updateFrame: (base64_frame: string) => void;
};
export class Socket {
  // SocketIO properties
  socketio: any;
  videoSocket: any;
  client_id: String;
  props: SocketProps;

  // Update states/refs in UI functions

  constructor(props: SocketProps) {
    this.props = props;
    this.socketio = io(props.url, {
      upgrade: true,
      transports: ["websocket"],
    });
    this.client_id = this.socketio.id;

    // Attempt connecting then disconnecting.
    // Some cases when not doing the connect, disconnect step, websocket connection is created right away?
    // This is to prevent client to make a connection to the server to soon. We just want it to be there
    let temp = this.socketio.connect();
    temp.disconnect();
  }

  // Setting up/shutting down websocket connection functions
  connectAndSetup = () => {
    this.videoSocket = this.socketio.connect();

    this.videoSocket.on("connect", () => {
    
      this.props.setWebsocketConnected(true);

      console.log("connecting");
      console.log(this.videoSocket.id);
      console.dir(this.videoSocket.io.engine.transport.name);

      this.videoSocket.on("connect_error", (err: any) => {
        // the reason of the error, for example "xhr poll error"
        console.log(err.message);

        // some additional description, for example the status code of the initial HTTP response
        console.log(err.description);

        // some additional context, for example the XMLHttpRequest object
        console.log(err.context);
      });

      this.videoSocket.on("upgrade", () => {
        console.log("upgrading");
        console.dir(this.videoSocket.io.engine.transport.name);
      });
      this.videoSocket.on("disconnect", () => {
        this.props.setWebsocketConnected(false);
        console.log("audio websocket disconnected.");
      });

      this.videoSocket.on("stream_frame", (data: any) => {
        let base64_frame = data["base64_frame"];
        
        this.props.updateFrame(base64_frame)
      })
    });

    // Stream camera 1
  };


  disconnect = () => {
    this.videoSocket.disconnect();
    this.videoSocket = null;
  };
}
