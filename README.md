# SmartBot
A smart bot for MineBlaze server survival modes with the ability to repeat player messages, responses to player joins and auto-translations

Бот создан и работает на Node js, на библиотеке mineflayer.

Прежде чем запустить бота, нужно зайти в config.txt и
поставить ник и пароль боту.
```nickname=
password=
serverIp=mc.mineblaze.su
mode=yota

# epsilon yota delta sigma apha beta
# gamma omega hydra omicron```
Как вы  можете заметить, поля nickname и password пусты.
Это сделано специально чтобы не допустить по случайности
передачи аккаунта.

И так, когда вы заполнили эти 2 поля в файле config.txt,
давайте запустим бота. Для этого запускаем ```run.bat```.
В консоли бота вы можете видеть сообщения из чата, а также
отправлять сообщения и выполнять команды от ника бота.

Конечно-ж при первом старте бота вам выдастся в консоли
инструкция по командам, но всё же давайте их тут разберём:
```autoTranslate <en|de|fr|uk>``` — автоматический перевод сообщений,
