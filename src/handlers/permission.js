class PermissionLevel {

  fetch(client, message) {
    if (!message.author || !message.member) return [0, "Guild Member"];

    if (client.config.discord.owner === message.author.id)
      return [
        client.constants.perms.dev,
        "Developer"
      ];

    const gSettings = client.db.settings.get(message.guild.id);
    if (gSettings['staffrole'] && message.member.roles.some(r => r.id === gSettings['staffrole']))
      return [
        client.constants.perms.staff,
        "Staff"
      ];

    return [client.constants.perms.user, "Guild Member"];
  }
}

module.exports = PermissionLevel;