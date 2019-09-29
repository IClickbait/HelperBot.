const discord = require("discord.js");
const client = new discord.Client({disableEveryone: true}); 
const { Client, RichEmbed } = require("discord.js");

var userTickets = new Map();

client.login(token);

client.on('ready', () => {
    console.log(client.user.username + " has logged in.");

    client.user.setPresence({
        status: "online",
        game: {
            name: "0xDEADC0DE",
            type: "Playing"
        }
    })
});

client.on("message", async message => {
    const prefix = ">";

    if (message.author.bot) return;
    if (!message.guild) return;
    if (!message.content.startsWith(prefix)) return;

    const args = message.content.slice(prefix.length).trim().split(/ +/g);
    const cmd = args.shift().toLowerCase();

    if (cmd === "ping") {
        const msg = await message.channel.send(`🏓 Pinging....`);
        msg.edit(`🏓 Pong!\nLatency is ${Math.floor(msg.createdAt - message.createdAt)}ms\nAPI Latency is ${Math.round(client.ping)}ms`);
    }

    if (cmd === "say") {
        if (message.deletable) message.delete();

        if (args.length < 0) return message.reply(`Nothing to say?`).then(m => m.delete(5000));
        
        const roleColor = message.guild.me.highestRole.hexColor;

        if (args[0].toLowerCase() === "embed") {
            const embed = new RichEmbed()
                .setDescription(args.slice(1).join(" "))
                .setColor(roleColor === "#000000" ? "#ffffff" :  roleColorv)
                .setTimestamp()
                .setImage(client.user.displayAvatarURL)
                .setAuthor(message.author.username, message.author.displayAvatarURL);

            message.channel.send(embed);
        } else {
            message.channel.send(args.join(" "));
        }
    }
});

client.on('message', message => {
    if(message.author.bot) {
        if(message.embeds.length === 1 && message.embeds[0].description.startsWith('React')) {
            message.react(':ticketreact:625925895013662721')
            .then(msgReaction => console.log('Reacted.'))
            .catch(err => console.log(err));
        }
        if(message.embeds.length === 1 && message.embeds[0].title === 'Ticket Support') {
            message.react(':checkreact:625938016510410772')
            .then(reaction => console.log("Reacted with " + reaction.emoji.name))
            .catch(err => console.log(err));
        }
    };
    if(message.content.toLowerCase() === '>ticketopen' && message.channel.id === '627513768926117888') {
        
        if(userTickets.has(message.author.id) || 
        message.guild.channels.some(channel => channel.name.toLowerCase() === message.author.username + 's-ticket')) {
            message.author.send("You already have a ticket!");
        } 
        else {
            let guild = message.guild;
            guild.createChannel(`${message.author.username}s-ticket`, {
                type: 'text',
                permissionOverwrites: [
                    {
                        allow: 'VIEW_CHANNEL',
                        id: message.author.id
                    },
                    {
                        deny: 'VIEW_CHANNEL',
                        id: guild.id
                    },
                    {
                        allow: 'VIEW_CHANNEL',
                        id: '627513768926117888'
                    }
                ]
            }).then(ch => {
                userTickets.set(message.author.id, ch.id);
            }).catch(err => console.log(err));
        }
    }
    else if(message.content.toLowerCase() === '>ticketclose') {
        if(userTickets.has(message.author.id)) {
            if(message.channel.id === userTickets.get(message.author.id)) {
                message.channel.delete('closing ticket')
                .then(channel => {
                    console.log("Deleted " + channel.name);
                    userTickets.delete(message.author.id);
                })
                .catch(err => console.log(err));
            }
        }
        if(message.guild.channels.some(channel => channel.name.toLowerCase() === message.author.username + 's-ticket')) {
            message.guild.channels.forEach(channel => {
                if(channel.name.toLowerCase() === message.author.username + 's-ticket') {
                    channel.delete().then(ch => console.log('Deleted Channel ' + ch.id))
                    .catch(err => console.log(err));
                }
            });
        }
    }
});
