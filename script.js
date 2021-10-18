
((window)=> {

    let NO_OF_PLAYERS = 2; //initializing for dev
    let NO_OF_BOXES = 10;
    let LADDERS = {
        5: 75,
        20: 60
    };
    let SNAKES = {
        80: 10,
        40: 4 
    }
    let playerArr = [];
    let chance = 0;


    
    document.getElementById('startButton').addEventListener('click', (ref)=> {
        NO_OF_PLAYERS = +document.getElementById('numberOfPlayers').value;
        NO_OF_BOXES = +document.getElementById('numberOfBoxes').value;
        showBoard();
        for(let i = 0; i<NO_OF_PLAYERS; i++) {
            playerArr.push(new Player(`Player ${i+1}`))
        }
    });
    
    document.getElementById('Roll').addEventListener('click', (ref)=> {
       
        const rolledNumber = playerArr[chance].rollDice();
        chance = ((chance+1) % NO_OF_PLAYERS);
        document.getElementById('rolledNumber').innerHTML = rolledNumber;
        document.getElementById('whose-chance').innerHTML = `PLAYER ${chance+1}`;
    });

    hideBoard = () => {
        document.getElementById('board1').style.display = 'none';
        document.getElementById('footer').style.display = 'none';
    }
    
    hideBoard(); 
    
    showBoard = () => {
        document.getElementById('promptBox').style.display = 'none';
        document.getElementById('footer').style.display = 'flex';

        const boardRef = document.getElementById('board1');
        boardRef.style.display = 'grid';
        const grids = Array(NO_OF_BOXES).fill('auto').join(' ');
        boardRef.style.gridTemplateColumns = grids;
        boardRef.style.gridTemplateRows = grids;

        fillCells(boardRef);
        document.getElementById('whose-chance').innerHTML = `PLAYER 1`;
    }

    function fillCells(boardRef) {
        let ladderStartIndex = 1;
        let SnakeStartIndex = 1;
        let ladderEndIndex = {};
        let SnakeEndIndex = {};
        
        for(let i =0; i<(NO_OF_BOXES * NO_OF_BOXES); i++) {
            const newCell = document.createElement('div');
            newCell.classList.add('cell');
            newCell.id = `cell-${i}`;
            if (LADDERS[i]) {
                newCell.innerHTML = `L${ladderStartIndex}`
                ladderEndIndex[`${LADDERS[i]}`] = `L${ladderStartIndex}`
                ladderStartIndex++;
            }
            if (SNAKES[i]) {
                newCell.innerHTML = `S${SnakeStartIndex}`;
                SnakeEndIndex[`${SNAKES[i]}`] = `S${SnakeStartIndex}`;
                SnakeStartIndex++;
            }
            if (ladderEndIndex[i]) {
                newCell.innerHTML = ladderEndIndex[i];
            }
            boardRef.append(newCell);
        }
        for (let itemIndex in SnakeEndIndex) {
            document.getElementById(`cell-${itemIndex}`).innerHTML = SnakeEndIndex[itemIndex];
        }
    }


    class Player {
        constructor(name, position = -1) {
            this.name = name;
            this.position = position;
            this.createSymbol();
        }

        createSymbol() {
            this.symbol = document.createElement('div');
            this.symbol.classList.add('totem');
            this.symbol.style.height = '10px';
            this.symbol.style.width = '10px';
            this.symbol.style.marginRight = '2px';
            this.symbol.style.backgroundColor = this.getRandomColor();
            document.getElementById('waitingRoom').append(this.symbol);
        }

        removeFromWaitingRoom() {
            document.getElementById('waitingRoom').removeChild(this.symbol);
        }
        
        rollDice() {
            const randomNumber = Math.floor(Math.random() * 6)+1;

            if (this.position === -1 && randomNumber !== 6) {
                return randomNumber;
            }
            if (this.position === -1) {
                this.removeFromWaitingRoom();
                this.position = 0;
                this.placeInNewPosition(this.position);
                return randomNumber;
            }
            const possiblePosition = this.position + randomNumber;

            if(possiblePosition > NO_OF_BOXES*NO_OF_BOXES) {
                return randomNumber;
            } else if (possiblePosition === NO_OF_BOXES*NO_OF_BOXES) {
                alert(`GAME WON BY ${this.name}`);
            } else if (SNAKES[possiblePosition]) {
                this.removeFromCurrentPosition(this.position);
                this.position = SNAKES[possiblePosition];
                this.placeInNewPosition(this.position);
            } else if (LADDERS[possiblePosition]) {
                this.removeFromCurrentPosition(this.position);
                this.position = LADDERS[possiblePosition];
                this.placeInNewPosition(this.position);
            }
            
            
            this.position += randomNumber;
            this.placeInNewPosition(this.position);
            return randomNumber;
        }

        removeFromCurrentPosition(pos) {
            document.getElementById(`cell-${pos}`).innerHTML = '';
        }
        placeInNewPosition(pos) {
            document.getElementById(`cell-${pos}`).append(this.symbol);
        }

        getRandomColor() {
            var letters = '0123456789ABCDEF';
            var color = '#';
            for (var i = 0; i < 6; i++) {
              color += letters[Math.floor(Math.random() * 16)];
            }
            return color;
          }
          
    }

    
})(window);
