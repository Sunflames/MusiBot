

const {Client, GuildMember, GatewayIntentBits, SlashCommandBuilder, REST, Routes} = require('discord.js');
const {clientId, token} = require("./token.json");
const client = new Client({ intents: [ GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent, GatewayIntentBits.GuildMembers, GatewayIntentBits.GuildVoiceStates, GatewayIntentBits.GuildMessageReactions]});
const { Player } = require("discord-music-player");
const player = new Player(client, 
    {
    leaveOnEmpty: false, // This options are optional.
});

    client.player = player


client.on("ready", () => {
    console.log("🎶 Gooten Toog Bot is online and kicking! 🎶");
});

client.login(token);
const { RepeatMode } = require('discord-music-player');

//----------------------------------------------------------------------------------------------------

  //----Disabled for security, no need to initiate bot from tilde commands anymore.------
/*client.on('messageCreate', async (message) => {
    const args = message.content.slice(settings.prefix.length).trim().split(/ +/);
    if(!message.content.startsWith(settings.prefix) || message.author.bot) return;
    
  if (message.content === "!deploy") { */

//----------------------------------------------------------------------------------------------------




  const commands = [
            {
                name: "play",
                description: "Plays a song from youtube",
                options: [
                    {
                        name: "query",
                        type: 3,
                        description: "The song you want to play",
                        required: true
                    }
                ]
            },
            {
                name: "skip",
                description: "Skip the current song"
            },
            {
                name: "stop",
                description: "Stop the player completely"
            },
            {
                name: "end",
                description: "Ends the current queue as a whole"
            },
            {
                name: "loop",
                description: "Loops current song"
            },
            {
                name: "pause",
                description: "Pause the current song"
            },
            {
                name: "resume",
                description: "Unpauses the current song"
            },
            {
                name: "queue-loop",
                description: "Loops the entire queue of songs"
            },
            {
                name: "remove",
                description: "Removes a song from the queue",
                options: [
                    {
                        name: "number",
                        type: 4,
                        description: "Remove spesific song number from queue",
                        required: true
                    }
                ]
            },
            {
                name: "seek",
                description: "Move to a certain second on current song",
                options: [
                    {
                        name: "seconds",
                        type: 4,
                        description: "Goes to the spesific time in seconds of the song",
                        required: true
                    }
                ]
            },
            {
                name: "set-volume",
                description: "Set the volume of the player",
                options: [
                    {
                        name: "volume",
                        type: 4,
                        description: "Sets the volume to number mentioned",
                        required: true
                    }
                ]
            },

            //disabled for now.
            /*{
                name: "show-queue",
                description: "List the current queue of songs"
            },*/

            
            {
                name: "shuffle",
                description: "Shuffle the queue of songs"
            },
            {
                name: "stop-loop",
                description: "Stops the looping of current queue of songs"
            },
        
        ]
        const rest = new REST().setToken(token);
        (async () => {
            try {
                console.log(`Started refreshing ${commands.length} application (/) commands.`);
                const data = await rest.put(
                    Routes.applicationCommands(clientId),
                    { body: commands },
                );
                console.log(`Successfully reloaded ${data.length} application (/) commands.`);
            } catch (error) {
                console.error(error);
            }
        })();

client.on("interactionCreate", async (interaction) => {
    if (!interaction.isCommand() || !interaction.guildId) return;

    if (!(interaction.member instanceof GuildMember) || !interaction.member.voice.channel) {
        return void interaction.reply({ content: "You are not in a voice channel!", ephemeral: true });
        
    }
switch(interaction.commandName){
    case 'play' :
    {
        await interaction.deferReply();
        let queue = client.player.createQueue(interaction.guild);
        await queue.join(interaction.member.voice.channel);
        const query = interaction.options.get("query").value;
        if (query.includes("playlist"))
        {
            let song = await queue.playlist(query).catch(err => {
                console.log(err);
                if(!guildQueue)
                    queue.stop();
             }
            );
            await interaction.followUp({content: `**Playing the song:** ${song.url}`})
            setTimeout(() => interaction.deleteReply(), 15000);
            break;
        }

        else
        {
        let song = await queue.play(query).catch(err => {
            console.log(err);
            if(!guildQueue)
                queue.stop();
            }
         );
         await interaction.followUp({content: `**Playing the song:** ${song.url}`})
         setTimeout(() => interaction.deleteReply(), 15000);
         break;
        }
    }
    case 'skip' :
    {
        await interaction.deferReply();
        let guildQueue = client.player.getQueue(interaction.guild);
        if (guildQueue === undefined) return void interaction.reply({ content: "**No song is being played!**", ephemeral: true });
        await interaction.followUp({ content: `**Skipping the song:** ${guildQueue.nowPlaying}`});
        guildQueue.skip();
        setTimeout(() => interaction.deleteReply(), 15000);
        break;
    }

    case 'stop' :
    {
        await interaction.deferReply();
        let guildQueue = client.player.getQueue(interaction.guild);
        if (guildQueue === undefined) return void interaction.reply({ content: "**No song is being played!**", ephemeral: true });
        guildQueue.stop();
        await interaction.followUp({content: "**Stopped the player!**"});
        setTimeout(() => interaction.deleteReply(), 15000);
        break;
    } 
    case 'set-volume' :
    {
        await interaction.deferReply();
        let guildQueue = client.player.getQueue(interaction.guild);
        if (guildQueue === undefined) return void interaction.reply({ content: "**No song is being played!**", ephemeral: true });
        guildQueue.setVolume(interaction.options.get("volume").value);
        await interaction.followUp({content: `**Set the volume to:** ${interaction.options.get("volume").value}`});
        setTimeout(() => interaction.deleteReply(), 15000);
        break;
     } 
    case 'end' :
    {
            await interaction.deferReply();
        let guildQueue = client.player.getQueue(interaction.guild);
        if (guildQueue === undefined) return void interaction.reply({ content: "**No song is being played!**", ephemeral: true });
        guildQueue.stop();
        await interaction.followUp({content: "**Ended the player!**"});
        setTimeout(() => interaction.deleteReply(), 15000);
        break;
    } 
    case 'stop-loop' :
    {
            await interaction.deferReply();
        let guildQueue = client.player.getQueue(interaction.guild);
        if (guildQueue === undefined) return void interaction.reply({ content: "**No song is being played!**", ephemeral: true });
        guildQueue.setRepeatMode(RepeatMode.DISABLED);
        await interaction.followUp({content: "**Stopped the looping song!**"});
        setTimeout(() => interaction.deleteReply(), 15000);
        break;
    }
    case 'loop' :
    {
            await interaction.deferReply();
        let guildQueue = client.player.getQueue(interaction.guild);
        if (guildQueue === undefined) return void interaction.reply({ content: "**No song is being played!**", ephemeral: true });
        guildQueue.setRepeatMode(RepeatMode.SONG);
        await interaction.followUp({content: "**Looping current song!**"});
        setTimeout(() => interaction.deleteReply(), 15000);
        break;
    }  
    case 'queue-loop' :
    {
            await interaction.deferReply();
        let guildQueue = client.player.getQueue(interaction.guild);
        if (guildQueue === undefined) return void interaction.reply({ content: "**No song is being played!**", ephemeral: true });
        guildQueue.setRepeatMode(RepeatMode.QUEUE);
        await interaction.followUp({content: "**Looping entire queue!**"});
        setTimeout(() => interaction.deleteReply(), 15000);
        break;
    }  
    case 'seek' :
    {
            await interaction.deferReply();
        let guildQueue = client.player.getQueue(interaction.guild);
        if (guildQueue === undefined) return void interaction.reply({ content: "**No song is being played!**", ephemeral: true });
        guildQueue.seek(interaction.options.get("seconds").value * 1000);
        await interaction.followUp({content: `**Seeking to:** ${interaction.options.get("seconds").value * 1000}`});
        setTimeout(() => interaction.deleteReply(), 15000);
        break;
    }
    case 'clear-queue' :
    {
            await interaction.deferReply();
        let guildQueue = client.player.getQueue(interaction.guild);
        if (guildQueue === undefined) return void interaction.reply({ content: "**No song is being played!**", ephemeral: true });
        guildQueue.clearQueue();
        await interaction.followUp({content: `**Clearing the queue!**`});
        setTimeout(() => interaction.deleteReply(), 15000);
        break;
    }
    case 'shuffle' :
    {
           await interaction.deferReply();
        let guildQueue = client.player.getQueue(interaction.guild);
        if (guildQueue === undefined) return void interaction.reply({ content: "**No song is being played!**", ephemeral: true });
        guildQueue.shuffle();
        await interaction.followUp({content: `**Everybody's shuffling... the queue.**`});
        setTimeout(() => interaction.deleteReply(), 15000);
        break;
    }

    //----------------------------------------------------------------------------------------------------


    //disabled due to issue showing allocated queue per server, inputs all at once.

    /* case 'show-queue' :
    {
            await interaction.deferReply();
        let guildQueue = client.player.getQueue(interaction.guild);
        if (guildQueue === undefined) return void interaction.reply({ content: "**No song is being played!**", ephemeral: true });
        const slicedString = guildQueue.song(0, 1999);
        await interaction.followUp({content: `**The queue is: ${slicedString}**`});
        setTimeout(() => interaction.deleteReply(), 15000);
        break;
    }*/

    //----------------------------------------------------------------------------------------------------


    case 'pause' :
    {
            await interaction.deferReply();
        let guildQueue = client.player.getQueue(interaction.guild);
        if (guildQueue === undefined) return void interaction.reply({ content: "**No song is being played!**", ephemeral: true });
        //if (guildQueue.setPaused(true)) return void interaction.reply({ content: "**Already paused this song!**", ephemeral: true });
        guildQueue.setPaused(true);
        await interaction.followUp({content: `**Pausing Current song!**`});
        setTimeout(() => interaction.deleteReply(), 15000);
        break;
    }
    case 'resume' :
    {
            await interaction.deferReply();
        let guildQueue = client.player.getQueue(interaction.guild);
        if (guildQueue === undefined) return void interaction.reply({ content: "**No song is being played!**", ephemeral: true });
        //if (guildQueue.setpaused(false)) return void interaction.reply({ content: "**Song is already playing!**", ephemeral: true });
        guildQueue.setPaused(false);
        await interaction.followUp({content: `**Unpausing Current song!**`});
        setTimeout(() => interaction.deleteReply(), 15000);
        break;
    }
    case 'remove' :
    {
            await interaction.deferReply();
        let guildQueue = client.player.getQueue(interaction.guild);
        if (guildQueue === undefined) return void interaction.reply({ content: "**No song is being played!**", ephemeral: true });
        guildQueue.remove(interaction.options.get("number").value);
        await interaction.followUp({content: `**removing song number:** ${interaction.options.get("number").value} **from the list!**`});
        setTimeout(() => interaction.deleteReply(), 15000);
        break;
    }


}});
