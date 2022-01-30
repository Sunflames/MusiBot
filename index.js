const Discord = require('discord.js');
const token = require("./token.json");
const prefix = require("./token.json");
const GoogleAPI = require("./token.json");
const client = new Discord.Client({ intents: ["GUILDS", "GUILD_PRESENCES", "GUILD_MESSAGES", "GUILD_VOICE_STATES"]});
const settings = {
    prefix: '!',
    token: 'YourBotTokenHere'
};


const queue = new Map();

client.on("ready", () => {
    console.log ('Gooten Toog is Online!');
    console.log (`The prefix is: ${prefix.prefix}`);
})

const { Player } = require("discord-music-player");
const player = new Player(client, {
    leaveOnEmpty: false
});
client.player = player;


client.login(token.token);


module.exports = {
    name: 'play',
    aliases: ['skip','stop','clear','pause'],  //-------  /*'r',*/ /*'resume',*/ removed due to errors.
    description: 'Advanced music bot',
    async execute(message,args, cmd, client, Discord){
    }
}

const { RepeatMode } = require('discord-music-player');

client.on('messageCreate', async (message) => {
    const args = message.content.slice(settings.prefix.length).trim().split(/ +/g);
    const command = args.shift();
    let guildQueue = client.player.getQueue(message.guild.id);

    if(command === 'play') {
        let queue = client.player.createQueue(message.guild.id);
        await queue.join(message.member.voice.channel);
        let song = await queue.play(args.join(' ')).catch(_ => {
            if(!guildQueue)
                queue.stop();
        });
    }
})
