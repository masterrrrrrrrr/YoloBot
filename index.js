require('dotenv').config()
const { PREFIX, TOKEN } = process.env

const Discord = require('discord.js');
const puppeteer = require('puppeteer');

const bot = new Discord.Client();

bot.login(TOKEN);

bot.on('ready', () => {
    console.log(`Logged in as ${bot.user.tag}!`)
});

bot.on('message', async (message) => {
    if (!message.content.startsWith(PREFIX)) return;

    let args = message.content.substring(PREFIX.length).split(" ");
    let command = args[0].toLowerCase()

    const filter = m => m.author.id === message.author.id;

    if (command === 'yolo') {
        message.channel.send(`Please give me the yolo id.`)
        message.channel.awaitMessages(filter, { max: 1 }).then(id => {
            message.channel.send(`Please give me the desired title message.`);
            message.channel.awaitMessages(filter, { max: 1 }).then(title => {
                message.channel.send(`Please give me the desired message to send.`)
                message.channel.awaitMessages(filter, { max: 1 }).then(async desiredMessage => {
                    message.channel.send(`Sending...`)
                    let url = `https://onyolo.com/m/${id.first().content}?w=${title.first().content}`
                    const browser = await puppeteer.launch()
                    const page = await browser.newPage()
                    await page.goto(url, { waitUntil: 'networkidle2' })
                    await page.type('textarea[name=text]', `${desiredMessage.first().content}`, { delay: 20 }).catch(async () => {
                        await browser.close()
                        await message.channel.send(`Couldn't find yolo...`)
                    });
                    await page.setDefaultNavigationTimeout(0);
                    await page.click('#send-button')
                    await page.waitForNavigation({ waitUntil: 'networkidle2' })
                    await browser.close()
                })
            })
        })
    }
});
