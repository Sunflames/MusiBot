const {Client, GuildMember, GatewayIntentBits,SlashCommandBuilder} = require('discord.js');
const token = require("./token.json");
const client = new Client({ intents: [ GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent, GatewayIntentBits.GuildMembers, GatewayIntentBits.GuildVoiceStates, GatewayIntentBits.GuildMessageReactions]});
const settings = {prefix: '~'};
const { Player } = require("discord-music-player");
const player = new Player(client, 
    {
    leaveOnEmpty: false, // This options are optional.
});

    client.player = player


client.on("ready", () => {
    console.log("🎶 Gooten Toog Bot is online and kicking! 🎶");
});

client.login(token.token);

const { RepeatMode } = require('discord-music-player');

client.on('messageCreate', async (message) => {
    const args = message.content.slice(settings.prefix.length).trim().split(/ +/);
    let guildQueue = client.player.getQueue(message.guild.id);

    if(!message.content.startsWith(settings.prefix) || message.author.bot) return;

    
else { 
    if (message.content === "!deploy" && message.author.id === client.application?.owner?.id) {
        await message.guild.commands.set([
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
                description: "Skip to the current song"
            },
            {
                name: "stop",
                description: "Stop the player"
            },
        ]);

}
}})
client.on("interactionCreate", async (interaction) => {
    if (!interaction.isCommand() || !interaction.guildId) return;

    if (!(interaction.member instanceof GuildMember) || !interaction.member.voice.channel) {
        return void interaction.reply({ content: "You are not in a voice channel!", ephemeral: true });
    }

    if (interaction.commandName === "play") 
    {
        await interaction.deferReply();
        let queue = client.player.createQueue(interaction.guild);
        await queue.join(interaction.member.voice.channel);
        const query = interaction.options.get("query").value;
        let song = await queue.play(query).catch(err => {
            console.log(err);
            if(!guildQueue)
                queue.stop();
            }
         );
         await interaction.followUp({ content: `Playing the song:${song.url}` })
    }
    
    else if (interaction.commandName === "skip") 
    {
        await interaction.deferReply();
        let guildQueue = client.player.getQueue(interaction.guild);
        if (guildQueue === undefined) return void interaction.followUp({ content: "❌ | No music is being played!" });
        guildQueue.skip();
        await interaction.followUp({ content: `Skipped the song` });
    }

    else if (interaction.commandName === "stop") 
    {
        await interaction.deferReply();
        const queue = player.getQueue(interaction.guildId);
        if (!queue || !queue.playing) return void interaction.followUp({ content: "❌ | No music is being played!" });
        queue.destroy();
        return void interaction.followUp({ content: "🛑 | Stopped the player!" });
    } 

    else
     {
        interaction.reply({
            content: "Unknown command!",
            ephemeral: true
        });
    }



});
