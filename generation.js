let floors = []

function Random(min, max) {
    return Math.floor(Math.random() * (Math.floor(max) - Math.ceil(min) + 1) + Math.ceil(min));
}

function generateField(tiles) {
    for (let i = 0; i < 24; i++) {
        if (!tiles[i])
            tiles[i] = []
        for (let j = 0; j < 40; j++) {
            tiles[i][j] = "w"
        }
    }
}

function generateRooms(tiles) {
    for (let i = 0; i < Random(5, 10); i++) {
        let leftTop = [Random(1, 16), Random(1, 32)]
        let height = Random(3, 8), width = Random(3, 8);
        for (let j = leftTop[0]; j < leftTop[0] + height; j++) {
            for (let k = leftTop[1]; k < leftTop[1] + width; k++) {
                tiles[j][k] = "f"
            }
        }
    }
}

function generateCorridors(tiles) {
    for (let i = 0; i < Random(3, 5); i++) {
        let hCorridor = Random(1, 22)
        for (let j = 0; j < 40; j++) {
            tiles[hCorridor][j] = 'f'
        }
    }
    for (let i = 0; i < Random(3, 5); i++) {
        let vCorridor = Random(1, 38)
        for (let j = 0; j < 24; j++) {
            tiles[j][vCorridor] = 'f'
        }
    }
}

function getFloors(tiles) {
    for (let i = 1; i < 23; i++) {
        for (let j = 1; j < 39; j++) {
            if (tiles[i][j] === 'f') {
                floors.push({'0': i, '1': j})
            }
        }
    }
}

function placeItems(item, count, tiles, enemies, isSomethingNear, pPos) {
    for (let i = 0; i < count; i++) {
        let pos = Random(0, floors.length - 1)
        let fy = floors[pos][0]
        let fx = floors[pos][1]
        do {
            pos = Random(0, floors.length - 1)
            fy = floors[pos][0]
            fx = floors[pos][1]
        } while (isSomethingNear(fy, fx))
        tiles[floors[pos][0]][floors[pos][1]] = `${item}`
        if (item === 'p') {
            pPos.Y = fy
            pPos.X = fx
        }
        if (item === 'e')
            enemies[enemies.length] = {'y': floors[pos][0], 'x': floors[pos][1], 'health': 100}
        floors.splice(pos, 1)
    }
}

export {generateField, generateRooms, generateCorridors, getFloors, placeItems}