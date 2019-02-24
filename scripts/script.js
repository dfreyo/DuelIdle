var gameData = {
	playerCurrentHealth: 1000,
	playerMaxHealth: 1000,
	playerHealthPercent: 100,
	playerAttack: 100,

	playerCritChance: 0,
	playerLifeSteal: 0,
	playerThorns:0,
	playerDodge: 0,

	playerLevelAttack: 0,
	playerLevelHealth: 0,
	playerLevelCritChance: 0,
	playerLevelLifeSteal: 0,
	playerLevelThorns: 0,
	playerLevelDodge: 0,

	enemyCurrentHealth: 100,
	enemyMaxHealth: 100,
	enemyHealthPercent: 100,
	enemyLevel: 0,
	enemyAttack: 10,

	coinOne: 0,
	coinTwo: 0,
	coinThree: 0,

	souls: 0,

	enemyKilled: 0,
	enemyKilledMax: 0,
	playerKilled: 0,
	chestOneOpened: 0,
	chestTwoOpened: 0,
	chestThreeOpened: 0,
	shrineUsed: 0,

	multiAttack: 0,
	multiHealth: 0,

	attackSeconds: 0,
	healthSeconds: 0,
}

var coinOneNew = 0
var coinTwoNew = 0
var coinThreeNew = 0

document.getElementById("enemyLevel").innerHTML = numberformat.formatShort(gameData.enemyLevel)

$(document).ready(function(){
  $('[data-toggle="tooltip"]').tooltip();
});

function attack(){
		if (Math.random() <= gameData.playerCritChance) {
			gameData.enemyCurrentHealth -= gameData.playerAttack * 2
			console.log("Crit.");
			if (gameData.playerLevelLifeSteal >= 1) {
				gameData.playerCurrentHealth += (gameData.playerAttack * 2) * gameData.playerLifeSteal
				if (gameData.playerCurrentHealth > gameData.playerMaxHealth) {
					gameData.playerCurrentHealth = gameData.playerMaxHealth
				}
			}
		} else {
			gameData.enemyCurrentHealth -= gameData.playerAttack
			if (gameData.playerLevelLifeSteal >= 1) {
				gameData.playerCurrentHealth += gameData.playerAttack * gameData.playerLifeSteal
				if (gameData.playerCurrentHealth > gameData.playerMaxHealth) {
					gameData.playerCurrentHealth = gameData.playerMaxHealth
				}
			}
		}
		if (Math.random() <= gameData.playerDodge) {
			console.log("Dodge.");
		} else {
		gameData.playerCurrentHealth -= gameData.enemyAttack
		gameData.enemyCurrentHealth -= gameData.enemyAttack * gameData.playerThorns
		}
		if (gameData.playerCurrentHealth <= 0) {
			gameData.playerKilled ++
			gameData.souls += gameData.enemyLevel
			alertify.notify('+' + gameData.enemyLevel + ' Souls!', 'warning', 5, function(){});
			gameData.enemyLevel = 0
			enemyStats()
			gameData.enemyCurrentHealth = gameData.enemyMaxHealth
			playerStats()
			gameData.playerCurrentHealth = gameData.playerMaxHealth
			splash()
			console.log("Player revived.");
		}
		if (gameData.enemyCurrentHealth <= 0) {
			gameData.enemyKilled ++
			gameData.enemyKilledMax = Math.max(gameData.enemyKilledMax,gameData.enemyLevel)
			coinDrop()
			gameData.enemyLevel ++
			enemyStats()
			gameData.enemyCurrentHealth = gameData.enemyMaxHealth
			console.log("Enemy revived.");
		}
}

function splash(){
	for (;gameData.playerAttack >= gameData.enemyMaxHealth * 2;) {
		attack()
	}
}

function playerStats(){
	gameData.playerAttack = (gameData.playerLevelAttack * 10) + 100
	gameData.playerMaxHealth = (gameData.playerLevelHealth * 100) + 1000
	gameData.playerCritChance = gameData.playerLevelCritChance / 100
	gameData.playerLifeSteal = gameData.playerLevelLifeSteal / 100
	gameData.playerThorns = gameData.playerLevelThorns / 100
	gameData.playerDodge = gameData.playerLevelDodge / 100

	if (gameData.multiAttack == 1.5) {
		gameData.playerAttack *= 1.5
	}

	if (gameData.multiHealth == 1.5) {
		gameData.playerMaxHealth *= 1.5
	}
}

function enemyStats(){
	gameData.enemyAttack = ((gameData.enemyLevel * 10) + 10) * Math.pow(1.05, gameData.enemyLevel)
	gameData.enemyMaxHealth = ((gameData.enemyLevel * 100) + 100) * Math.pow(1.05, gameData.enemyLevel)
	document.getElementById("enemyLevel").innerHTML = numberformat.formatShort(gameData.enemyLevel)
}

function coinDrop(){
	if (Math.random() >= .9) {
		gameData.coinOne ++
		coinOneNew ++
	}
	if (Math.random() >= .9) {
		gameData.coinTwo ++
		coinTwoNew ++
	}
	if (Math.random() >= .9) {
		gameData.coinThree ++
		coinThreeNew ++
	}
}

function chestOne(){
	var x = 0
	var y = 0
	if (gameData.coinOne >= 1) {
		gameData.coinOne -= 1
		gameData.chestOneOpened ++
		if (Math.random() >= .5) {
			gameData.playerLevelAttack += 1
			x ++
		}	else {
			gameData.playerLevelHealth += 1
			gameData.playerCurrentHealth += 100
			y ++
		}
	}
	if (x >= 1) {
		alertify.notify('+' + x * 10 + ' Attack', 'success', 5, function(){});
	}
	if (y >= 1) {
		alertify.notify('+' + y * 100 + ' Health', 'success', 5, function(){});
	}
	document.getElementById("coinOne").innerHTML = numberformat.formatShort(gameData.coinOne)
	playerStats()
}

function chestTwo(){
	var x = 0
	var y = 0
	var a = 0
	var b = 0
	if (gameData.coinTwo >= 10) {
		gameData.coinTwo -= 10
		gameData.chestTwoOpened ++
		if (Math.random() >= .5) {
			if (gameData.playerLevelCritChance >= 50) {
				if (Math.random() >= .5) {
					gameData.playerLevelAttack += 10
					a ++
				} else {
					gameData.playerLevelHealth += 10
					gameData.playerCurrentHealth += 1000
					b ++
				}
			} else {
				gameData.playerLevelCritChance += 1
				x ++
			}
		} else {
			if (gameData.playerLevelLifeSteal >= 50) {
				if (Math.random() >= .5) {
					gameData.playerLevelAttack += 10
					a ++
				} else {
					gameData.playerLevelHealth += 10
					gameData.playerCurrentHealth += 1000
					b ++
				}

			} else {
				gameData.playerLevelLifeSteal += 1
				y ++
			}
		}
	}
	if (a >= 1) {
		alertify.notify('+' + a * 100 + ' Attack', 'success', 5, function(){});
	}
	if (b >= 1) {
		alertify.notify('+' + b * 1000 + ' Health', 'success', 5, function(){});
	}
	if (x >= 1) {
		alertify.notify('+' + x + '% Crit Chance', 'success', 5, function(){});
	}
	if (y >= 1) {
		alertify.notify('+' + y + '% Life Steal', 'success', 5, function(){});
	}
	document.getElementById("coinTwo").innerHTML = numberformat.formatShort(gameData.coinTwo)
	playerStats()
}

function chestThree(){
	var x = 0
	var y = 0
	var a = 0
	var b = 0
	if (gameData.coinThree >= 100) {
		gameData.coinThree -= 100
		gameData.chestThreeOpened ++
		if (Math.random() >= .5) {
			if (gameData.playerLevelThorns >= 50) {
				if (Math.random() >= .5) {
					gameData.playerLevelAttack += 100
					a ++
				} else {
					gameData.playerLevelHealth += 100
					gameData.playerCurrentHealth += 10000
					b++
				}
			} else {
				gameData.playerLevelThorns += 1
				x ++
			}
		} else {
			if (gameData.playerLevelDodge >= 50) {
				if (Math.random() >= .5) {
					gameData.playerLevelAttack += 100
					a ++
				} else {
					gameData.playerLevelHealth += 100
					gameData.playerCurrentHealth += 10000
					b++
				}
			} else {
				gameData.playerLevelDodge += 1
				y ++
			}
		}
	}
	if (a >= 1) {
	alertify.notify('+' + a * 1000 + ' Attack', 'success', 5, function(){});
	}
	if (b >= 1) {
		alertify.notify('+' + b * 1000 + ' Health', 'success', 5, function(){});
	}
	if (x >= 1) {
		alertify.notify('+' + x + '% Thorns', 'success', 5, function(){});
	}

	if (y >= 1) {
		alertify.notify('+' + y + '% Dodge', 'success', 5, function(){});
	}
	document.getElementById("coinThree").innerHTML = numberformat.formatShort(gameData.coinThree)
	playerStats()
}

function chestOneMax(){
	var x = 0
	var y = 0
	for (;gameData.coinOne >= 1;) {
		gameData.coinOne -= 1
		gameData.chestOneOpened ++
		if (Math.random() >= .5) {
			gameData.playerLevelAttack += 1
			x ++
		}	else {
			gameData.playerLevelHealth += 1
			gameData.playerCurrentHealth += 100
			y ++
		}
	}
	if (x >= 1) {
		alertify.notify('+' + x * 10 + ' Attack', 'success', 5, function(){});
	}
	if (y >= 1) {
		alertify.notify('+' + y * 100 + ' Health', 'success', 5, function(){});
	}
	document.getElementById("coinOne").innerHTML = numberformat.formatShort(gameData.coinOne)
	playerStats()
}

function chestTwoMax(){
	var x = 0
	var y = 0
	var a = 0
	var b = 0
	for (;gameData.coinTwo >= 10;) {
		gameData.coinTwo -= 10
		gameData.chestTwoOpened ++
		if (Math.random() >= .5) {
			if (gameData.playerLevelCritChance >= 50) {
				if (Math.random() >= .5) {
					gameData.playerLevelAttack += 10
					a ++
				} else {
					gameData.playerLevelHealth += 10
					gameData.playerCurrentHealth += 1000
					b ++
				}
			} else {
				gameData.playerLevelCritChance += 1
				x ++
			}
		} else {
			if (gameData.playerLevelLifeSteal >= 50) {
				if (Math.random() >= .5) {
					gameData.playerLevelAttack += 10
					a ++
				} else {
					gameData.playerLevelHealth += 10
					gameData.playerCurrentHealth += 1000
					b ++
				}

			} else {
				gameData.playerLevelLifeSteal += 1
				y ++
			}
		}
	}
	if (a >= 1) {
		alertify.notify('+' + a * 100 + ' Attack', 'success', 5, function(){});
	}
	if (b >= 1) {
		alertify.notify('+' + b * 1000 + ' Health', 'success', 5, function(){});
	}
	if (x >= 1) {
		alertify.notify('+' + x + '% Crit Chance', 'success', 5, function(){});
	}
	if (y >= 1) {
		alertify.notify('+' + y + '% Life Steal', 'success', 5, function(){});
	}
	document.getElementById("coinTwo").innerHTML = numberformat.formatShort(gameData.coinTwo)
	playerStats()
}

function chestThreeMax(){
	var x = 0
	var y = 0
	var a = 0
	var b = 0
	for (;gameData.coinThree >= 100;) {
		gameData.coinThree -= 100
		gameData.chestThreeOpened ++
		if (Math.random() >= .5) {
			if (gameData.playerLevelThorns >= 50) {
				if (Math.random() >= .5) {
					gameData.playerLevelAttack += 100
					a ++
				} else {
					gameData.playerLevelHealth += 100
					gameData.playerCurrentHealth += 10000
					b++
				}
			} else {
				gameData.playerLevelThorns += 1
				x ++
			}
		} else {
			if (gameData.playerLevelDodge >= 50) {
				if (Math.random() >= .5) {
					gameData.playerLevelAttack += 100
					a ++
				} else {
					gameData.playerLevelHealth += 100
					gameData.playerCurrentHealth += 10000
					b++
				}
			} else {
				gameData.playerLevelDodge += 1
				y ++
			}
		}
	}
	if (a >= 1) {
	alertify.notify('+' + a * 1000 + ' Attack', 'success', 5, function(){});
	}
	if (b >= 1) {
		alertify.notify('+' + b * 1000 + ' Health', 'success', 5, function(){});
	}
	if (x >= 1) {
		alertify.notify('+' + x + '% Thorns', 'success', 5, function(){});
	}

	if (y >= 1) {
		alertify.notify('+' + y + '% Dodge', 'success', 5, function(){});
	}
	document.getElementById("coinThree").innerHTML = numberformat.formatShort(gameData.coinThree)
	playerStats()
}

function shrine(){
	if (gameData.souls >= 100) {
		gameData.shrineUsed ++
		gameData.souls -= 100
		if (Math.random() >= .5) {
			gameData.attackSeconds += 300
		} else {
			gameData.healthSeconds += 300
		}
	}
}

function shrineMax(){
	for (;gameData.souls >= 100;) {
		gameData.shrineUsed ++
		gameData.souls -= 100
		if (Math.random() >= .5) {
			gameData.attackSeconds += 300
		} else {
			gameData.healthSeconds += 300
		}
	}
}

function attackTime(){
if (gameData.attackSeconds >= 1) {
	gameData.attackSeconds --
	gameData.multiAttack = 1.5
} else {
	gameData.multiAttack = 0
	}
}

function healthTime(){
if (gameData.healthSeconds >= 1) {
	gameData.healthSeconds --
	gameData.multiHealth = 1.5
} else {
	gameData.multiHealth = 0
	}
}

function display(){
	document.getElementById("playerHealthBar").setAttribute("style", "width:" + ((gameData.playerCurrentHealth / gameData.playerMaxHealth) * 100) + "%")
	document.getElementById("enemyHealthBar").setAttribute("style", "width:" + ((gameData.enemyCurrentHealth / gameData.enemyMaxHealth) * 100) + "%")
	document.getElementById("playerHealthBarPercent").innerHTML = numberformat.formatShort(gameData.playerCurrentHealth)
	document.getElementById("enemyHealthBarPercent").innerHTML = numberformat.formatShort(gameData.enemyCurrentHealth)

	document.getElementById("enemyMaxHealth").innerHTML = "Max Health: " + numberformat.formatShort(gameData.enemyMaxHealth)
	document.getElementById("enemyAttack").innerHTML = "Attack: " + numberformat.formatShort(gameData.enemyAttack)

	document.getElementById("playerMaxHealth").innerHTML = "Max Health: " + numberformat.formatShort(gameData.playerMaxHealth)
	document.getElementById("playerAttack").innerHTML = "Attack: " + numberformat.formatShort(gameData.playerAttack)

	if (gameData.playerLevelCritChance >= 1) {
		document.getElementById("playerCritChance").innerHTML = "Crit Chance: " + numberformat.formatShort(gameData.playerCritChance*100) + "%"
	} else {
		document.getElementById("playerCritChance").innerHTML = ""
	}

	if (gameData.playerLevelLifeSteal >= 1) {
		document.getElementById("playerLifeSteal").innerHTML = "Life Steal: " + numberformat.formatShort(gameData.playerLifeSteal*100) + "%"
	} else {
		document.getElementById("playerLifeSteal").innerHTML = ""
	}

	if (gameData.playerLevelThorns >= 1) {
		document.getElementById("playerThorns").innerHTML = "Thorns: " + numberformat.formatShort(gameData.playerThorns*100) + "%"
	} else {
		document.getElementById("playerThorns").innerHTML = ""
	}

	if (gameData.playerLevelDodge >= 1) {
		document.getElementById("playerDodge").innerHTML = "Dodge: " + numberformat.formatShort(gameData.playerDodge*100) + "%"
	} else {
		document.getElementById("playerDodge").innerHTML = ""
	}

	document.getElementById("coinOne").innerHTML = numberformat.formatShort(gameData.coinOne)
	document.getElementById("coinTwo").innerHTML = numberformat.formatShort(gameData.coinTwo)
	document.getElementById("coinThree").innerHTML = numberformat.formatShort(gameData.coinThree)
	document.getElementById("souls").innerHTML = numberformat.formatShort(gameData.souls)

	document.getElementById("enemyKilled").innerHTML = "Enemies Killed: " + numberformat.formatShort(gameData.enemyKilled)
	document.getElementById("enemyKilledMax").innerHTML = "Max enemy level: " +  numberformat.formatShort(gameData.enemyKilledMax)
	document.getElementById("playerKilled").innerHTML = "Player deaths: " +  numberformat.formatShort(gameData.playerKilled)
	document.getElementById("chestOneOpened").innerHTML = "Tier 1 chest opened: " +  numberformat.formatShort(gameData.chestOneOpened)
	document.getElementById("chestTwoOpened").innerHTML = "Tier 2 chest opened: " +  numberformat.formatShort(gameData.chestTwoOpened)
	document.getElementById("chestThreeOpened").innerHTML = "Tier 3 chest opened: " +  numberformat.formatShort(gameData.chestThreeOpened)
	document.getElementById("shrineUsed").innerHTML = "Times shrine used: " +  numberformat.formatShort(gameData.shrineUsed)

	if (gameData.attackSeconds) {
		document.getElementById("attackSeconds").innerHTML = "1.5x Attack: " + numberformat.formatShort(gameData.attackSeconds / 60) + " Minutes"

	}else {
		document.getElementById("attackSeconds").innerHTML = ""
	}
	if (gameData.healthSeconds) {
		document.getElementById("healthSeconds").innerHTML = "1.5x Health: " + numberformat.formatShort(gameData.healthSeconds / 60) + " Minutes"
	} else {
		document.getElementById("healthSeconds").innerHTML = ""
	}
}

var chestOneCan = 0
var chestTwoCan = 0
var chestThreeCan = 0
var allChestCan = 0

function notifications(){
	if (coinOneNew >= 1) {
		alertify.notify('+' + coinOneNew + ' Tier 1 Coin!', 'warning', 5, function(){});
		coinOneNew = 0
	}
	if (coinTwoNew >= 1) {
		alertify.notify('+' + coinTwoNew + ' Tier 2 Coin!', 'warning', 5, function(){});
		coinTwoNew = 0
	}
	if (coinThreeNew >= 1) {
		alertify.notify('+' + coinThreeNew + ' Tier 3 Coin!', 'warning', 5, function(){});
		coinThreeNew = 0
	}

	chestOneCan = Math.floor(gameData.coinOne / 1)
	chestTwoCan = Math.floor(gameData.coinTwo / 10)
	chestThreeCan = Math.floor(gameData.coinThree / 100)
	allChestCan = chestOneCan + chestTwoCan + chestThreeCan

	if (allChestCan >= 1) {
		document.getElementById("chestNotification").innerHTML = numberformat.formatShort(allChestCan)
	} else {
		document.getElementById("chestNotification").innerHTML = ""
	}

	if (gameData.souls >= 100) {
		document.getElementById("shrineNotification").innerHTML = numberformat.formatShort(Math.floor(gameData.souls / 100))
	} else {
		document.getElementById("shrineNotification").innerHTML = ""
	}
}

loadGame()

setInterval(function gameLoop(){
	attack()
	attackTime()
	healthTime()
	display()
	notifications()
  console.log("Tick.");
}, 1000);

setInterval(function saveLoop(){
	saveGame()
  console.log("Tick.");
}, 300000);

function saveGame(){
  localStorage.setItem('duelIdle', JSON.stringify(gameData))
	alertify.notify('Game Saved!', 'success', 5, function(){});
  console.log("Game Saved!");
}

function loadGame(){
  var saveGame = JSON.parse(localStorage.getItem("duelIdle"))
  if (saveGame !== null) {
    gameData = saveGame
  }
	playerStats()
	enemyStats()
	display()
  console.log("Game Loaded!");
}

function newGame(){
	localStorage.clear();
	location.reload();
  console.log("New Game.");
}
