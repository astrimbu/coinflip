import React, { useState, useEffect, useRef } from 'react';

const GRID_SIZE = 10;
const PLAYER_COLOR = "#ff0000";
const OBSTACLE_COLOR = "#000000";
const EMPTY_COLOR = "#ffffff";
const MOVE_DELAY = 600; // milliseconds between moves

const createGrid = () => {
  const grid = [];
  for (let i = 0; i < GRID_SIZE; i++) {
    const row = [];
    for (let j = 0; j < GRID_SIZE; j++) {
      row.push(Math.random() < 0.2 ? 1 : 0); // 20% chance of obstacle
    }
    grid.push(row);
  }
  return grid;
};

const findPath = (start, end, grid) => {
  const queue = [[start]];
  const visited = new Set();

  while (queue.length > 0) {
    const path = queue.shift();
    const [x, y] = path[path.length - 1];

    if (x === end[0] && y === end[1]) {
      return path;
    }

    const directions = [
      [-1, 0], [1, 0], [0, -1], [0, 1],
      [-1, -1], [-1, 1], [1, -1], [1, 1] // Diagonal movements
    ];
    for (const [dx, dy] of directions) {
      const newX = x + dx;
      const newY = y + dy;
      const key = `${newX},${newY}`;

      if (
        newX >= 0 && newX < GRID_SIZE &&
        newY >= 0 && newY < GRID_SIZE &&
        grid[newY][newX] === 0 &&
        !visited.has(key)
      ) {
        visited.add(key);
        queue.push([...path, [newX, newY]]);
      }
    }
  }

  return null; // No path found
};

const Grid = () => {
  const [grid, setGrid] = useState(createGrid());
  const [playerPos, setPlayerPos] = useState([0, 0]);
  const [path, setPath] = useState([]);
  const moveIntervalRef = useRef(null);

  useEffect(() => {
    const newGrid = createGrid();
    newGrid[0][0] = 0; // Ensure starting position is empty
    setGrid(newGrid);
  }, []);

  const movePlayer = (newPath) => {
    // Clear any existing movement
    if (moveIntervalRef.current) {
      clearInterval(moveIntervalRef.current);
    }

    setPath(newPath);

    let i = 1; // Start from 1 to skip the current position
    moveIntervalRef.current = setInterval(() => {
      if (i < newPath.length) {
        setPlayerPos(newPath[i]);
        i++;
      } else {
        clearInterval(moveIntervalRef.current);
        moveIntervalRef.current = null;
        setPath([]);
      }
    }, MOVE_DELAY);
  };

  const handleTileClick = (x, y) => {
    if (grid[y][x] === 1) return; // Can't move to obstacles

    const newPath = findPath(playerPos, [x, y], grid);
    if (newPath) {
      movePlayer(newPath);
    }
  };

  return (
    <div style={{ 
      display: 'grid',
      gridTemplateColumns: `repeat(${GRID_SIZE}, 30px)`,
      gridTemplateRows: `repeat(${GRID_SIZE}, 30px)`
    }}>
      {grid.map((row, y) =>
          row.map((cell, x) => (
            <div
              key={`${x}-${y}`}
              style={{
                width: '30px',
                height: '30px',
                backgroundColor: cell === 1 ? OBSTACLE_COLOR : playerPos[0] === x && playerPos[1] === y ? PLAYER_COLOR : EMPTY_COLOR,
                border: path.some(([px, py]) => px === x && py === y) ? '2px solid #0000ff' : '1px solid #000000',
                boxSizing: 'border-box',
              }}
              onClick={() => handleTileClick(x, y)}
              className="cursor-pointer"
            />
          ))
        )}
    </div>
  );
};

export default Grid;