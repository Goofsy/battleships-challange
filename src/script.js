const board = document.querySelector('.board');
const info = document.querySelector('.info');

const columns = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j'];
const rows = [1, 2, 3, 4, 5, 6, 7, 8, 9];
const emptyFields = [];
const filledFields = [];
let shipsLength = 0;

const ships = [
  {
    id: 0,
    type: 'battleShip',
    length: 5,
  },
  {
    id: 1,
    type: 'destroyer',
    length: 4,
  },
  {
    id: 2,
    type: 'destroyer',
    length: 4,
  },
];

const fillBoard = () => {
  for (i = 0; i < columns.length * rows.length; i++) {
    const field = document.createElement('div');
    const iString = i.toString();
    const y = i >= columns.length ? +iString[0] + 1 : 1;
    const x = i >= columns.length ? columns[+iString[1]] : columns[+iString[0]];
    const id = x + y;
    field.id = id;
    field.classList.add('field');
    emptyFields.push(id);
    board.appendChild(field);
  }
};
fillBoard();

const renderShips = (coords, id) => {
  const randomFields = Math.floor(Math.random() * coords.length);
  const fields = coords[randomFields];
  fields.forEach(field => {
    const indexOfField = emptyFields.indexOf(field);
    emptyFields.splice(indexOfField, 1);
    filledFields.push(field);
    const fieldEl = document.getElementById(field);
    fieldEl.dataset.shipId = id;
    fieldEl.classList.add('statek');
  });
};

const reGenerateShips = () => {
  const fields = document.querySelectorAll('.field');
  fields.forEach(field => {
    delete field.dataset.shipId;
    field.classList.remove('statek');
    field.classList.remove('miss');
    field.classList.remove('hit');
  });
  shipsLength = 0;
  generateRandomShips();
};

const checkPossibleShipsPositions = (x, y, positions) => {
  return positions.map(pos => {
    if (filledFields.includes(pos) || filledFields.includes(x + y)) {
      return false;
    } else return pos;
  });
};

const validateShips = (x, y, shipLength, i) => {
  const indexOfColumn = columns.indexOf(x);
  const indexOfRow = +y - 1;
  const incX = [columns[indexOfColumn + i], y].join('');
  const incY = [x, rows[indexOfRow + i]].join('');
  const decX = [columns[indexOfColumn - i], y].join('');
  const decY = [x, rows[indexOfRow - i]].join('');

  if (
    // prettier-ignore
    (indexOfColumn + shipLength < columns.length &&
    indexOfRow + shipLength < columns.length) &&
    (indexOfColumn - shipLength >= 0 &&
    indexOfRow - shipLength >= 0)
  ) {
    return (positionsOfShip = checkPossibleShipsPositions(x, y, [
      incX,
      incY,
      decX,
      decY,
    ]));
  } else if (
    indexOfColumn - shipLength < 0 &&
    indexOfRow + shipLength >= columns.length
  ) {
    return (positionsOfShip = checkPossibleShipsPositions(x, y, [incX, decY]));
  } else if (
    indexOfColumn + shipLength >= columns.length &&
    indexOfRow - shipLength < 0
  ) {
    return (positionsOfShip = checkPossibleShipsPositions(x, y, [decX, incY]));
  } else if (
    indexOfColumn + shipLength >= columns.length &&
    indexOfRow + shipLength >= columns.length
  ) {
    return (positionsOfShip = checkPossibleShipsPositions(x, y, [decX, decY]));
  } else if (indexOfColumn - shipLength < 0 && indexOfRow - shipLength < 0) {
    return (positionsOfShip = checkPossibleShipsPositions(x, y, [incX, incY]));
  } else if (indexOfColumn + shipLength >= columns.length) {
    return (positionsOfShip = checkPossibleShipsPositions(x, y, [
      decY,
      incY,
      decX,
    ]));
  } else if (indexOfColumn - shipLength < 0) {
    return (positionsOfShip = checkPossibleShipsPositions(x, y, [
      decY,
      incY,
      incX,
    ]));
  } else if (indexOfRow + shipLength >= columns.length) {
    return (positionsOfShip = checkPossibleShipsPositions(x, y, [
      decY,
      incX,
      decX,
    ]));
  } else if (indexOfRow - shipLength < 0) {
    return (positionsOfShip = checkPossibleShipsPositions(x, y, [
      incY,
      incX,
      decX,
    ]));
  }
};

const generateRandomShips = () => {
  ships.forEach(ship => {
    const randomField = Math.floor(Math.random() * emptyFields.length);
    const [x, ...yArr] = emptyFields[randomField];
    const y = yArr.join('');
    shipsLength += ship.length;

    const positionsOfShip = [];

    for (let i = 0; i < ship.length; i++) {
      positionsOfShip.push(validateShips(x, y, ship.length, i));
    }

    const allPossiblePositions = [];
    for (let i = 0; i < positionsOfShip[0].length; i++) {
      const arr = [];
      positionsOfShip.forEach(shiped => {
        arr.push(shiped[i]);
      });
      allPossiblePositions.push(arr);
    }
    const correctPositions = allPossiblePositions.filter(
      ship => !ship.includes(false)
    );
    if (correctPositions.length === 0) {
      reGenerateShips();
    } else {
      renderShips(correctPositions, ship.id);
    }
  });
};
generateRandomShips();

const shoot = () => {
  board.addEventListener('click', e => {
    if (
      !e.target.id ||
      e.target.classList.contains('miss') ||
      e.target.classList.contains('hit') ||
      shipsLength === 0
    )
      return;
    if (e.target.classList.contains('statek')) {
      const ship = ships[e.target.dataset.shipId];
      ship.length -= 1;
      shipsLength -= 1;
      e.target.classList.add('hit');
      info.textContent = 'Hit!';
      if (ship.length === 0) {
        info.textContent = 'Sunk!';
      }
      if (shipsLength === 0) {
        info.textContent = 'You won!';
      }
    } else {
      e.target.classList.add('miss');
      info.textContent = 'Miss!';
    }
  });
};
shoot();
