const {
  SlashCommandBuilder,
  ModalBuilder,
  TextInputBuilder,
  ActionRowBuilder,
  TextInputStyle,
} = require("discord.js");
const fs = require("fs");

module.exports = {
  cooldown: 5,
  data: new SlashCommandBuilder()
    .setName("changelog")
    .setDescription("changelog options")
    .addSubcommand((subcommand) =>
      subcommand.setName("new").setDescription("Create a new changelog")
    ),
  async execute(interaction) {
    const subcommand = interaction.options.getSubcommand();
    if (subcommand === "new") {
      const databaseFile = fs.readFileSync("database.json");
      const database = JSON.parse(databaseFile);
      if (!database.changelogChannelId) {
        await interaction.reply({
          content: "Changelog has not been setup yet! please use **/setup**",
          ephemeral: true,
        });
        return;
      }
      const addedInput = new TextInputBuilder()
        .setCustomId("added-input")
        .setLabel("added")
        .setStyle(TextInputStyle.Paragraph)
        .setRequired(false);
      const inprogressInput = new TextInputBuilder()
        .setCustomId("inprogress-input")
        .setLabel("in progress")
        .setStyle(TextInputStyle.Paragraph)
        .setRequired(false);
      const changedInput = new TextInputBuilder()
        .setCustomId("changed-input")
        .setLabel("changed")
        .setStyle(TextInputStyle.Paragraph)
        .setRequired(false);
      const fixedInput = new TextInputBuilder()
        .setCustomId("fixed-input")
        .setLabel("fixed")
        .setStyle(TextInputStyle.Paragraph)
        .setRequired(false);
      const removedInput = new TextInputBuilder()
        .setCustomId("removed-input")
        .setLabel("removed")
        .setStyle(TextInputStyle.Paragraph)
        .setRequired(false);

      const row1 = new ActionRowBuilder().setComponents(addedInput);
      const row2 = new ActionRowBuilder().setComponents(changedInput);
      const row3 = new ActionRowBuilder().setComponents(fixedInput);
      const row4 = new ActionRowBuilder().setComponents(removedInput);
      const row5 = new ActionRowBuilder().setComponents(inprogressInput);

      const modal = new ModalBuilder()
        .setTitle("test")
        .setCustomId("changelog-form")
        .setComponents(row1, row2, row3, row4, row5);

      await interaction.showModal(modal);
    }
  },
};
