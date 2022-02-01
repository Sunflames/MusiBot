const Discord = require('discord.js');
const token = require("./token.json");
const GoogleAPI = require("./token.json");
const client = new Discord.Client({ intents: ["GUILDS", "GUILD_PRESENCES", "GUILD_MESSAGES", "GUILD_VOICE_STATES"]});
const settings = {
    prefix: '~',
};


const { Player } = require("discord-music-player");
const player = new Player(client, 
    {
    leaveOnEmpty: false, // This options are optional.
});

client.player = player
.on('channelEmpty',  (queue) =>
        console.log(`Everyone left the Voice Channel, queue ended.`))
    // Emitted when a song was added to the queue.
    .on('songAdd',  (queue, song) =>
        console.log(`Song ${song} was added to the queue.`))
    // Emitted when a playlist was added to the queue.
    .on('playlistAdd',  (queue, playlist) =>
        console.log(`Playlist ${playlist} with ${playlist.songs.length} was added to the queue.`))
    // Emitted when there was no more music to play.
    .on('queueDestroyed',  (queue) =>
        console.log(`The queue was destroyed.`))
    // Emitted when the queue was destroyed (either by ending or stopping).    
    .on('queueEnd',  (queue) =>
        console.log(`The queue has ended.`))
    // Emitted when a song changed.
    .on('songChanged', (queue, newSong, oldSong) =>
        console.log(`${newSong} is now playing.`))
    // Emitted when a first song in the queue started playing.
    .on('songFirst',  (queue, song) =>
        console.log(`Started playing ${song}.`))
    // Emitted when someone disconnected the bot from the channel.
    .on('clientDisconnect', (queue) =>
        console.log(`I was kicked from the Voice Channel, queue ended.`))
    // Emitted when deafenOnJoin is true and the bot was undeafened
    .on('clientUndeafen', (queue) =>
        console.log(`I got undefeanded.`))
    // Emitted when there was an error in runtime
    .on('error', (error, queue) => {
        console.log(`Error: ${error} in ${queue.guild.name}`);
    });

client.on("ready", () => {
    console.log("Gooten Toog Bot is online and kicking!");
});

client.login(token.token);

const { RepeatMode } = require('discord-music-player');

client.on('messageCreate', async (message) => {
    const args = message.content.slice(settings.prefix.length).trim().split(/ +/);
    const command = args.shift().toLowerCase();
    let guildQueue = client.player.getQueue(message.guild.id);

    if(!message.content.startsWith(settings.prefix) || message.author.bot) return;

    // Commands parameters below:
/* ___________________________________________________________________________________________________________________________ */

switch(command){
    //Play
    case ('play'): 
    {
        if (!args.length) return message.reply(' You need to send the second argument!');
        if (!message.member.voice.channel) return message.reply(' You need to be in a channel to execute this command!');
        const permissions = message.member.voice.channel.permissionsFor(message.client.user);
        if (!permissions.has('CONNECT')) return message.reply(' You dont have the correct permissins');
        if (!permissions.has('SPEAK')) return message.reply(' You dont have the correct permissins');
        let queue = client.player.createQueue(message.guild.id);
        await queue.join(message.member.voice.channel);
        if (args.indexOf("playlist") > -1) {
            let song = await queue.playlist(args.join(' ')).catch(_ => 
                {
                if(!guildQueue)
                    queue.stop();
                });
            await message.reply(`Now playing the playlist: ${song}`);
            break;
        }
        else
        {
        let song = await queue.play(args.join(' ')).catch(_ => {
            if(!guildQueue)
                queue.stop();
        });
        await message.reply(`Now playing the song: ${song}`);
        break;
        }
    }


    //Playlist
    case ('playlist'):
    {
        if (!args.length) return message.reply(' You need to send the second argument!');
        if (!message.member.voice.channel) return message.reply(' You need to be in a channel to execute this command!');
        const permissions = message.member.voice.channel.permissionsFor(message.client.user);
        if (!permissions.has('CONNECT')) return message.reply(' You dont have the correct permissins');
        if (!permissions.has('SPEAK')) return message.reply(' You dont have the correct permissins');
        let queue = client.player.createQueue(message.guild.id);
        await queue.join(message.member.voice.channel);
        let song = await queue.playlist(args.join(' ')).catch(_ => {
            if(!guildQueue)
                queue.stop();
        }
        );
        await message.reply(`Now playing: ${playlist.url}`);
        break;
    }


    case ('skip'):
    {
            if (guildQueue === undefined) return await message.reply(`No song to skip.`);
        await message.reply(`Skipping song!`);
        guildQueue.skip();
        break;
    }



    case ('stop'):
    {
          if (guildQueue === undefined) return await message.reply(`No song to stop.`);
        guildQueue.stop();
        await message.reply(`Stopping current queue.`);
        break;
    }



    case ('stoploop'):
    {
          if (guildQueue === undefined) return await message.reply(`No song to loop.`);
        await message.reply(`Stopping song loop.`);
        guildQueue.setRepeatMode(RepeatMode.DISABLED);
        break;
    }



    case ('loop'):
    {
           if (guildQueue === undefined) return await message.reply(`No song to loop.`);
        guildQueue.setRepeatMode(RepeatMode.SONG);
        await message.reply(`looping song.`);
        break;
    }



    case ('queueloop'):
    {
            if (guildQueue === undefined) return await message.reply(`No queue to loop.`);
        guildQueue.setRepeatMode(RepeatMode.QUEUE);
        await message.reply(`Looping current queue.`);
        break;
    }



    case ('seek'):
    {
          if (guildQueue === undefined) return await message.reply(`No song to seek.`);
        guildQueue.seek(parseInt(args[0]) * 1000);
        await message.reply(`Seeking current song.`);
        break;
    }



    case ('clearqueue'):
    {
           if (guildQueue === undefined) return await message.reply(`No queue to clear.`);
        guildQueue.clearQueue();
        await message.reply(`Emptying queue.`);
        break;
    }



    case ('shuffle'):
    {
          if (guildQueue === undefined) return await message.reply(`No queue to shuffle.`);
        guildQueue.shuffle();
        await message.reply(`Everybody's shuffling... the queue.`);
        break;
    }



    case ('showqueue'):
    {
         if (guildQueue === undefined) return await message.reply(`No queue to show.`);
        await message.reply(`The queue is: ` + guildQueue);
        console.log(guildQueue);
        break;
    }



    case ('pause'):
    {
          if (guildQueue === undefined) return message.reply(`Nothing is playing!`);
        guildQueue.setPaused(true);
        await message.reply(`Pausing current song.`);
        break;
    }



    case ('resume'):
    {
         if (guildQueue === undefined) return message.reply(`Nothing is playing!`);
    if (guildQueue.setPaused) return ("Already paused current song!");
        await message.reply(`Resuming!`);
        guildQueue.setPaused(false);
        break;
    }



    case ('remove'):
    {
        if (guildQueue === undefined) return message.reply(`Nothing is playing!`);
        await message.reply(`Removing songs!`);
        guildQueue.remove(parseInt(args[0]));
        break;
    }
}
});