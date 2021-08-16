const topEdge = [19, 20, 21, 22, 23, 24, 25, 26, 27];
const bottomEdge = [46, 47, 48, 49, 50, 51, 52, 53, 54];
let availableHorizontalNumbers = [1, 2, 3, 4, 5, 6, 7, 8, 9];
const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9];
const squareGroups = [[1, 2, 3, 10, 11, 12, 19, 20, 21],
                     [4, 5, 6, 13, 14, 15, 22, 23, 24],
                     [7, 8, 9, 16, 17, 18, 25, 26, 27],
                     [28, 29, 30, 37, 38, 39, 46, 47, 48],
                     [31, 32, 33, 40, 41, 42, 49, 50, 51],
                     [34, 35, 36, 43, 44, 45, 52, 53, 54],
                     [55, 56, 57, 64, 65, 66, 73, 74, 75],
                     [58, 59, 60, 67, 68, 69, 76, 77, 78],
                     [61, 62, 63, 70, 71, 72, 79, 80, 81]];
let numberSelected;
// difficulty
const squareGroupsToRemove = 20;

setTimeout(createBoard = () => {
    const gridArea = document.getElementById('gridArea');
    // Create game grid
    for (i = 1; i <= 81; i++) {
        // Add class, id, and click event to each square
        const newDiv = document.createElement('div');
        newDiv.className = 'square';
        newDiv.id = i;

        if (i % 3 === 0 && i % 9 !== 0) {
            newDiv.style.borderRight = '4px solid #000';
        }

        if (topEdge.indexOf(i) > -1 || bottomEdge.indexOf(i) > -1) {
            newDiv.style.borderBottom = '4px solid #000';
        }

        // retrieve number to display on board
        const selectedNumber = getNumber(i);

        if (selectedNumber !== undefined) {
            newDiv.innerHTML = selectedNumber;
        } else {
            // clear out old grid
            while (gridArea.hasChildNodes()) {
                gridArea.removeChild(gridArea.firstChild);
            }
            // try again to get a valid board (not sure how to avoid this situation)
            createBoard();
            return;
        }
            
        gridArea.appendChild(newDiv);

        // board is complete, remove random squares for game.
        if (i === 81) {
            removeSquares();
        }
    };
}, 0);

// event for click event to populate selected number in square
fillInNumber = (e) => {
    if (numberSelected === 'X') {
        e.target.innerHTML = '';
    } else if (numberSelected) {
        e.target.innerHTML = numberSelected;
        e.target.style.color = '#4c80f3';
    }
    const squareId = +e.target.id;
    // highlight any invalid rows/columns/squares
    checkProgress(squareId);
}

checkProgress = (squareId) => {
    // test if horizontal numbers are valid
    testHorizontal(squareId);
    // test if vertical numbers are valid
    testVertical(squareId);
    // test if square groups are valid
    testSquareGroups(squareId);
    // check if board is complete and valid
    checkWinCondition();
}

testHorizontal = (squareId) => {
    let usedNumbers = [];
    let testLeftRight = (squareId, duplicate) => {
        for (i = 0; i < 9; i++) {
            // check if square is along the right edge
            if (document.getElementById(squareId + i).id % 9 === 0) {
                const rightEdgeId = squareId + i;
                // go back to the previous 8 squares and check all numbers used
                for (i = 0; i < 9; i++) {
                    if (duplicate) {
                        document.getElementById(rightEdgeId - i).classList.add('horizontalDuplicate');
                    } else {
                        document.getElementById(rightEdgeId - i).classList.remove('horizontalDuplicate');
                    }
                }
            }
        }
    }

    for (i = 0; i < 9; i++) {
        // check if square is along the right edge
        if (document.getElementById(squareId + i).id % 9 === 0) {
            const rightEdgeId = squareId + i;
            // go back to the previous 8 squares and check all numbers used
            for (i = 0; i < 9; i++) {
                if (document.getElementById(rightEdgeId - i).innerHTML !== '') {
                    usedNumbers.push(document.getElementById(rightEdgeId - i).innerHTML);
                }
            }
        }
    }

    // check for any duplicate numbers
    if (new Set(usedNumbers).size !== usedNumbers.length) {
        document.getElementById(squareId).classList.add('horizontalDuplicate');
        testLeftRight(squareId, true);
    } else {
        document.getElementById(squareId).classList.remove('horizontalDuplicate');
        testLeftRight(squareId, false);
    }
}

testVertical = (squareId) => {
    let usedNumbers = [];
    const activeSquare = document.getElementById(squareId);
    let testAboveBelow = (squareId, duplicate) => {
        for (y = 9; y <= 72; y += 9) {
            if (document.getElementById(squareId + y)) {
                if (duplicate) {
                    document.getElementById(squareId + y).classList.add('verticalDuplicate');
                } else {
                    document.getElementById(squareId + y).classList.remove('verticalDuplicate');
                }
            }
    
            if (document.getElementById(squareId - y)) {
                if (duplicate) {
                    document.getElementById(squareId - y).classList.add('verticalDuplicate');
                } else {
                    document.getElementById(squareId - y).classList.remove('verticalDuplicate');
                }
            }
        }
    }

    if (activeSquare.innerHTML !== '') {
        usedNumbers.push(activeSquare.innerHTML);
    }
    
    // check all possible squares above and below current square
    for (y = 9; y <= 72; y += 9) {
        if (document.getElementById(squareId + y) && document.getElementById(squareId + y).innerHTML !== '') {
            usedNumbers.push(document.getElementById(squareId + y).innerHTML);
        }

        if (document.getElementById(squareId - y) && document.getElementById(squareId - y).innerHTML !== '') {
            usedNumbers.push(document.getElementById(squareId - y).innerHTML);
        }
    }

    // check for any duplicate numbers
    if (new Set(usedNumbers).size !== usedNumbers.length) {
        activeSquare.classList.add('verticalDuplicate');
        testAboveBelow(squareId, true);
    } else {
        activeSquare.classList.remove('verticalDuplicate');
        testAboveBelow(squareId, false);
    }
}

testSquareGroups = (squareId) => {
    let usedNumbers = [];
    let testAboveBelow = (squareId, duplicate) => {
        squareGroups.forEach((group) => {
            if (group.indexOf(squareId) > -1) {
                group.forEach((square) => {
                    if (duplicate) {
                        document.getElementById(square).classList.add('squareGroupDuplicate');
                    } else {
                        document.getElementById(square).classList.remove('squareGroupDuplicate');
                    }
                })
            }
        })
    }

    squareGroups.forEach((group) => {
        if (group.indexOf(squareId) > -1) {
            group.forEach((square) => {
                if (document.getElementById(square).innerHTML !== '') {
                    usedNumbers.push(document.getElementById(square).innerHTML);
                }
            })
        }
    })
    
    // check for any duplicate numbers
    if (new Set(usedNumbers).size !== usedNumbers.length) {
        document.getElementById(squareId).classList.add('squareGroupDuplicate');
        testAboveBelow(squareId, true);
    } else {
        document.getElementById(squareId).classList.remove('squareGroupDuplicate');
        testAboveBelow(squareId, false);
    }
}

checkWinCondition = () => {
    for (z = 1; z <= 81; z++) {
        // check all squares to see if they're filled in and don't have red background
        if (document.getElementById(z).innerHTML === '' || document.getElementById(z).style.backgroundColor === '#c36d6d') {
            return;
        }
    }
    
    // winner!
    document.getElementById('winMessage').style.display = 'block';
    // remove click events
    for (i = 1; i <= 81; i++) {
        document.getElementById(i).removeEventListener('mousedown', fillInNumber);
        document.getElementById(i).style.cursor = 'default';
    }
}

getNumber = (i) => {
    let newNumbers = checkHorizontal();
    let newNumbers2 = checkVertical(newNumbers, i);
    let newNumbers3 = checkSquare(newNumbers2, i);

    // pick random number from array of available numbers
    const numberIndex = Math.floor(Math.random() * newNumbers3.length);
    selectedNumber = newNumbers3[numberIndex];
    let horizontalIndex = availableHorizontalNumbers.indexOf(selectedNumber);

    // remove random number chosen from list of available horizontal numbers
    availableHorizontalNumbers.splice(horizontalIndex, 1);
    return selectedNumber;
}

checkHorizontal = () => {
    // when all 9 numbers used, reset list of available numbers (new row)
    if (availableHorizontalNumbers.length === 0) {
        availableHorizontalNumbers = [1, 2, 3, 4, 5, 6, 7, 8, 9];
    }

    return availableHorizontalNumbers;
}

checkVertical = (newNumbers, i) => {
    // there will never be duplicate vertical numbers when only 1 row (first 9 numbers)
    if (i > 9) {
        let availableVerticalNumbers = [1, 2, 3, 4, 5, 6, 7, 8, 9];
        for (x = 9; x <= 72; x += 9) {
            let existingNumber = document.getElementById(i - x) ? document.getElementById(i - x).innerHTML : -1;
            // check all squares above current square to see which numbers were already used
            let numberIndex = availableVerticalNumbers.indexOf(+existingNumber);
            if (numberIndex > -1) {
                availableVerticalNumbers.splice(numberIndex, 1);
            }
        }

        // only return available numbers that were not already used horizontally or vertically yet
        let newNumbersChecked = newNumbers.filter(element => availableVerticalNumbers.includes(element));
        return newNumbersChecked;
    } else {
        return newNumbers;
    }
}

checkSquare = (newNumbers, i) => {
    // there will never be duplicates in square of numbers when only 1 row (first 9 numbers) since horizontal check already removed these.
    if (i > 9) {
        let availableSquareNumbers = [1, 2, 3, 4, 5, 6, 7, 8, 9];

        // check all 9 groups of 9 squares to see which numbers were already used
        squareGroups.forEach((group) => {
            if (group.indexOf(i) > -1) {
                group.forEach((square) => {
                    let existingNumber = document.getElementById(square) ? document.getElementById(square).innerHTML: -1;
                    let numberIndex = availableSquareNumbers.indexOf(+existingNumber);
                    if (numberIndex > -1) {
                        availableSquareNumbers.splice(numberIndex, 1);
                    }
                })
            }
        })

        // return only numbers not already filtered out by horizontal/vertical check that also pass square check
        let newNumbersChecked = newNumbers.filter(element => availableSquareNumbers.includes(element));
        return newNumbersChecked;
    } else {
        return newNumbers;
    }
}

removeSquares = () => {
    // list of squares to not be randomly removed
    let unavailableSquares = [];
    // remove x sets of numbers
    for (x = 1; x <= squareGroupsToRemove; x++) {
        const randomSquare = Math.floor(Math.random() * 81) + 1;
        const randomSquareElement = document.getElementById(randomSquare);
        // only remove a number once
        if (unavailableSquares.indexOf(randomSquare) === -1) {
            randomSquareElement.innerHTML = '';
            // add click event
            randomSquareElement.addEventListener('mousedown', fillInNumber);
            randomSquareElement.style.cursor = 'pointer';
            unavailableSquares.push(randomSquare);
            // no counterpart to center square
            if (randomSquare !== 41) {
                const counterPartSquare = (81 - randomSquare) + 1;
                const counterPartSquareElement = document.getElementById(counterPartSquare);
                unavailableSquares.push(counterPartSquare);
                counterPartSquareElement.innerHTML = '';
                // add click event
                counterPartSquareElement.addEventListener('mousedown', fillInNumber);
                counterPartSquareElement.style.cursor = 'pointer';
            }
        } else {
            // run loop 1 more time if random number was already removed
            x--;
        }
    }
}

// set selected number and circle the number on UI
selectNumber = (event) => {
    let siblings = event.target.parentNode.children;
    for (let sibling of siblings) {
        sibling.classList.remove('selected');
    }
    event.target.classList.add('selected');
    numberSelected = event.target.innerHTML;
}