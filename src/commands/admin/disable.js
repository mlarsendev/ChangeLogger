const {
  SlashCommandBuilder,
  ChannelType,
  PermissionFlagsBits,
  PermissionsBitField,
} = require("discord.js");
const fs = require("fs");

module.exports = {
  cooldown: 5,
  data: new SlashCommandBuilder()
    .setName("disable")
    .setDescription("remove the bot setup"),
  async execute(interaction) {
    if (
      !interaction.member.permissions.has(PermissionsBitField.Flags.ManageGuild)
    ) {
      await interaction.reply({
        content: "You need the 'Manage Server' permission to do this!",
        ephemeral: true,
      });
    }
    try {
      const data = fs.readFileSync("database.json");
      const database = JSON.parse(data);
      if (database.changelogChannelId === "") {
        await interaction.reply({
          content: "Changelog has already been disabled",
          ephemeral: true,
        });
        return;
      }
      const channelData = {
        changelogChannelId: "",
        embedColor: "",
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
      content: "Changelog has been disabled",
      ephemeral: true,
    });
  },
};
