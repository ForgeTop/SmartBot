const mineflayer = require('mineflayer')
const translate = require('translate')
const readline = require('readline')
const { stdin: input, stdout: output } = require('process')
const fs = require('fs')

const config = fs.readFileSync('config.txt', 'utf8').toString().split('\n')
const botNickname = config[0].replace('\r', '').substr(9)
const password = config[1].replace('\r', '').substr(9)
const serverIp = config[2].replace('\r', '').substr(9)
let mode = config[3].replace('\r', '').substr(5)

const bot = mineflayer.createBot({
    host: serverIp,
    username: botNickname
})

let msgRepitition = null
let mRepTranslate = 'off'
let autoTranslate = 'off'
let joinResponseMsg = null

const rl = readline.createInterface({ input, output })
rl.on('line', (input) => {
	if(input == 'help'){
		console.log(' mRep <ник> — Повторение сообщений за игроком. (не на всех работает)')
		console.log(' autoTranslate <en|de|fr|uk> — Авто-Перевод сообщений.')
		console.log(' mRepTranslate <en|de|fr|uk> — Авто-Перевод сообщений для команды mRep.')
		console.log(' joinResp <сообщение> — Ответ на заход игрока. ({player} заменяется на ник игрока)')
		console.log(' joinBack — Зайти обратно на выживание если бота кикнули и тд.')
		return
	}
	if(input.startsWith('mRep ')){
		let nickname = input.substr(5)
		if(nickname == 'off') {
			msgRepitition = null
			console.log('[SmartBot] Повторение сообщений за игроками выключено.')
			return
		} else {
			msgRepitition = nickname
			console.log('[SmartBot] Повторение сообщений за игроками установлено на ' + nickname + '!')
			return
		}
	}
	if(input.startsWith('mRepTranslate ')){
		mRepTranslate = input.substr(14)
		if(mRepTranslate == 'off'){
			console.log('[SmartBot] Авто-Перевод для команды mRep выключен.')
			return
		}
		console.log('[SmartBot] Авто-Перевод для команды mRep установлен на ' + mRepTranslate + '.')
		return
	}
	if(input.startsWith('autoTranslate ')){
		autoTranslate = input.substr(14)
		if(autoTranslate == 'off'){
			console.log('[SmartBot] Авто-Перевод сообщений выключен.')
			return
		}
		console.log('[SmartBot] Авто-Перевод сообщений установлен на ' + autoTranslate + '.')
		return
	}
	if(input.includes('joinBack')){
		bot.activateItem(false)
		return
	}
	if(input.startsWith('joinResp ')){
		input = input.toString().substr(9)
		if(input == 'off'){
			joinResponseMsg = null
			console.log('[!] Авто-Ответчик на заходы выключен.')
			return
		}
		joinResponseMsg = input.toString()
		console.log('[SmartBot] Будет писаться: ' + joinResponseMsg)
		return
	}
	if(autoTranslate == 'off'){
		bot.chat(input)
	} else {
		sendTranslatedMsg(input, autoTranslate, false)
	}
})

bot.once('spawn', function(){
	if(!fs.existsSync('notfirstlaunch')){
		let createFile = fs.createWriteStream('notfirstlaunch')
		createFile.end()
		console.log('-------------------------------------------------------------------------------')
		console.log('                              Команды для бота:')
		console.log('mRep <ник> — Повторение сообщений за игроком. (не на всех работает)')
		console.log('autoTranslate <en|de|fr|uk> — Авто-Перевод сообщений.')
		console.log('mRepTranslate <en|de|fr|uk> — Авто-Перевод сообщений для команды mRep.')
		console.log('joinResp <сообщение> — Ответ на заход игрока. ({player} заменяется на ник игрока)')
		console.log('joinBack — Зайти обратно на выживание если бота кикнули и тд.')
		console.log('                                   Удачи!')
		console.log('-------------------------------------------------------------------------------')
	}
    setTimeout(() => {
        bot.chat('/reg ' + password)
		bot.chat('/l ' + password)
        setTimeout(() => {
            bot.activateItem(false)
        }, 5000)
    }, 1500)
})
bot.on('message', (message) => {
    let msg = message.getText().toString()
    let arr = msg.split(' ')
    console.log(msg)
    if(msg.includes('→') && !msg.includes('->')){
        let nickname = findNickname(msg)
		let msgg = findMsg(msg)
		if(msgRepitition != null && msgRepitition == nickname && !msgg.includes('явля') && !msgg.includes('проект')){
			sendTranslatedMsg(msgg, mRepTranslate, true)
			return
		}
	}
	if(msg.includes(' Игрок ') && !msg.includes('| Игрок ') && !msg.includes('→') && !msg.includes('->') && !msg.includes('АнтиЧит')){
		if(joinResponseMsg == null) return
		msg = msg.substr(4)
		arr = msg.split(' ')
		let nickname = arr[2]
		bot.chat(joinResponseMsg.replace('{player}', nickname))
		return
	}
})
bot.on('windowOpen', (window) => {
	let modee = 0;
	if(mode == 'epsilon') modee = 10
	if(mode == 'yota') modee = 11
	if(mode == 'delta') modee = 12
	if(mode == 'sigma') modee = 13
	if(mode == 'alpha') modee = 14
	if(mode == 'beta') modee = 15
	if(mode == 'gamma') modee = 16
	if(mode == 'omega') modee = 21
	if(mode == 'hydra') modee = 22
	if(mode == 'omicron') modee = 23
	if(modee == 0) {
		console.log('ВНИМАНИЕ: Бот выключился, поскольку в конфиге введено неккоректное название выживания: ' + mode + '.')
		bot.quit()
		return
	}
    bot.clickWindow(modee, 0, 0)
})

function findNickname(msg){
	let arr = msg.split(' ')
	if(arr[1].includes('[') && !arr[2].includes('[')) return arr[2]
	if(arr[2].includes('[') && !arr[3].includes('[')) return arr[3]
	if(arr[3].includes('[') && !arr[4].includes('[')) return arr[4]
	if(arr[4].includes('[') && !arr[4].includes('[')) return arr[5]
	return null
}
function findMsg(msg){
	const splt = msg.split('→')
	msg = splt[1]
	if(msg.startsWith(' ')) msg = msg.substr(1)
	return msg
}
async function sendTranslatedMsg(msg, lang, withExclamationMark){
	translate.engine = 'google'
	translate.from = 'ru'
	if(!lang.startsWith('en') && !lang.startsWith('de') && !lang.startsWith('fr') && !lang.startsWith('uk') && !lang.startsWith('off')) lang == 'off'
	let text = msg
	if(lang != 'off') text = await translate(msg, lang)
	if(withExclamationMark) bot.chat('!' + text)
	else bot.chat(text)
	return
}

bot.on('kicked', (reason, loggedIn) => console.log(reason.getText(), loggedIn.getText()))

