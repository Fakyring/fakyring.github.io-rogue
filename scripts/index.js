let field = document.getElementsByClassName('field')[0]
let potionsField = document.getElementById('potions')
let swordsField = document.getElementById('swords')
let healthField = document.getElementById('health')
let directions = ['top', 'right', 'down', 'left']
var game = new Game()
import {Random, generateField, generateRooms, getFloors, placeItems, generateCorridors} from './generation.js'

function Game() {
    let killEnemy = 0
    let tiles = [[], []]
    let potions = 0
    let swords = 1
    let player = {X: 0, Y: 0, 'health': 100};
    let enemies = []
    let nearEnemies = []

    function isSomethingNear(posY, posX, checkList = ['hp', 'sw', 'e'], dir = '', source = 'p') {
        let found = false
        if (dir === '') {
            if (posY - 1 >= 0 && (checkList.includes(tiles[posY - 1][posX]) || checkList.includes(tiles[posY - 1][posX - 1]) || checkList.includes(tiles[posY - 1][posX + 1]))) {
                found = true
            }
            if (checkList.includes(tiles[posY][posX]) || checkList.includes(tiles[posY][posX - 1]) || checkList.includes(tiles[posY][posX + 1])) {
                found = true
            }
            if (posY + 1 <= 23 && (checkList.includes(tiles[posY + 1][posX]) || checkList.includes(tiles[posY + 1][posX - 1]) || checkList.includes(tiles[posY + 1][posX + 1]))) {
                found = true
            }
            if (found)
                return true
        } else {
            if (source !== 'p')
                checkList = ['hp', 'w', 'e', 'p', 'sw']
            switch (dir) {
                case 'top':
                    if (posY - 1 >= 0 && !checkList.includes(tiles[posY - 1][posX])) {
                        if (tiles[posY - 1][posX] === 'hp')
                            potions++;
                        if (tiles[posY - 1][posX] === 'sw')
                            swords++;
                        tiles[posY - 1][posX] = source
                        tiles[posY][posX] = 'f'
                        if (source !== 'p')
                            enemies[enemies.findIndex(enemy => (enemy.x === posX && enemy.y === posY))].y--
                        else
                            player.Y--
                    }
                    break
                case 'right':
                    if (posX + 1 <= 39 && !checkList.includes(tiles[posY][posX + 1])) {
                        if (tiles[posY][posX + 1] === 'hp')
                            potions++;
                        if (tiles[posY][posX + 1] === 'sw')
                            swords++;
                        tiles[posY][posX + 1] = source
                        tiles[posY][posX] = 'f'
                        if (source !== 'p')
                            enemies[enemies.findIndex(enemy => (enemy.x === posX && enemy.y === posY))].x++
                        else
                            player.X++
                    }
                    break
                case 'down':
                    if (posY + 1 <= 23 && !checkList.includes(tiles[posY + 1][posX])) {
                        if (tiles[posY + 1][posX] === 'hp')
                            potions++;
                        if (tiles[posY + 1][posX] === 'sw')
                            swords++;
                        tiles[posY + 1][posX] = source
                        tiles[posY][posX] = 'f'
                        if (source !== 'p')
                            enemies[enemies.findIndex(enemy => (enemy.x === posX && enemy.y === posY))].y++
                        else
                            player.Y++
                    }
                    break
                case 'left':
                    if (posX - 1 >= 0 && !checkList.includes(tiles[posY][posX - 1])) {
                        if (tiles[posY][posX - 1] === 'hp')
                            potions++;
                        if (tiles[posY][posX - 1] === 'sw')
                            swords++;
                        tiles[posY][posX - 1] = source
                        tiles[posY][posX] = 'f'
                        if (source !== 'p')
                            enemies[enemies.findIndex(enemy => (enemy.x === posX && enemy.y === posY))].x--
                        else
                            player.X--
                    }
                    break
            }
            attackEnemies(true)
        }
        return false;
    }

    function findEnemies() {
        nearEnemies = []
        let alive = false
        for (const enemy in enemies) {
            if (enemies[enemy].health > 0) {
                alive = true
                if (isSomethingNear(enemies[enemy].y, enemies[enemy].x, ['p'])) {
                    nearEnemies.push(enemy)
                }
            }
        }
        if (alive === false) {
            alert("Вы выиграли")
            game.init()
        }
    }

    function attackEnemies(p = false) {
        if (!p) {
            nearEnemies.forEach((enemy) => {
                enemies[enemy].health -= 15 * swords
                if (enemies[enemy].health <= 0) {
                    tiles[enemies[enemy].y][enemies[enemy].x] = 'f'
                }
            })
        }
    }

    function enemiesMovement() {
        findEnemies()
        enemies.forEach((enemy) => {
            if (enemy.health > 0) {
                if (!nearEnemies.includes(enemies.indexOf(enemy).toString())) {
                    isSomethingNear(enemy.y, enemy.x, '', directions[Random(0, 3)], 'e')
                }
            }
        })
        findEnemies()
        player.health -= 5 * nearEnemies.length
        if (player.health < 30 && potions > 0) {
            heal()
        }
        if (player.health <= 0) {
            alert("Вы проиграли")
            game.init()
        }
    }

    function heal() {
        if (potions > 0 && player.health < 100) {
            potions--
            if (player.health < 70)
                player.health += 30
            else
                player.health = 100
        }
    }

    function printDungeon() {
        let result = ""
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
                        let enemy = enemies[enemies.findIndex(enemy => (enemy.x === j && enemy.y === i))]
                        if (enemy.health <= 0) {
                            tiles[i][j] = 'f'
                            result += `<div class="tile"></div>`
                        } else
                            result += `<div class="tileE"><div class="health" style="width: ${enemy.health}%"></div></div>`
                        break
                    case 'p':
                        result += `<div class="tileP"><div class="health" style="width: ${player.health}%"></div></div>`
                        break
                }
            }
        }
        field.innerHTML = result
        potionsField.innerHTML = "Зелья: " + potions
        swordsField.innerHTML = "Урон: x" + swords
        healthField.innerHTML = "Здоровье: " + player.health
    }

    this.init = function () {
        killEnemy = 0
        tiles = [[], []]
        potions = 0
        swords = 1
        player = {X: 0, Y: 0, 'health': 100};
        enemies = []
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
        console.log(e.key)
        switch (e.key) {
            case 'w':
            case 'ц':
            case 'ArrowUp':
                isSomethingNear(player.Y, player.X, ['w', 'e'], 'top')
                enemiesMovement()
                break
            case 'd':
            case 'в':
            case 'ArrowRight':
                isSomethingNear(player.Y, player.X, ['w', 'e'], 'right')
                enemiesMovement()
                break
            case 's':
            case 'ы':
            case 'ArrowDown':
                isSomethingNear(player.Y, player.X, ['w', 'e'], 'down')
                enemiesMovement()
                break
            case 'a':
            case 'ф':
            case 'ArrowLeft':
                isSomethingNear(player.Y, player.X, ['w', 'e'], 'left')
                enemiesMovement()
                break
            case 'h':
            case 'р':
                heal()
                break
            case ' ':
                enemiesMovement()
                attackEnemies()
                break
            case 'r':
            case 'к':
                game.init()
                break
            case '-':
                enemies[killEnemy].health = 0
                killEnemy++
                printDungeon()
                break
        }
        printDungeon()
    }
}

game.init()
window.addEventListener('keydown', game.action);

function changeSizes() {
    let width = 0
    let multiplier = 1.5
    let r = document.querySelector(':root');
    if (window.innerHeight > window.innerWidth)
        multiplier = 1
    width = (40 * Math.floor(window.innerWidth / multiplier / 40))
    r.style.setProperty('--fieldWidth', `${width}px`)
    r.style.setProperty('--fieldHeight', `${width / 40 * 24}px`)
}

changeSizes()
window.addEventListener('resize', changeSizes);