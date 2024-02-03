import { useState } from 'react';
import { useEffect } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import './App.css'
import crossimg from "./assets/cross.svg";
import circleimg from "./assets/circle.svg";
import { io } from 'socket.io-client';
const SERVER_URL = 'http://localhost:4000';

const socket = io.connect(SERVER_URL, {
  withCredentials: true,
  extraHeaders: {
    "my-custom-header": "abcd"
  }
}
);
function App() {

  console.log('socket', socket);

  socket.on("connect", () => {
    console.log(socket.id);
  });
  let [user1, setUser1] = useState({
    turn: true,
    symbol: "circle"
  })
  let [user2, setUser2] = useState({
    turn: false,
    symbol: "cross"
  });
  let [stop, setStop] = useState(Array(9).fill(false));
  let [circle, setCircle] = useState(Array(9).fill(false));
  let [cross, setCross] = useState(Array(9).fill(false));
  let [gameend, setGameend] = useState(true);

  let [winner1, setWinner1] = useState(false);
  let [winner2, setWinner2] = useState(false);
  let index = Array(9).fill(0);
  const printPage = () =>{
      window.print();
  }
  const TicTacHandler = (data) => {
    const prevCircle = [...circle];
    const prevCross = [...cross];
    const prevStop = [...stop];
    if (user1.turn == true && user2.turn == false) {
      setUser1((prev) => ({ ...prev, turn: false }));
      setUser2((prev) => ({ ...prev, turn: true }));
      prevCircle[data] = true;
      prevStop[data] = true;
      setCircle(prevCircle);
      setStop(prevStop);
      let player1_data = {
        msg: "player 1 has moved",
        index: data,
      }
      socket.emit("player1", player1_data);

    }
    if (user1.turn == false && user2.turn == true) {
      setUser1((prev) => ({ ...prev, turn: true }));
      setUser2((prev) => ({ ...prev, turn: false }));
      prevCross[data] = true;
      prevStop[data] = true;
      setCross(prevCross);
      setStop(prevStop);
      let player2_data = {
        msg: "player 2 has moved",
        index: data,
      }
      socket.emit("player2", player2_data);
    }
  }
  // useEffect(() => {
    socket.on("player1_data", (player1_data) => {
      // console.log(data);
      const prevCircle = [...circle];
      const prevCross = [...cross];
      const prevStop = [...stop];
      // toast.success(player1_data.msg);
      setUser1((prev) => ({ ...prev, turn: false }));
      setUser2((prev) => ({ ...prev, turn: true }));
      prevCircle[player1_data.index] = true;
      prevStop[player1_data.index] = true;
      setCircle(prevCircle);
      setStop(prevStop);
    });
    socket.on("player2_data", (player2_data) => {
      const prevCircle = [...circle];
      const prevCross = [...cross];
      const prevStop = [...stop];
      setUser1((prev) => ({ ...prev, turn: true }));
      setUser2((prev) => ({ ...prev, turn: false }));
      prevCross[player2_data.index] = true;
      prevStop[player2_data.index] = true;
      setCross(prevCross);
      setStop(prevStop);
      // console.log(data);
      // toast.success(player2_data.msg);
    })
  // }, []);

  function winnerPlayer() {
    document.getElementById('winner').showModal();
  }
  function Draw() {
    document.getElementById('draw').showModal();
  }
  if (((circle[0] && circle[4] && circle[8]) ||
    (circle[2] && circle[4] && circle[6]) ||
    (circle[1] && circle[4] && circle[7]) ||
    (circle[0] && circle[3] && circle[6]) ||
    (circle[2] && circle[5] && circle[8]) ||
    (circle[0] && circle[1] && circle[2]) ||
    (circle[3] && circle[4] && circle[5]) ||
    (circle[6] && circle[7] && circle[8])) && gameend) {
    winnerPlayer();
    setWinner1(true);
    setGameend(false);
  } else if (((cross[0] && cross[4] && cross[8]) ||
    (cross[2] && cross[4] && cross[6]) ||
    (cross[1] && cross[4] && cross[7]) ||
    (cross[0] && cross[3] && cross[6]) ||
    (cross[2] && cross[5] && cross[8]) ||
    (cross[0] && cross[1] && cross[2]) ||
    (cross[3] && cross[4] && cross[5]) ||
    (cross[6] && cross[7] && circle[8])) && gameend) {
    winnerPlayer();
    setWinner2(true);
    setGameend(false);
  } else {
    let count = 0;
    stop.map((item) => {
      if (item == true) count++;
    })
    if (count == 9 && gameend) {
      Draw();
      setWinner1(true);
      setWinner2(true);
      setGameend(false);
    }
  }

  const restartHandler = () => {
    setCircle(Array(9).fill(false));
    setCross(Array(9).fill(false));
    setStop(Array(9).fill(false));
    setUser1((prev) => ({ ...prev, turn: true }));
    setUser2((prev) => ({ ...prev, turn: false }));
    setGameend(true);
    setWinner1(false);
    setWinner2(false);
    socket.emit( )
  }
  return (
    <div className=' '>
      <h1 className=' text-xl text-center'>Tic Tac Toe Game</h1>
      <div className=' grid grid-cols-3 max-w-[500px] mx-auto mt-14'>
        {
          index.map((item, idx) => {
            return (

              <button onClick={() => { TicTacHandler(idx) }}
                disabled={stop[idx]}>
                {!circle[idx] && !cross[idx] ? <div className='w-32 h-16 bg-gray-300 my-2 mx-2'></div> : null}
                {circle[idx] && !cross[idx] ? <div className='my-2 mx-2 w-32 '> <img src={circleimg} className=' w-16 mx-auto ' /> </div> : null}
                {!circle[idx] && cross[idx] ? <div className='my-2 mx-2 w-32'> <img src={crossimg} className=' w-16 mx-auto ' /> </div> : null}
              </button>

            )
          })
        }
        <dialog id="winner" className="modal">
          <div className="modal-box">
            {
              winner1 && (
                <h2>player 1 is winner</h2>
              )
            }
            {
              winner2 && (
                <h2>player 2 is winner</h2>
              )
            }

            <form method="dialog">
              <button className="btn">Close</button>
            </form>
          </div>
        </dialog>
        <dialog id="draw" className="modal">
          <div className="modal-box">
            <h2>draw ho gya</h2>
            <form method="dialog">
              <button className="btn">Close</button>
            </form>
          </div>
        </dialog>
        {
          (winner1 || winner2) && (
            <button onClick={restartHandler} className=' px-2 py-2 bg-indigo-500 text-white text-center rounded-md'>
              Restart
            </button>
          )
        }
        
      </div>
      <button className=' px-4 py-2 bg-indigo-600 text-white rounded-md  ' 
      onClick={printPage}>Print</button>
      <Toaster />
    </div>
  )
}

export default App
