const rows = 30,
    cols = 80;

let grid = new Array(rows);
let nextGrid = new Array(rows);
let playing = false;
let timer;

initialize = () => {
    initializeGrids();
    resetGrids();
    createBoard();
    initializeButtonsClickHandler();
}

initializeGrids = () => {
    for (let i = 0; i < rows; i++) {
        grid[i] = new Array(cols);
        nextGrid[i] = new Array(cols);
    }
}

resetGrids = () => {
    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
            grid[i][j] = 0;
            nextGrid[i][j] = 0;
        }
    }
}

copyAndResetGrid = () => {
    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
            grid[i][j] = nextGrid[i][j];
            nextGrid[i][j] = 0;
        }
    }
}

createBoard = () => {
    const gridBoard = document.querySelector('.grid');
    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
            let cell = document.createElement('div');
            cell.setAttribute('id', i + '_' + j);
            cell.classList.add('dead');
            // cell.innerHTML = i + '' + j;
            gridBoard.appendChild(cell);
            cell.addEventListener('click', (e) => {
                cellClicked(cell);
            })
        }
    }
}

updateView = () => {
    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
            let cell = document.getElementById(i + "_" + j);
            if (grid[i][j] === 0) {
                cell.classList.add("class", "dead");
                cell.classList.remove("class", "live");
            } else {
                cell.classList.add("class", "live");
                cell.classList.remove("class", "dead");
            }
        }
    }
}

cellClicked = (cell) => {
    const id = cell.id,
        row = parseInt(id.split('_')[0]),
        col = parseInt(id.split('_')[1]);
    console.log(`grid[${row}][${col}]`);
    if (cell.classList.contains('live')) {
        cell.classList.remove('live');
        cell.classList.add('dead');
        grid[row][col] = 0;
    } else {
        cell.classList.remove('dead');
        cell.classList.add('live');
        grid[row][col] = 1;
    }
}

initializeButtonsClickHandler = () => {
    document.querySelector('.start').addEventListener('click', startButtonClickHandler);
    document.querySelector('.clear').addEventListener('click', clearButtonClickHandler);
    const presets = document.querySelectorAll('.preset');
    presets.forEach(btn => btn.addEventListener('click', presetSelected));
}

presetSelected = (event) => {
    const selectedPreset = event.currentTarget.id;
    console.log(selectedPreset);
    resetGrids();
    fillPreset(selectedPreset);
    updateView();
}

play = () => {
    checkBoard();
    if (playing) {
        timer = setTimeout(play, 100);
    }
}

applyRuleOfLife = (row, col) => {
    const neighbourCount = getNeighbourCount(row, col);
    checkLifeStatus(row, col, neighbourCount);
}

getNeighbourCount = (row, col) => {
    const isLeftEdge = (col === 0);
    const isRightEdge = (col === cols - 1);
    // north
    let count = 0;
    if (row > 0) {
        if (grid[row - 1][col] === 1) count++;
    }
    // north-east
    if (row > 0 && !isRightEdge) {
        if (grid[row - 1][col + 1] === 1) count++;
    }
    // east
    if (!isRightEdge) {
        if (grid[row][col + 1] === 1) count++;
    }
    // south-east
    if (row + 1 < rows && !isRightEdge) {
        if (grid[row + 1][col + 1] === 1) count++;
    }
    // south
    if (row + 1 < rows) {
        if (grid[row + 1][col] === 1) count++;
    }
    // south-west
    if (row + 1 < rows && col - 1 >= 0 && !isLeftEdge) {
        if (grid[row + 1][col - 1] === 1) count++;
    }
    // west
    if (!isLeftEdge && col - 1 >= 0) {
        if (grid[row][col - 1] === 1) count++;
    }
    // north-west
    if (row > 0 && col - 1 >= 0 && !isLeftEdge) {
        if (grid[row - 1][col - 1] === 1) count++;
    }
    return count;
}

checkLifeStatus = (row, col, neighbourCount) => {
    switch (neighbourCount) {
        case 2:
            if (grid[row][col] === 1) {
                nextGrid[row][col] = 1;
            }
            break;
        case 3:
            nextGrid[row][col] = 1;
            break;
        case 0:
        case 1:
        case 4:
        case 5:
        case 6:
        case 7:
        case 8:
            nextGrid[row][col] = 0;
            break;
        default:
            break;
    }
}


checkBoard = () => {
    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
            applyRuleOfLife(i, j);
        }
    }
    copyAndResetGrid();
    updateView();

}

startButtonClickHandler = () => {
    if (playing) {
        console.log('Pausing the Game of Life');
        playing = false;
        document.querySelector('.start').textContent = 'Start';
        clearTimeout(timer);
    } else {
        // document.querySelector('.grid').scrollIntoView();
        console.log('Starting the Game of Life');
        playing = true;
        document.querySelector('.start').textContent = 'Pause';
        play();
    }
}
clearButtonClickHandler = () => {
    console.log('Resetting the Game of Life');
    document.querySelector('.start').textContent = 'Start';
    clearTimeout(timer);
    resetGrids();
    updateView();
}

fillPreset = (selectedPreset) => {
    switch (selectedPreset) {
        case 'preset-1':
            grid[8][19] = 1;
            grid[8][20] = 1;
            grid[8][21] = 1;
            grid[8][39] = 1;
            grid[8][40] = 1;
            grid[8][41] = 1;
            grid[8][59] = 1;
            grid[8][60] = 1;
            grid[8][61] = 1;

            grid[22][19] = 1;
            grid[22][20] = 1;
            grid[22][21] = 1;
            grid[22][39] = 1;
            grid[22][40] = 1;
            grid[22][41] = 1;
            grid[22][59] = 1;
            grid[22][60] = 1;
            grid[22][61] = 1;
            break;
        case 'preset-2':
            grid[10][27] = 1;
            grid[11][27] = 1;
            grid[12][27] = 1;
            grid[13][27] = 1;
            grid[14][27] = 1;
            grid[15][27] = 1;
            grid[16][27] = 1;
            grid[13][24] = 1;
            grid[13][25] = 1;
            grid[13][26] = 1;
            grid[13][27] = 1;
            grid[13][28] = 1;
            grid[13][29] = 1;
            grid[13][30] = 1;

            grid[10][57] = 1;
            grid[11][57] = 1;
            grid[12][57] = 1;
            grid[13][57] = 1;
            grid[14][57] = 1;
            grid[15][57] = 1;
            grid[16][57] = 1;
            grid[13][54] = 1;
            grid[13][55] = 1;
            grid[13][56] = 1;
            grid[13][57] = 1;
            grid[13][58] = 1;
            grid[13][59] = 1;
            grid[13][60] = 1;
            break;
        case 'preset-3':
            grid[7][14] = 1;
            grid[7][15] = 1;
            grid[8][14] = 1;
            grid[8][15] = 1;
            grid[9][16] = 1;
            grid[9][17] = 1;
            grid[10][16] = 1;
            grid[10][17] = 1;

            grid[20][14] = 1;
            grid[20][15] = 1;
            grid[21][14] = 1;
            grid[21][15] = 1;
            grid[22][16] = 1;
            grid[22][17] = 1;
            grid[23][16] = 1;
            grid[23][17] = 1;

            grid[7][14 + 46] = 1;
            grid[7][15 + 46] = 1;
            grid[8][14 + 46] = 1;
            grid[8][15 + 46] = 1;
            grid[9][16 + 46] = 1;
            grid[9][17 + 46] = 1;
            grid[10][16 + 46] = 1;
            grid[10][17 + 46] = 1;

            grid[20][14 + 46] = 1;
            grid[20][15 + 46] = 1;
            grid[21][14 + 46] = 1;
            grid[21][15 + 46] = 1;
            grid[22][16 + 46] = 1;
            grid[22][17 + 46] = 1;
            grid[23][16 + 46] = 1;
            grid[23][17 + 46] = 1;

            grid[11][41] = 1;
            grid[11][37] = 1;
            grid[11][35] = 1;
            grid[11][36] = 1;
            grid[11][42] = 1;
            grid[11][43] = 1;
            grid[13][38] = 1;
            grid[14][38] = 1;
            grid[15][38] = 1;
            grid[13][40] = 1;
            grid[14][40] = 1;
            grid[15][40] = 1;
            grid[16][37] = 1;
            grid[16][36] = 1;
            grid[16][35] = 1;
            grid[16][41] = 1;
            grid[16][42] = 1;
            grid[16][43] = 1;
            grid[15][33] = 1;
            grid[14][33] = 1;
            grid[13][33] = 1;
            grid[15][45] = 1;
            grid[13][45] = 1;
            grid[14][45] = 1;
            grid[18][35] = 1;
            grid[18][36] = 1;
            grid[18][37] = 1;
            grid[19][38] = 1;
            grid[20][38] = 1;
            grid[21][38] = 1;
            grid[23][37] = 1;
            grid[23][36] = 1;
            grid[23][35] = 1;
            grid[19][33] = 1;
            grid[20][33] = 1;
            grid[21][33] = 1;
            grid[19][40] = 1;
            grid[20][40] = 1;
            grid[21][40] = 1;
            grid[18][41] = 1;
            grid[18][42] = 1;
            grid[18][43] = 1;
            grid[23][41] = 1;
            grid[23][42] = 1;
            grid[23][43] = 1;
            grid[19][45] = 1;
            grid[20][45] = 1;
            grid[21][45] = 1;
            break;
        case 'preset-4':
            grid[12][21] = 1;
            grid[13][21] = 1;
            grid[14][21] = 1;
            grid[15][21] = 1;
            grid[16][21] = 1;
            grid[17][21] = 1;
            grid[12][33] = 1;
            grid[13][33] = 1;
            grid[14][33] = 1;
            grid[15][33] = 1;
            grid[16][33] = 1;
            grid[17][33] = 1;
            grid[12][46] = 1;
            grid[13][46] = 1;
            grid[14][46] = 1;
            grid[15][46] = 1;
            grid[16][46] = 1;
            grid[17][46] = 1;
            grid[12][61] = 1;
            grid[13][61] = 1;
            grid[14][61] = 1;
            grid[15][61] = 1;
            grid[16][61] = 1;
            grid[17][61] = 1;
            break;
        case 'preset-5':
            grid[28][2 + 9] = 1;
            grid[29][2 + 9] = 1;
            grid[27][2 + 9] = 1;
            grid[27][3 + 9] = 1;
            grid[27][4 + 9] = 1;
            grid[26][4 + 9] = 1;
            grid[25][4 + 9] = 1;
            grid[25][5 + 9] = 1;
            grid[25][6 + 9] = 1;
            grid[24][6 + 9] = 1;
            grid[23][6 + 9] = 1;
            grid[23][7 + 9] = 1;
            grid[23][8 + 9] = 1;
            grid[22][8 + 9] = 1;
            grid[21][8 + 9] = 1;
            grid[21][9 + 9] = 1;
            grid[21][10 + 9] = 1;
            grid[20][10 + 9] = 1;
            grid[19][10 + 9] = 1;
            grid[19][11 + 9] = 1;
            grid[19][12 + 9] = 1;
            grid[18][12 + 9] = 1;
            grid[17][12 + 9] = 1;
            grid[17][13 + 9] = 1;
            grid[17][14 + 9] = 1;
            grid[16][14 + 9] = 1;
            grid[15][14 + 9] = 1;
            grid[15][15 + 9] = 1;
            grid[15][16 + 9] = 1;
            grid[14][16 + 9] = 1;
            grid[13][16 + 9] = 1;
            grid[13][17 + 9] = 1;
            grid[13][18 + 9] = 1;
            grid[12][18 + 9] = 1;
            grid[11][18 + 9] = 1;
            grid[11][19 + 9] = 1;
            grid[11][20 + 9] = 1;
            grid[10][20 + 9] = 1;
            grid[9][20 + 9] = 1;
            grid[9][21 + 9] = 1;
            grid[9][22 + 9] = 1;
            grid[8][22 + 9] = 1;
            grid[7][22 + 9] = 1;
            grid[7][23 + 9] = 1;
            grid[7][24 + 9] = 1;
            grid[6][24 + 9] = 1;
            grid[5][24 + 9] = 1;
            grid[5][25 + 9] = 1;
            grid[5][26 + 9] = 1;
            grid[4][26 + 9] = 1;
            grid[3][26 + 9] = 1;
            grid[3][27 + 9] = 1;
            grid[3][28 + 9] = 1;
            grid[2][28 + 9] = 1;
            grid[1][28 + 9] = 1;
            grid[1][29 + 9] = 1;
            grid[1][30 + 9] = 1;
            grid[0][30 + 9] = 1;
            grid[0][32 + 9] = 1;
            grid[1][32 + 9] = 1;
            grid[1][33 + 9] = 1;
            grid[1][34 + 9] = 1;
            grid[2][34 + 9] = 1;
            grid[3][34 + 9] = 1;
            grid[3][35 + 9] = 1;
            grid[3][36 + 9] = 1;
            grid[4][36 + 9] = 1;
            grid[5][36 + 9] = 1;
            grid[5][37 + 9] = 1;
            grid[5][38 + 9] = 1;
            grid[6][38 + 9] = 1;
            grid[7][38 + 9] = 1;
            grid[7][39 + 9] = 1;
            grid[7][40 + 9] = 1;
            grid[8][40 + 9] = 1;
            grid[9][40 + 9] = 1;
            grid[9][41 + 9] = 1;
            grid[9][42 + 9] = 1;
            grid[10][42 + 9] = 1;
            grid[11][42 + 9] = 1;
            grid[11][43 + 9] = 1;
            grid[11][44 + 9] = 1;
            grid[12][44 + 9] = 1;
            grid[13][44 + 9] = 1;
            grid[13][45 + 9] = 1;
            grid[13][46 + 9] = 1;
            grid[14][46 + 9] = 1;
            grid[15][46 + 9] = 1;
            grid[15][47 + 9] = 1;
            grid[15][48 + 9] = 1;
            grid[16][48 + 9] = 1;
            grid[17][48 + 9] = 1;
            grid[17][49 + 9] = 1;
            grid[17][50 + 9] = 1;
            grid[18][50 + 9] = 1;
            grid[19][50 + 9] = 1;
            grid[19][51 + 9] = 1;
            grid[19][52 + 9] = 1;
            grid[20][52 + 9] = 1;
            grid[21][52 + 9] = 1;
            grid[21][53 + 9] = 1;
            grid[21][54 + 9] = 1;
            grid[22][54 + 9] = 1;
            grid[23][54 + 9] = 1;
            grid[23][55 + 9] = 1;
            grid[23][56 + 9] = 1;
            grid[24][56 + 9] = 1;
            grid[25][56 + 9] = 1;
            grid[25][57 + 9] = 1;
            grid[25][58 + 9] = 1;
            grid[26][58 + 9] = 1;
            grid[27][58 + 9] = 1;
            grid[27][59 + 9] = 1;
            grid[27][60 + 9] = 1;
            grid[28][60 + 9] = 1;
            grid[29][60 + 9] = 1;
            break;
        case 'preset-6':
            grid[5][38] = 1;
            grid[6][38] = 1;
            grid[7][39] = 1;
            grid[8][40] = 1;
            grid[9][41] = 1;
            grid[10][42] = 1;
            grid[11][43] = 1;
            grid[12][44] = 1;
            grid[13][44] = 1;
            grid[14][43] = 1;
            grid[15][42] = 1;
            grid[16][41] = 1;
            grid[17][40] = 1;
            grid[18][39] = 1;
            grid[19][39] = 1;
            grid[20][40] = 1;
            grid[21][41] = 1;
            grid[22][42] = 1;
            grid[23][43] = 1;
            grid[24][44] = 1;
            grid[25][44] = 1;
            grid[26][43] = 1;
            grid[27][42] = 1;
            grid[28][41] = 1;
            grid[29][40] = 1;
            grid[8][42] = 1;
            grid[7][43] = 1;
            grid[6][44] = 1;
            grid[5][44] = 1;
            grid[10][40] = 1;
            grid[11][39] = 1;
            grid[12][38] = 1;
            grid[13][38] = 1;
            grid[14][39] = 1;
            grid[15][40] = 1;
            grid[17][42] = 1;
            grid[18][43] = 1;
            grid[19][43] = 1;
            grid[20][42] = 1;
            grid[22][40] = 1;
            grid[23][39] = 1;
            grid[25][38] = 1;
            grid[29][40] = 1;
            grid[24][38] = 1;
            grid[26][39] = 1;
            grid[27][40] = 1;
            grid[29][42] = 1;
            grid[29][40] = 1;
            break;
        case 'preset-7':
            for (i=0; i<25; i+=6){
                grid[0][2+i] = 1;
                grid[1][2+i] = 1;
                grid[2][2+i] = 1;
                grid[2][1+i] = 1;
                grid[1][0+i] = 1;
                grid[27][0+i] = 1;
                grid[27][1+i] = 1;
                grid[27][2+i] = 1;
                grid[28][2+i] = 1;
                grid[29][1+i] = 1;
                grid[0][77-i] = 1;
                grid[1][77-i] = 1;
                grid[2][77-i] = 1;
                grid[2][78-i] = 1;
                grid[1][79-i] = 1;
                grid[27][79-i] = 1;
                grid[27][78-i] = 1;
                grid[27][77-i] = 1;
                grid[28][77-i] = 1;
                grid[29][78-i] = 1;
            }
            break;
        case 'preset-8':
            grid[1][28] = 1;
            grid[1][27] = 1;
            grid[2][27] = 1;
            grid[2][29] = 1;
            grid[3][30] = 1;
            grid[4][30] = 1;
            grid[5][30] = 1;
            grid[6][29] = 1;
            grid[7][28] = 1;
            grid[7][27] = 1;
            grid[6][27] = 1;
            grid[4][27] = 1;
            grid[7][24] = 1;
            grid[7][23] = 1;
            grid[6][23] = 1;
            grid[7][21] = 1;
            grid[8][21] = 1;
            grid[8][20] = 1;
            grid[7][20] = 1;
            grid[7][19] = 1;
            grid[6][19] = 1;
            grid[5][19] = 1;
            grid[4][19] = 1;
            grid[4][20] = 1;
            grid[5][21] = 1;
            grid[6][15] = 1;
            grid[4][16] = 1;
            grid[3][16] = 1;
            grid[8][16] = 1;
            grid[9][16] = 1;
            grid[9][14] = 1;
            grid[8][13] = 1;
            grid[7][13] = 1;
            grid[7][12] = 1;
            grid[6][11] = 1;
            grid[6][10] = 1;
            grid[5][12] = 1;
            grid[5][13] = 1;
            grid[4][13] = 1;
            grid[3][14] = 1;
            grid[6][1] = 1;
            grid[6][2] = 1;
            grid[7][2] = 1;
            grid[7][1] = 1;
            grid[4][39] = 1;
            grid[5][39] = 1;
            grid[5][40] = 1;
            grid[4][40] = 1;
            break;
        case 'preset-9':
            grid[6][40] = 1;
            grid[5][41] = 1;
            grid[4][42] = 1;
            grid[3][43] = 1;
            grid[3][44] = 1;
            grid[3][45] = 1;
            grid[4][46] = 1;
            grid[5][47] = 1;
            grid[6][48] = 1;
            grid[7][49] = 1;
            grid[8][49] = 1;
            grid[9][49] = 1;
            grid[10][49] = 1;
            grid[11][48] = 1;
            grid[12][47] = 1;
            grid[13][46] = 1;
            grid[14][45] = 1;
            grid[15][44] = 1;
            grid[16][43] = 1;
            grid[17][42] = 1;
            grid[18][41] = 1;
            grid[19][40] = 1;
            grid[18][39] = 1;
            grid[17][38] = 1;
            grid[16][37] = 1;
            grid[15][36] = 1;
            grid[14][35] = 1;
            grid[13][34] = 1;
            grid[12][33] = 1;
            grid[11][32] = 1;
            grid[10][31] = 1;
            grid[9][31] = 1;
            grid[8][31] = 1;
            grid[7][31] = 1;
            grid[6][32] = 1;
            grid[5][33] = 1;
            grid[4][34] = 1;
            grid[3][35] = 1;
            grid[3][36] = 1;
            grid[3][37] = 1;
            grid[4][38] = 1;
            grid[5][39] = 1;
            grid[21][40] = 1;
            grid[23][40] = 1;
            grid[25][40] = 1;
            grid[26][40] = 1;
            grid[27][39] = 1;
            grid[28][40] = 1;
            grid[27][41] = 1;
            break;
    }
}

document.addEventListener('DOMContentLoaded', initialize);

if ('serviceWorker' in navigator ) {
    window.addEventListener('load', () => {
        navigator.serviceWorker
        .register('sw.js')
        .then(reg => console.log('SW Registered!'))
        .catch(err => console.log('Error regitering SW!'))
    })
}