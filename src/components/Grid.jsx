import React, { useState, useEffect, useRef, useCallback } from 'react';

const GRID_SIZE = 50;
const MIN_VIEWPORT_SIZE = 5;
const MAX_VIEWPORT_SIZE = 31;
const INITIAL_VIEWPORT_SIZE = 11;
const PLAYER_COLOR = "#ff0000";
const OBSTACLE_COLOR = "#000000";
const EMPTY_COLOR = "#ffffff";
const MOVE_DELAY = 300; // milliseconds between moves
const VIEWPORT_PIXEL_SIZE = 300; // Fixed pixel size for the viewport

const createGrid = (size) => {
  const grid = [];
  for (let i = 0; i < size; i++) {
    const row = [];
    for (let j = 0; j < size; j++) {
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
  const [grid, setGrid] = useState(createGrid(GRID_SIZE));
  const [playerPos, setPlayerPos] = useState([0, 0]);
  const [viewportOffset, setViewportOffset] = useState([0, 0]);
  const [path, setPath] = useState([]);
  const [viewportSize, setViewportSize] = useState(INITIAL_VIEWPORT_SIZE);
  const moveIntervalRef = useRef(null);
  const gridRef = useRef(null);
  const isPanningRef = useRef(false);
  const lastPanPosRef = useRef(null);
  const requestRef = useRef();
  const previousTimeRef = useRef();

  useEffect(() => {
    const newGrid = createGrid(GRID_SIZE);
    newGrid[0][0] = 0; // Ensure starting position is empty
    setGrid(newGrid);
  }, []);

  const updateViewportOffset = useCallback((newOffset) => {
    setViewportOffset((prevOffset) => {
      const clampedX = Math.max(0, Math.min(GRID_SIZE - viewportSize, newOffset[0]));
      const clampedY = Math.max(0, Math.min(GRID_SIZE - viewportSize, newOffset[1]));
      return [clampedX, clampedY];
    });
  }, [viewportSize]);

  const animatePan = useCallback((time) => {
    if (previousTimeRef.current !== undefined) {
      const deltaTime = time - previousTimeRef.current;
      if (isPanningRef.current && lastPanPosRef.current) {
        const currentPos = lastPanPosRef.current;
        const dx = currentPos.targetX - currentPos.x;
        const dy = currentPos.targetY - currentPos.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        const speed = 0.5; // Adjust this value to change pan speed
        const movement = Math.min(distance, speed * deltaTime);
        const angle = Math.atan2(dy, dx);
        const newX = currentPos.x + Math.cos(angle) * movement;
        const newY = currentPos.y + Math.sin(angle) * movement;

        lastPanPosRef.current = { x: newX, y: newY, targetX: currentPos.targetX, targetY: currentPos.targetY };

        const tileSize = VIEWPORT_PIXEL_SIZE / viewportSize;
        const offsetX = viewportOffset[0] - (newX - currentPos.x) / tileSize;
        const offsetY = viewportOffset[1] - (newY - currentPos.y) / tileSize;
        updateViewportOffset([offsetX, offsetY]);
      }
    }
    previousTimeRef.current = time;
    requestRef.current = requestAnimationFrame(animatePan);
  }, [viewportSize, updateViewportOffset, viewportOffset]);

  useEffect(() => {
    requestRef.current = requestAnimationFrame(animatePan);
    return () => cancelAnimationFrame(requestRef.current);
  }, [animatePan]);

  useEffect(() => {
    const handleWheel = (e) => {
      e.preventDefault();
      const zoomDirection = e.deltaY > 0 ? 2 : -2; // Zoom by 2 steps at a time
      setViewportSize((prevSize) => {
        const newSize = Math.max(MIN_VIEWPORT_SIZE, Math.min(MAX_VIEWPORT_SIZE, prevSize + zoomDirection));
        updateViewport(playerPos[0], playerPos[1], newSize);
        return newSize;
      });
    };

    const handleMouseDown = (e) => {
      if (e.button === 1) { // Middle mouse button
        e.preventDefault();
        isPanningRef.current = true;
        lastPanPosRef.current = { x: e.clientX, y: e.clientY, targetX: e.clientX, targetY: e.clientY };
      }
    };

    const handleMouseMove = (e) => {
      if (isPanningRef.current) {
        lastPanPosRef.current.targetX = e.clientX;
        lastPanPosRef.current.targetY = e.clientY;
      }
    };

    const handleMouseUp = () => {
      isPanningRef.current = false;
    };

    const handleKeyDown = (e) => {
      if (e.code === 'Space') {
        e.preventDefault();
        updateViewport(playerPos[0], playerPos[1]);
      }
    };

    const gridElement = gridRef.current;
    if (gridElement) {
      gridElement.addEventListener('wheel', handleWheel, { passive: false });
      gridElement.addEventListener('mousedown', handleMouseDown);
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
      window.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      if (gridElement) {
        gridElement.removeEventListener('wheel', handleWheel);
        gridElement.removeEventListener('mousedown', handleMouseDown);
      }
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [playerPos, viewportSize, updateViewportOffset]);

  const movePlayer = (newPath) => {
    // Clear any existing movement
    if (moveIntervalRef.current) {
      clearInterval(moveIntervalRef.current);
    }

    setPath(newPath);

    let i = 1; // Start from 1 to skip the current position
    moveIntervalRef.current = setInterval(() => {
      if (i < newPath.length) {
        const [newX, newY] = newPath[i];
        setPlayerPos([newX, newY]);
        updateViewport(newX, newY);
        i++;
      } else {
        clearInterval(moveIntervalRef.current);
        moveIntervalRef.current = null;
        setPath([]);
      }
    }, MOVE_DELAY);
  };

  const updateViewport = (playerX, playerY, size = viewportSize) => {
    const halfSize = Math.floor(size / 2);
    const centerSize = Math.max(1, Math.floor(size / 3)); // Adjust center size based on viewport size
    const centerHalfSize = Math.floor(centerSize / 2);

    let [offsetX, offsetY] = viewportOffset;

    // Check if player is outside the center area
    if (playerX < offsetX + halfSize - centerHalfSize) {
      offsetX = Math.max(0, playerX - (halfSize - centerHalfSize));
    } else if (playerX > offsetX + halfSize + centerHalfSize) {
      offsetX = Math.min(GRID_SIZE - size, playerX - (halfSize + centerHalfSize));
    }

    if (playerY < offsetY + halfSize - centerHalfSize) {
      offsetY = Math.max(0, playerY - (halfSize - centerHalfSize));
    } else if (playerY > offsetY + halfSize + centerHalfSize) {
      offsetY = Math.min(GRID_SIZE - size, playerY - (halfSize + centerHalfSize));
    }

    setViewportOffset([offsetX, offsetY]);
  };

  const handleTileClick = (x, y) => {
    const globalX = Math.floor(x + viewportOffset[0]);
    const globalY = Math.floor(y + viewportOffset[1]);
    
    // Ensure we're within grid bounds
    if (globalX < 0 || globalX >= GRID_SIZE || globalY < 0 || globalY >= GRID_SIZE) {
      return; // Click is out of bounds, do nothing
    }
    
    if (grid[globalY][globalX] === 1) return; // Can't move to obstacles

    const newPath = findPath(playerPos, [globalX, globalY], grid);
    if (newPath) {
      movePlayer(newPath);
    }
  };

  const renderViewport = () => {
    const viewport = [];
    const tileSize = VIEWPORT_PIXEL_SIZE / viewportSize;
    for (let y = 0; y < viewportSize; y++) {
      for (let x = 0; x < viewportSize; x++) {
        const globalX = Math.floor(viewportOffset[0]) + x;
        const globalY = Math.floor(viewportOffset[1]) + y;
        
        // Check if the tile is within the grid bounds
        if (globalX >= 0 && globalX < GRID_SIZE && globalY >= 0 && globalY < GRID_SIZE) {
          const isPlayer = playerPos[0] === globalX && playerPos[1] === globalY;
          const isPathTile = path.some(([px, py]) => px === globalX && py === globalY);
          viewport.push(
            <div
              key={`${globalX}-${globalY}`}
              style={{
                width: `${tileSize}px`,
                height: `${tileSize}px`,
                backgroundColor: grid[globalY][globalX] === 1 ? OBSTACLE_COLOR : isPlayer ? PLAYER_COLOR : EMPTY_COLOR,
                border: isPathTile ? '2px solid #0000ff' : '0px solid #000000',
                boxSizing: 'border-box',
              }}
              onClick={() => handleTileClick(x, y)}
              className="cursor-pointer"
            />
          );
        } else {
          // Render an empty tile for out-of-bounds positions
          viewport.push(
            <div
              key={`${globalX}-${globalY}`}
              style={{
                width: `${tileSize}px`,
                height: `${tileSize}px`,
                backgroundColor: '#000',
                border: '1px solid #000000',
                boxSizing: 'border-box',
              }}
            />
          );
        }
      }
    }
    return viewport;
  };

  return (
    <div
      ref={gridRef}
      style={{ 
        display: 'grid',
        gridTemplateColumns: `repeat(${viewportSize}, ${VIEWPORT_PIXEL_SIZE / viewportSize}px)`,
        gridTemplateRows: `repeat(${viewportSize}, ${VIEWPORT_PIXEL_SIZE / viewportSize}px)`,
        width: `${VIEWPORT_PIXEL_SIZE}px`,
        height: `${VIEWPORT_PIXEL_SIZE}px`,
        overflow: 'hidden',
      }}
    >
      {renderViewport()}
    </div>
  );
};

export default Grid;