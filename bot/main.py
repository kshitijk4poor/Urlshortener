
import random
import discord
from discord.ext import commands
from threading import Thread
import asyncio

### keeps repl alive --> cheap method
def alive():
    while True:
        print(1453+34534)
        asyncio.sleep(30)

thr = Thread(target=alive)
thr.start
####

bot = commands.Bot(command_prefix="chhota ")
bot.remove_command('help')
bot.load_extension('cogs.chhota')

@bot.event
async def on_ready():
    await bot.change_presence(activity=discord.Activity(type=discord.ActivityType.listening, name="chhota karde"))
    print('bot is ready')

token = 'ODk3MzQwMjkzMjE5NzcwNDI4.YWUPRQ.qFvN-lNRYWhv0Eo91V7Uj6Mt8qA'
bot.run(token)
