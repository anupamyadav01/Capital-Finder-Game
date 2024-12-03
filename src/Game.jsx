/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import _ from "lodash";

const Game = ({ data }) => {
  const [disabled, setDisabled] = useState(false);
  const [selectedItems, setSelectedItems] = useState([]);
  const [items, setItems] = useState([]);
  const [matchedItems, setMatchedItems] = useState([]);
  const [recentlyMatched, setRecentlyMatched] = useState([]);
  const [incorrectItems, setIncorrectItems] = useState([]);

  useEffect(() => {
    const allItems = Object.entries(data).flat();
    setItems(_.shuffle(allItems));
  }, [data]);

  const handleSelection = (e) => {
    if (disabled) return;

    const name = e.target.value;

    if (matchedItems.includes(name) || selectedItems.includes(name)) return;

    const newSelections = [...selectedItems, name];
    setSelectedItems(newSelections);

    if (newSelections.length === 2) {
      setDisabled(true);

      const [first, second] = newSelections;

      if (data[first] === second || data[second] === first) {
        setMatchedItems((prev) => [...prev, first, second]);
        setRecentlyMatched([first, second]);

        setTimeout(() => {
          setRecentlyMatched([]);
          setItems((prev) =>
            prev.filter((item) => item !== first && item !== second)
          );
          setSelectedItems([]);
          setDisabled(false);
        }, 1000);
      } else {
        setIncorrectItems(newSelections);
        setTimeout(() => {
          setIncorrectItems([]);
          setSelectedItems([]);
          setDisabled(false);
        }, 1000);
      }
    }
  };

  const resetGame = () => {
    const allItems = Object.entries(data).flat();
    setItems(_.shuffle(allItems));
    setSelectedItems([]);
    setMatchedItems([]);
    setRecentlyMatched([]);
    setIncorrectItems([]);
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-teal-400 via-blue-500 to-purple-600 flex flex-col items-center justify-center p-6">
      <h1 className="text-white text-5xl font-extrabold mb-6 animate-fade-in-down">
        Capital Finder Game
      </h1>
      <p className="text-gray-200 text-lg mb-10 animate-fade-in">
        Match countries with their capitals. Can you match them all?
      </p>

      <div className="flex gap-6 flex-wrap justify-center items-center max-w-4xl">
        {items.map((item) => {
          const isSelected = selectedItems.includes(item);
          const isMatched = matchedItems.includes(item);
          const isRecentlyMatched = recentlyMatched.includes(item);
          const isIncorrect = incorrectItems.includes(item);

          return (
            <button
              style={{
                backgroundColor: isIncorrect
                  ? "#FF5252"
                  : isRecentlyMatched
                  ? "#00C851"
                  : isSelected
                  ? "#007bff"
                  : "white",
                color:
                  isSelected || isRecentlyMatched || isIncorrect
                    ? "white"
                    : "#333",
                boxShadow: isRecentlyMatched
                  ? "0 0 15px 3px #00C851"
                  : "0 4px 6px rgba(0, 0, 0, 0.1)",
                transform:
                  isSelected || isIncorrect ? "scale(1.05)" : "scale(1)",
                transition: "all 0.3s ease",
                opacity: isMatched && !isRecentlyMatched ? 0 : 1, // Hide matched items after the delay
              }}
              onClick={handleSelection}
              className="px-6 py-3 text-lg font-semibold rounded-lg shadow-md border-2 border-gray-200 hover:border-gray-300 hover:scale-105 transform transition duration-200"
              key={item}
              value={item}
              disabled={isMatched}
            >
              {item}
            </button>
          );
        })}
      </div>

      {items.length === 0 && (
        <div className="mt-8 text-center animate-fade-in-up">
          <h1 className="text-4xl font-bold text-green-400">
            Congratulations!
          </h1>
          <p className="text-white text-xl mt-2">
            You have successfully matched all countries and capitals!
          </p>
          <button
            onClick={resetGame}
            className="border border-white bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white font-normal px-8 py-4 mt-6 text-xl rounded-full shadow-lg hover:shadow-xl hover:scale-105 transform transition duration-100 ease-in-out"
          >
            Play Again
          </button>
        </div>
      )}
    </div>
  );
};

export default Game;
