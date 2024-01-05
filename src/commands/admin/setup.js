const {
  SlashCommandBuilder,
  ChannelType,
  PermissionsBitField,
} = require("discord.js");
const fs = require("fs");

module.exports = {
  cooldown: 5,
  data: new SlashCommandBuilder()
    .setName("setup")
    .setDescription("Setup the bot")
    .addChannelOption((option) =>
      option
        .addChannelTypes(ChannelType.GuildText)
        .setName("channel")
        .setDescription("The channel to send changelogs")
        .setRequired(true)
    )
    .addStringOption((option) =>
      option
        .setName("color")
        .setDescription("Hex color (#ff0000, #00ff00, #0000ff)")
        .setMinLength(7)
        .setMaxLength(7)
        .setRequired(true)
    ),
  async execute(interaction) {
    if (
      !interaction.member.permissions.has(PermissionsBitField.Flags.ManageGuild)
    ) {
      await interaction.reply({
        content: "You need the 'Manage Server' permission to do this!",
        ephemeral: true,
      });
    }
    const channel = interaction.options.getChannel("channel");
    const color = interaction.options.getString("color");

    try {
      const data = fs.readFileSync("database.json");
      const database = JSON.parse(data);
      if (database.changelogChannelId) {
        await interaction.reply({
          content: "Changelog has already been setup",
          ephemeral: true,
        });
        return;
      }
      const channelData = {
        changelogChannelId: channel.id,
        embedColor: color,
      };
      const sendData = JSON.stringify(channelData);
      fs.writeFile("database.json", sendData, (error) => {
        if (error) {
          console.error(error);

          throw error;
        }
      });
    } catch (error) {
      console.error(error);

      throw error;
    }

    await interaction.reply({
      content: "Changelog has been setup",
      ephemeral: true,
    });
  },
};
