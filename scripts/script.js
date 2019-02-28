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

	multiPlayerAttack: 0,
	multiPlayerHealth: 0,
	multiEnemyAttack: 0,
	multiEnemyHealth: 0,
	coinDrop: .9,

	playerAttackSeconds: 0,
	playerHealthSeconds: 0,
	enemyAttackSeconds: 0,
	enemyHealthSeconds: 0,
	coinSeconds: 0,
}

var allChestCan = 0
var allSoulsCan = 0
var playerAttackAlert = 0
var playerHealthAlert = 0
var playerCritAlert = 0
var playerLifeStealAlert = 0
var playerThornsAlert = 0
var playerDodgeAlert = 0
var coinOneAlert = 0
var coinTwoAlert = 0
var coinThreeAlert = 0
var shrinePlayerAttackAlert = 0
var shrinePlayerHealthAlert = 0
var shrineEnemyAttackAlert = 0
var shrineEnemyHealthAlert = 0
var shrineCoinDropAlert = 0

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
	for (;gameData.playerAttack >= gameData.enemyMaxHealth;) {
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
	if (gameData.multiPlayerAttack == 1.5) {
		gameData.playerAttack *= 1.5
	}
	if (gameData.multiPlayerHealth == 1.5) {
		gameData.playerMaxHealth *= 1.5
	}
}

function enemyStats(){
	gameData.enemyAttack = ((gameData.enemyLevel * 1) + 10) * Math.pow(1.05, gameData.enemyLevel)
	gameData.enemyMaxHealth = ((gameData.enemyLevel * 10) + 100) * Math.pow(1.05, gameData.enemyLevel)
	if (gameData.multiEnemyAttack == .5) {
		gameData.enemyAttack *= .5
	}
	if (gameData.multiEnemyHealth == .5) {
		gameData.enemyMaxHealth *= .5
	}
}

function coinDrop(){
	if (Math.random() >= gameData.coinDrop) {
		gameData.coinOne ++
		coinOneAlert += 1
	}
	if (Math.random() >= gameData.coinDrop) {
		gameData.coinTwo ++
		coinTwoAlert += 1
	}
	if (Math.random() >= gameData.coinDrop) {
		gameData.coinThree ++
		coinThreeAlert += 1
	}
}

function chestOne(){
	if (gameData.coinOne >= 1) {
		gameData.coinOne -= 1
		gameData.chestOneOpened ++
		if (Math.random() >= .5) {
			gameData.playerLevelAttack += 1
			playerAttackAlert += 10
		}	else {
			gameData.playerLevelHealth += 1
			gameData.playerCurrentHealth += 100
			playerHealthAlert += 100
		}
	}
	display()
	notifications()
	playerStats()
}

function chestTwo(){
	if (gameData.coinTwo >= 10) {
		gameData.coinTwo -= 10
		gameData.chestTwoOpened ++
		if (Math.random() >= .5) {
			if (gameData.playerLevelCritChance >= 50) {
				if (Math.random() >= .5) {
					gameData.playerLevelAttack += 10
					playerAttackAlert += 100
				} else {
					gameData.playerLevelHealth += 10
					gameData.playerCurrentHealth += 1000
					playerHealthAlert += 1000
				}
			} else {
				gameData.playerLevelCritChance += 1
				playerCritAlert += 1
			}
		} else {
			if (gameData.playerLevelLifeSteal >= 50) {
				if (Math.random() >= .5) {
					gameData.playerLevelAttack += 10
					playerAttackAlert += 100
				} else {
					gameData.playerLevelHealth += 10
					gameData.playerCurrentHealth += 1000
					playerHealthAlert += 1000
				}
			} else {
				gameData.playerLevelLifeSteal += 1
				playerLifeStealAlert += 1
			}
		}
	}
	display()
	notifications()
	playerStats()
}

function chestThree(){
	if (gameData.coinThree >= 100) {
		gameData.coinThree -= 100
		gameData.chestThreeOpened ++
		if (Math.random() >= .5) {
			if (gameData.playerLevelThorns >= 50) {
				if (Math.random() >= .5) {
					gameData.playerLevelAttack += 100
					playerAttackAlert += 1000
				} else {
					gameData.playerLevelHealth += 100
					gameData.playerCurrentHealth += 10000
					playerHealthAlert += 10000
				}
			} else {
				gameData.playerLevelThorns += 1
				playerThornsAlert += 1
			}
		} else {
			if (gameData.playerLevelDodge >= 50) {
				if (Math.random() >= .5) {
					gameData.playerLevelAttack += 100
					playerAttackAlert += 1000
				} else {
					gameData.playerLevelHealth += 100
					gameData.playerCurrentHealth += 10000
					playerHealthAlert += 10000
				}
			} else {
				gameData.playerLevelDodge += 1
				playerDodgeAlert += 1
			}
		}
	}
	display()
	notifications()
	playerStats()
}

function chestOneMax(){
	for (;gameData.coinOne >= 1;) {
		gameData.coinOne -= 1
		gameData.chestOneOpened ++
		if (Math.random() >= .5) {
			gameData.playerLevelAttack += 1
			playerAttackAlert += 10
		}	else {
			gameData.playerLevelHealth += 1
			gameData.playerCurrentHealth += 100
			playerHealthAlert += 100
		}
	}
	display()
	notifications()
	playerStats()
}

function chestTwoMax(){
	for (;gameData.coinTwo >= 10;) {
		gameData.coinTwo -= 10
		gameData.chestTwoOpened ++
		if (Math.random() >= .5) {
			if (gameData.playerLevelCritChance >= 50) {
				if (Math.random() >= .5) {
					gameData.playerLevelAttack += 10
					playerAttackAlert += 100
				} else {
					gameData.playerLevelHealth += 10
					gameData.playerCurrentHealth += 1000
					playerHealthAlert += 1000
				}
			} else {
				gameData.playerLevelCritChance += 1
				playerCritAlert += 1
			}
		} else {
			if (gameData.playerLevelLifeSteal >= 50) {
				if (Math.random() >= .5) {
					gameData.playerLevelAttack += 10
					playerAttackAlert += 100
				} else {
					gameData.playerLevelHealth += 10
					gameData.playerCurrentHealth += 1000
					playerHealthAlert += 1000
				}
			} else {
				gameData.playerLevelLifeSteal += 1
				playerLifeStealAlert += 1
			}
		}
	}
	display()
	notifications()
	playerStats()
}

function chestThreeMax(){
	for (;gameData.coinThree >= 100;) {
		gameData.coinThree -= 100
		gameData.chestThreeOpened ++
		if (Math.random() >= .5) {
			if (gameData.playerLevelThorns >= 50) {
				if (Math.random() >= .5) {
					gameData.playerLevelAttack += 100
					playerAttackAlert += 1000
				} else {
					gameData.playerLevelHealth += 100
					gameData.playerCurrentHealth += 10000
					playerHealthAlert += 10000
				}
			} else {
				gameData.playerLevelThorns += 1
				playerThornsAlert += 1
			}
		} else {
			if (gameData.playerLevelDodge >= 50) {
				if (Math.random() >= .5) {
					gameData.playerLevelAttack += 100
					playerAttackAlert += 1000
				} else {
					gameData.playerLevelHealth += 100
					gameData.playerCurrentHealth += 10000
					playerHealthAlert += 10000
				}
			} else {
				gameData.playerLevelDodge += 1
				playerDodgeAlert += 1
			}
		}
	}
	display()
	notifications()
	playerStats()
}

function shrine(){
	if (gameData.souls >= 100) {
		var soulRandom = Math.floor(Math.random() * 5) + 1
		gameData.shrineUsed ++
		gameData.souls -= 100
		if (soulRandom == 1) {
			gameData.playerAttackSeconds += 300
			shrinePlayerAttackAlert += 5
		}
		if (soulRandom == 2) {
			gameData.playerHealthSeconds += 300
			shrinePlayerHealthAlert += 5
		}
		if (soulRandom == 3) {
			gameData.enemyAttackSeconds += 300
			shrineEnemyAttackAlert += 5
		}
		if (soulRandom == 4) {
			gameData.enemyHealthSeconds += 300
			shrineEnemyHealthAlert += 5
		}
		if (soulRandom == 5) {
			gameData.coinSeconds += 300
			shrineCoinDropAlert += 5
		}
	}
	display()
	notifications()
}

function shrineMax(){
	for (;gameData.souls >= 100;) {
		var soulRandom = Math.floor(Math.random() * 5) + 1
		gameData.shrineUsed ++
		gameData.souls -= 100
		if (soulRandom == 1) {
			gameData.playerAttackSeconds += 300
			shrinePlayerAttackAlert += 5
		}
		if (soulRandom == 2) {
			gameData.playerHealthSeconds += 300
			shrinePlayerHealthAlert += 5
		}
		if (soulRandom == 3) {
			gameData.enemyAttackSeconds += 300
			shrineEnemyAttackAlert += 5
		}
		if (soulRandom == 4) {
			gameData.enemyHealthSeconds += 300
			shrineEnemyHealthAlert += 5
		}
		if (soulRandom == 5) {
			gameData.coinSeconds += 300
			shrineCoinDropAlert += 5
		}
	}
	display()
	notifications()
}

function shrineTimers(){
	if (gameData.playerAttackSeconds >= 1) {
		gameData.playerAttackSeconds --
		gameData.multiPlayerAttack = 1.5
	} else {
		gameData.multiPlayerAttack = 0
		}
	if (gameData.playerHealthSeconds >= 1) {
		gameData.playerHealthSeconds --
		gameData.multiPlayerHealth = 1.5
	} else {
		gameData.multiPlayerHealth = 0
	}
	if (gameData.enemyAttackSeconds >= 1) {
		gameData.enemyAttackSeconds --
		gameData.multiEnemyAttack = .5
	} else {
		gameData.multiEnemyAttack = 0
		}
	if (gameData.enemyHealthSeconds >= 1) {
		gameData.enemyHealthSeconds --
		gameData.multiEnemyHealth = .5
	} else {
		gameData.multiEnemyHealth = 0
	}
	if (gameData.coinSeconds >= 1) {
		gameData.coinSeconds --
		gameData.coinDrop = .85
	} else {
		gameData.coinDrop = .9
		}
}

function display(){
	document.getElementById("playerHealthBar").setAttribute("style", "width:" + ((gameData.playerCurrentHealth / gameData.playerMaxHealth) * 100) + "%")
	document.getElementById("enemyHealthBar").setAttribute("style", "width:" + ((gameData.enemyCurrentHealth / gameData.enemyMaxHealth) * 100) + "%")
	document.getElementById("enemyLevel").innerHTML = numberformat.formatShort(gameData.enemyLevel)
	document.getElementById("playerHealthBarPercent").innerHTML = numberformat.formatShort(gameData.playerCurrentHealth)
	document.getElementById("enemyHealthBarPercent").innerHTML = numberformat.formatShort(gameData.enemyCurrentHealth)
	document.getElementById("enemyMaxHealth").innerHTML = "Max Health: " + numberformat.formatShort(gameData.enemyMaxHealth)
	document.getElementById("enemyAttack").innerHTML = "Attack: " + numberformat.formatShort(gameData.enemyAttack)
	document.getElementById("playerMaxHealth").innerHTML = "Max Health: " + numberformat.formatShort(gameData.playerMaxHealth)
	document.getElementById("playerAttack").innerHTML = "Attack: " + numberformat.formatShort(gameData.playerAttack)
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
	if (gameData.playerAttackSeconds >= 1) {
		document.getElementById("playerAttackSeconds").innerHTML = "1.5x Player Attack: " + numberformat.formatShort((gameData.playerAttackSeconds + 60) / 60) + " Minutes"
	} else {
		document.getElementById("playerAttackSeconds").innerHTML = ""
	}
	if (gameData.playerHealthSeconds >= 1) {
		document.getElementById("playerHealthSeconds").innerHTML = "1.5x Player Health: " + numberformat.formatShort((gameData.playerHealthSeconds + 60) / 60) + " Minutes"
	} else {
		document.getElementById("playerHealthSeconds").innerHTML = ""
	}
	if (gameData.enemyAttackSeconds >= 1) {
		document.getElementById("enemyAttackSeconds").innerHTML = ".5x Enemy Attack: " + numberformat.formatShort((gameData.enemyAttackSeconds + 60) / 60) + " Minutes"
	} else {
		document.getElementById("enemyAttackSeconds").innerHTML = ""
	}
	if (gameData.enemyHealthSeconds >= 1) {
		document.getElementById("enemyHealthSeconds").innerHTML = ".5x Enemy Health: " + numberformat.formatShort((gameData.enemyHealthSeconds + 60) / 60) + " Minutes"
	} else {
		document.getElementById("enemyHealthSeconds").innerHTML = ""
	}
	if (gameData.coinSeconds >= 1) {
		document.getElementById("coinSeconds").innerHTML = "1.5x Coin Drop rate: " + numberformat.formatShort((gameData.coinSeconds + 60) / 60) + " Minutes"
	} else {
		document.getElementById("coinSeconds").innerHTML = ""
	}
}

function notifications(){
	allChestCan = Math.floor(gameData.coinOne / 1) + Math.floor(gameData.coinTwo / 10) + Math.floor(gameData.coinThree / 100)
	allSoulsCan = Math.floor(gameData.souls / 100)
	if (allChestCan >= 1) {
		document.getElementById("chestNotification").innerHTML = numberformat.formatShort(allChestCan)
	} else {
		document.getElementById("chestNotification").innerHTML = ""
	}
	if (gameData.souls >= 100) {
		document.getElementById("shrineNotification").innerHTML = numberformat.formatShort(allSoulsCan)
	} else {
		document.getElementById("shrineNotification").innerHTML = ""
	}
	if (allChestCan + allSoulsCan >= 1) {
	document.title = "Duel Idle (" + numberformat.formatShort(allChestCan + allSoulsCan) + ")";
	} else {
	document.title = "Duel Idle";
	}
	if (coinOneAlert >= 1) {
		alertify.notify('+' + coinOneAlert + ' Tier 1 Coin!', 'warning', 5, function(){});
		coinOneAlert = 0
	}
	if (coinTwoAlert >= 1) {
		alertify.notify('+' + coinTwoAlert + ' Tier 2 Coin!', 'warning', 5, function(){});
		coinTwoAlert = 0
	}
	if (coinThreeAlert >= 1) {
		alertify.notify('+' + coinThreeAlert + ' Tier 3 Coin!', 'warning', 5, function(){});
		coinThreeAlert = 0
	}
	if (playerAttackAlert >= 1) {
		alertify.notify('+' + playerAttackAlert + ' Attack', 'success', 5, function(){});
		playerAttackAlert = 0
	}
	if (playerHealthAlert >= 1) {
		alertify.notify('+' + playerHealthAlert + ' Health', 'success', 5, function(){});
		playerHealthAlert = 0
	}
	if (playerCritAlert >= 1) {
		alertify.notify('+' + playerCritAlert + '% Crit Chance', 'success', 5, function(){});
		playerCritAlert = 0
	}
	if (playerLifeStealAlert >= 1) {
		alertify.notify('+' + playerLifeStealAlert + '% Life Steal', 'success', 5, function(){});
		playerLifeStealAlert = 0
	}
	if (playerThornsAlert >= 1) {
		alertify.notify('+' + playerThornsAlert + '% Thorns', 'success', 5, function(){});
		playerThornsAlert = 0
	}
	if (playerDodgeAlert >= 1) {
		alertify.notify('+' + playerDodgeAlert + '% Dodge', 'success', 5, function(){});
		playerDodgeAlert = 0
	}
	if (shrinePlayerAttackAlert >= 1) {
		alertify.notify('+' + shrinePlayerAttackAlert + ' Minutes 1.5x Player Attack!', 'success', 5, function(){});
		shrinePlayerAttackAlert = 0
	}
	if (shrinePlayerHealthAlert >= 1) {
		alertify.notify('+' + shrinePlayerHealthAlert + ' Minutes 1.5x Player Health!', 'success', 5, function(){});
		shrinePlayerHealthAlert = 0
	}
	if (shrineEnemyAttackAlert >= 1) {
		alertify.notify('+' + shrineEnemyAttackAlert + ' Minutes .5x Enemy Attack!', 'success', 5, function(){});
		shrineEnemyAttackAlert = 0
	}
	if (shrineEnemyHealthAlert >= 1) {
		alertify.notify('+' + shrineEnemyHealthAlert + ' Minutes .5x Enemy Health!', 'success', 5, function(){});
		shrineEnemyHealthAlert = 0
	}
	if (shrineCoinDropAlert >= 1) {
		alertify.notify('+' + shrineCoinDropAlert + ' Minutes 1.5x Coin Drop!', 'success', 5, function(){});
		shrineCoinDropAlert = 0
	}
}

loadGame()

setInterval(function gameLoop(){
	attack()
	shrineTimers()
	display()
	notifications()
}, 1000);

setInterval(function saveLoop(){
	saveGame()
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
	var answer = confirm("Are you sure?");
	if (answer == true) {
	  //Confirm true code
		localStorage.clear();
		location.reload();
	  console.log("New Game.");
	}else{
	  //confirm false code
	}

}
