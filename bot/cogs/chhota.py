from discord.ext import commands
import discord
import requests
import random  
import string  
import urllib3
import html

# for random string if no short link is provided
def Upper_Lower_string(length):
    result = ''.join((random.choice(string.ascii_lowercase) for x in range(length))) # run 
    return result

class Startup(commands.Cog):

    def __init__(self, bot):
        self.bot = bot

    @commands.command(aliases=['karde'])
    async def _karde(self, ctx, link, short=None):
        try:
            requests.get(link) #test if the given URL is valid, the url exceptions below handle the error
            url="https://chhotakarde.ga/shortUrls"
            if not short:
                while True: #generate random short links until a valid one is found
                    random_string = Upper_Lower_string(7)
                    short = random_string
                    form_data = {'fullUrl':link, 'shortUrl' : short}
                    r = requests.post(url,data=form_data)
                    if html.unescape(r.text) != 'short url already exists':
                        embed = discord.Embed(title=f"Here's your freshly"
" cooked URL", description=f'https://chhotakarde.ga/{short}', color=discord.Color.blurple())
                        await ctx.send(embed=embed)
                        break
            else: #uses the given short url
                form_data = {'fullUrl':link, 'shortUrl' : short}
                r = requests.post(url,data=form_data)
                if html.unescape(r.text) == 'short url already exists': # existing short url check
                    embed = discord.Embed(title='The given short link already exists', color=discord.Color.red())
                    await ctx.send(embed=embed)
                else:
                    embed = discord.Embed(title=f"Here's your freshly"
        " cooked URL", description=f'https://chhotakarde.ga/{short}', color=discord.Color.blurple())
                    await ctx.send(embed=embed)
        except requests.ConnectionError:
            embed = discord.Embed(title='The given parameter is not an active/working domain', color=discord.Color.red())
            await ctx.send(embed=embed)
        except urllib3.exceptions.LocationParseError:
            embed = discord.Embed(title='The given parameter is not a valid URL', color=discord.Color.red())
            await ctx.send(embed=embed)
        except requests.exceptions.InvalidURL:
            embed = discord.Embed(title='The given parameter is not a valid URL', color=discord.Color.red())
            await ctx.send(embed=embed)
        except requests.exceptions.MissingSchema:
            embed = discord.Embed(title='The given parameter is not a valid URL', color=discord.Color.red())
            await ctx.send(embed=embed)
        

def setup(bot):
    bot.add_cog(Startup(bot))