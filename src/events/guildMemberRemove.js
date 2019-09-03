const Event = require('../structures/event.js');
const moment = require('moment');
const { MessageEmbed } = require('discord.js');

module.exports = class extends Event {
  constructor(client) {
    super(client, {
      name: "guildMemberRemove"
    });
  }

  async execute(ctx = null) {
    const guild = ctx.guild;
    
    let detChan = this.client.db.detention.get(`${guild.id}-${ctx.user.id}`);
    if (!detChan) return;
    detChan = guild.channels.get(detChan);
    
    const gSettings = this.client.db.settings.get(guild.id);

    if (gSettings['logschannel'] && guild.channels.get(gSettings['logschannel'])) {
      const logsChan = guild.channels.get(gSettings['logschannel']);

      let detChanMsg = await this.client.getChanMsg(detChan);
      detChanMsg = detChanMsg
        .map(m => `${moment(m.createdAt).format("dddd MMMM Do, YYYY, hh:mm A")} | ${m.author.tag} (${m.author.id}):\n${m.content}`)
        .join("\n\n=-= =-= =-= =-= =-=\n\n");

      const embed = new MessageEmbed()
        .setAuthor(`${ctx.user.tag} (${ctx.user.id})`, ctx.user.displayAvatarURL())
        .setDescription("Detention Ended (User Left/Banned)")
        .addField("Hastebin Link", await this.client.hastebin(detChanMsg), false);

      logsChan.send({ embed });
    }

    detChan.delete();
    this.client.db.detention.delete(`${guild.id}-${ctx.user.id}`);
    this.client.db.tempModActions.delete(`${guild.id}-${ctx.user.id}`);

  }
};