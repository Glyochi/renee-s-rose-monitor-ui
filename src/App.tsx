import { useEffect, useRef, useState } from 'react'
import './App.css'
import { Socket, SocketProps } from "./Socket.ts"
import axios from 'axios';


const URL = "http://100.88.89.49:5000" 
//const URL = "http://localhost:5000" 

function App() {
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [serverHealth, setServerHealth] = useState<boolean>(false);
  const [imageURL, setImageURL] = useState<string>("");
  const socket = useRef<any>();


  useEffect(() => {
    const socket_prop: SocketProps = {
      url: URL,
      //url: "http://100.124.181.90:5000",
      //url: "http://localhost:5000",
      setWebsocketConnected: (connected: boolean) => {
        setIsConnected(connected);
      },
      updateFrame: (base64_frame: string) => { 
        setImageURL("data:image/png;base64," + base64_frame)
      },

    }
    socket.current = new Socket(socket_prop)
    socket.current.connectAndSetup()
    function get_server_health() {
      axios.get(URL + "/health").then((response) =>{
        setServerHealth(true);
      }
      )
      setTimeout(() => {
        get_server_health()

      }, 5000)
    }

    get_server_health()
  }, [])



  return (
    <div className='w-full '>
    <div className={"flex flex-col justify-between w-[20rem] mx-auto mb-1 " + (serverHealth ? "bg-green-200" : "bg-red-200")}>
      <div>Connected: {isConnected.toString()}</div>
      <div>Server Health: {serverHealth ? "Gud" : "HES DEDDDD 😿"}</div>
    </div>
       <img src={imageURL}></img> 
    </div>

  )
}

export default App
