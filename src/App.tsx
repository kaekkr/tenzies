import { useState, useEffect } from "react";
import Confetti from "react-confetti";
import { nanoid } from "nanoid";

import "./App.css";
import Die from "./components/Die";

const App = () => {
  const generateNewDie = () => ({
    value: Math.floor(Math.random() * 6 + 1),
    isHeld: false,
    id: nanoid(),
  });

  const allNewDice = (): { value: number; isHeld: boolean; id: string }[] => {
    const dieNumbers: { value: number; isHeld: boolean; id: string }[] = [];
    for (let i = 0; i < 10; i++) {
      dieNumbers.push(generateNewDie());
    }

    return dieNumbers;
  };

  const [dice, setDice] = useState(allNewDice());
  const [tenzises, setTenzises] = useState(false);
  const [rolls, setRolls] = useState(0);
  const [time, setTime] = useState(0);
  const [running, setRunning] = useState(false);

  useEffect(() => {
    const checkValue: number = dice[0].value;
    const allHeld: boolean = dice.every((die) => die.isHeld);
    const allSameValue: boolean = dice.every((die) => die.value === checkValue);

    if (allHeld && allSameValue) {
      setTenzises(true);
      setRunning(false);
    }
  }, [dice]);

  useEffect(() => {
    let interval: number | undefined;
    if (running) {
      interval = setInterval(() => {
        setTime((prevTime) => prevTime + 10);
      }, 10);
    } else if (!running) {
      clearInterval(interval);
    }

    return () => clearInterval(interval);
  }, [running]);

  const handleClick = (): void => {
    if (tenzises) {
      setRolls(0);
      setDice(allNewDice());
      setTenzises(false);
      setTime(0);
    } else {
      setDice((oldDice) =>
        oldDice.map((die) => {
          return die.isHeld ? die : generateNewDie();
        })
      );
      setRolls((prevRoll) => prevRoll + 1);
      setRunning(true);
    }
  };

  const holdDice = (id: string): void => {
    setDice((oldDice) =>
      oldDice.map((die) =>
        die.id === id ? { ...die, isHeld: !die.isHeld } : die
      )
    );
    setRunning(true);
  };

  const diceElements = dice.map((die) => (
    <Die
      key={die.id}
      id={die.id}
      value={die.value}
      isHeld={die.isHeld}
      holdDice={holdDice}
    />
  ));

  return (
    <main className="bg-green-400 w-full h-screen flex items-center justify-center">
      {tenzises && <Confetti />}
      <div className="bg-white p-10 text-center space-y-8 flex flex-col justify-center items-center rounded-lg">
        <div className="flex flex-col justify-center items-center space-y-3 border border-green-400 rounded-lg py-2">
          <h1 className="text-3xl font-bold">Tenzies</h1>
          <h2 className="text-2xl">Number of rolls: {rolls}</h2>
          <p className="w-2/3 font-light">
            Roll until all dice are the same. Click each die to freeze it at its
            current value between rolls.
          </p>
        </div>
        <div className="border border-green-400 rounded-lg p-4 grid grid-rows-2 grid-cols-5 gap-y-4 gap-x-8">
          {diceElements}
        </div>
        <div className="text-xl border border-green-400 rounded-lg px-8 py-2 space-x-2">
          <span className="">
            {("0" + Math.floor((time / 1000) % 60)).slice(-2)} :
          </span>
          <span className="">{("0" + ((time / 10) % 100)).slice(-2)} s</span>
        </div>
        <button
          onClick={handleClick}
          className="border border-green-400 rounded-lg text-green-400 px-[100px] py-[8px] text-xl font-bold btn"
        >
          {tenzises ? "New game" : "Roll"}
        </button>
      </div>
    </main>
  );
};

export default App;
