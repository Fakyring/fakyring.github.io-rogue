let floors = []
let vCorridors = 0, hCorridors = 0

function Random(min, max) {
    return Math.floor(Math.random() * (Math.floor(max) - Math.ceil(min) + 1) + Math.ceil(min));
}

function generateField(tiles) {
    floors = []
    vCorridors = 0
    hCorridors = 0
    for (let i = 0; i < 24; i++) {
        if (!tiles[i])
            tiles[i] = []
        for (let j = 0; j < 40; j++) {
            tiles[i][j] = "w"
        }
    }
}

function generateCorridors(tiles) {
    let hCorridorsToGen = Random(3, 5) - hCorridors
    for (let i = 0; i < hCorridorsToGen; i++) {
        createCorridor(tiles, 'h')
    }
    let vCorridorsToGen = Random(3, 4) - vCorridors
    for (let i = 0; i < vCorridorsToGen; i++) {
        createCorridor(tiles, 'v')
    }
}

function createCorridor(tiles, type, pos = -1) {
    if (type === 'h') {
        let hCorridor = Random(1, 22)
        if (pos !== -1)
            hCorridor = pos
        for (let j = 0; j < 40; j++) {
            tiles[hCorridor][j] = 'f'
        }
        hCorridors++
    } else {
        let vCorridor = Random(1, 38)
        if (pos !== -1)
            vCorridor = pos
        for (let j = 0; j < 24; j++) {
            tiles[j][vCorridor] = 'f'
        }
        vCorridors++
    }
}

function generateRooms(tiles) {
    let room
    for (let i = 0; i < Random(5, 10); i++) {
        let leftTop = [Random(1, 15), Random(1, 31)]
        let height = Random(3, 8), width = Random(3, 8);
        for (let j = leftTop[0]; j < leftTop[0] + height; j++) {
            for (let k = leftTop[1]; k < leftTop[1] + width; k++) {
                tiles[j][k] = "f"
            }
        }
        room = {
            'y': leftTop[0],
            'x': leftTop[1],
            'height': leftTop[0] + height,
            'width': leftTop[1] + width
        }
        findClosedRooms(tiles, room)
    }
}

function findClosedRooms(tiles, room) {
    let foundExit = false
    for (let i = room.x; i < room.width; i++) {
        if (tiles[room.y - 1][i] === 'f') {
            foundExit = true
            return
        }
        if (tiles[room.height][i] === 'f') {
            foundExit = true
            return
        }
    }
    for (let i = room.y; i < room.height; i++) {
        if (tiles[i][room.width] === 'f') {
            foundExit = true
            return
        }
        if (tiles[i][room.x - 1] === 'f') {
            foundExit = true
            return
        }
    }
    if (!foundExit) {
        if (Random(0, 1) === 0)
            createCorridor(tiles, 'v', Random(room.x + 1, room.width))
        else
            createCorridor(tiles, 'h', Random(room.y + 1, room.height))
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

export {Random, generateField, generateRooms, generateCorridors, getFloors, placeItems}