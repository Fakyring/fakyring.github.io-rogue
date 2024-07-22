let tiles = [[], []]
let field = document.getElementsByClassName('field')[0]
let potionsField = document.getElementById('potions')
let swordsField = document.getElementById('swords')
let potions = 0
let swords = 1
let player = {X: 0, Y: 0, 'health': 100};
let enemies = []
let nearEnemies
let game = new Game()
import {generateField, generateRooms, generateCorridors, getFloors, placeItems} from './generation.js'

function Game() {
    function isSomethingNear(posY, posX, checkList = ['hp', 'sw', 'e'], dir = '') {
        let found = false
        if (dir === '') {
            if (checkList.includes(tiles[posY - 1][posX]) || checkList.includes(tiles[posY - 1][posX - 1]) || checkList.includes(tiles[posY - 1][posX + 1])) {
                found = true
                if (checkList[0] === 'e'){

                }
            }
            if (checkList.includes(tiles[posY][posX]) || checkList.includes(tiles[posY][posX - 1]) || checkList.includes(tiles[posY][posX + 1])) {
                found = true
            }
            if (checkList.includes(tiles[posY + 1][posX]) || checkList.includes(tiles[posY + 1][posX - 1]) || checkList.includes(tiles[posY + 1][posX + 1])) {
                found = true
            }
            if (found)
                return true
        } else {
            switch (dir) {
                case 'top':
                    if (posY - 1 >= 0 && !checkList.includes(tiles[posY - 1][posX])) {
                        if (tiles[posY - 1][posX] === 'hp')
                            potions++;
                        if (tiles[posY - 1][posX] === 'sw')
                            swords++;
                        tiles[posY - 1][posX] = 'p'
                        tiles[posY][posX] = 'f'
                        player.Y--
                    }
                    break
                case 'right':
                    if (posX + 1 <= 39 && !checkList.includes(tiles[posY][posX + 1])) {
                        if (tiles[posY][posX + 1] === 'hp')
                            potions++;
                        if (tiles[posY][posX + 1] === 'sw')
                            swords++;
                        tiles[posY][posX + 1] = 'p'
                        tiles[posY][posX] = 'f'
                        player.X++
                    }
                    break
                case 'down':
                    if (posY + 1 <= 23 && !checkList.includes(tiles[posY + 1][posX])) {
                        if (tiles[posY + 1][posX] === 'hp')
                            potions++;
                        if (tiles[posY + 1][posX] === 'sw')
                            swords++;
                        tiles[posY + 1][posX] = 'p'
                        tiles[posY][posX] = 'f'
                        player.Y++
                    }
                    break
                case 'left':
                    if (posX - 1 >= 0 && !checkList.includes(tiles[posY][posX - 1])) {
                        if (tiles[posY][posX - 1] === 'hp')
                            potions++;
                        if (tiles[posY][posX - 1] === 'sw')
                            swords++;
                        tiles[posY][posX - 1] = 'p'
                        tiles[posY][posX] = 'f'
                        player.X--
                    }
                    break
            }
        }
        return false;
    }

    function attackEnemies() {
        nearEnemies = isSomethingNear(player.Y, player.X, ['e'])
    }

    function printDungeon() {
        let result = ""
        let eCounter = 0
        for (let i = 0; i < 24; i++) {
            for (let j = 0; j < 40; j++) {
                switch (tiles[i][j]) {
                    case 'w':
                        result += `<div class="tileW"></div>`
                        break
                    case 'f':
                        result += `<div class="tile"></div>`
                        break
                    case 'hp':
                        result += `<div class="tileHP"></div>`
                        break
                    case 'sw':
                        result += `<div class="tileSW"></div>`
                        break
                    case 'e':
                        result += `<div id="${eCounter}" class="tileE"><div class="health" style="width: ${enemies[eCounter].health / 4}pX"></div></div>`
                        eCounter++
                        break
                    case 'p':
                        result += `<div class="tileP"><div class="health" style="width: ${player.health / 4}pX"></div></div>`
                        break
                }
            }
        }
        field.innerHTML = result
        potionsField.innerHTML = "Зелья: " + potions
        swordsField.innerHTML = "Урон: x" + swords
    }

    this.init = function () {
        generateField(tiles)
        generateRooms(tiles)
        generateCorridors(tiles)
        getFloors(tiles)
        placeItems('hp', 10, tiles, enemies, isSomethingNear, player)
        placeItems('sw', 2, tiles, enemies, isSomethingNear, player)
        placeItems('e', 10, tiles, enemies, isSomethingNear, player)
        placeItems('p', 1, tiles, enemies, isSomethingNear, player)
        printDungeon()
    }

    this.action = function (e) {
        switch (e.key) {
            case 'w':
            case 'ц':
                isSomethingNear(player.Y, player.X, ['w', 'e'], 'top')
                break
            case 'd':
            case 'в':
                isSomethingNear(player.Y, player.X, ['w', 'e'], 'right')
                break
            case 's':
            case 'ы':
                isSomethingNear(player.Y, player.X, ['w', 'e'], 'down')
                break
            case 'a':
            case 'ф':
                isSomethingNear(player.Y, player.X, ['w', 'e'], 'left')
                break
            case 'h':
            case 'р':
                if (potions > 0 && player.health < 100) {
                    potions--
                    if (player.health < 80)
                        player.health += 20
                    else
                        player.health = 100
                }
                break
            case 'Space':
                attackEnemies()
                break
        }
        printDungeon()
    }
}

game.init();
window.addEventListener('keydown', game.action);