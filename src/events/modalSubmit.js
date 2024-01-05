const { Events, EmbedBuilder } = require("discord.js");
const fs = require("fs");

module.exports = {
  name: Events.InteractionCreate,
  async execute(interaction) {
    if (!interaction.isModalSubmit()) return;
    const modalId = interaction.customId;
    if (modalId === "changelog-form") {
      const currentDate = () => new Date(Date.now()).toLocaleDateString();

      const addedInput = interaction.fields.getTextInputValue("added-input");
      const inprogressInput =
        interaction.fields.getTextInputValue("inprogress-input");
      const changedInput =
        interaction.fields.getTextInputValue("changed-input");
      const fixedInput = interaction.fields.getTextInputValue("fixed-input");
      const removedInput =
        interaction.fields.getTextInputValue("removed-input");

      const inputSplit = (input, special) => {
        const lines = input.split("\n");
        let message = "";
        lines.forEach((line) => {
          message += `${special} ${line}\n`;
        });
        return message;
      };

      console.log();

      const embedDescription = () => {
        let message = "";
        if (addedInput) {
          message +=
            "**Added:**\n```ansi\n" + inputSplit(addedInput, "[2;32m[+][0m") + "\n```\n";
        }
        if (changedInput) {
          message +=
            "**Changed:**\n```ansi\n" +
            inputSplit(changedInput, "[2;34m[/][0m") +
            "\n```\n";
        }
        if (fixedInput) {
          message +=
            "**Fixed:**\n```ansi\n" + inputSplit(fixedInput, "[2;36m[!][0m") + "\n```\n";
        }
        if (removedInput) {
          message +=
            "**Removed:**\n```ansi\n" +
            inputSplit(removedInput, "[2;31m[-][0m") +
            "\n```\n";
        }
        if (inprogressInput) {
          message +=
            "**In Progress:**\n```ansi\n" +
            inputSplit(inprogressInput, "[2;33m[*][0m") +
            "\n```\n";
        }
        return message;
      };

      const databaseFile = fs.readFileSync("database.json");
      const database = JSON.parse(databaseFile);

      const embed = new EmbedBuilder()
        .setAuthor({
          name: interaction.user.globalName,
          iconURL: interaction.user.displayAvatarURL(),
        })
        .setTitle(`Changelog - ${currentDate()}`)
        .setDescription(embedDescription())
        .setFooter({
          text: interaction.guild.name,
          iconURL: interaction.guild.iconURL(),
        })
        .setTimestamp()
        .setColor(database.embedColor.slice(1));

      const channel = interaction.client.channels.cache.get(
        database.changelogChannelId
      );
      await channel.send({ embeds: [embed] });
      await interaction.reply({
        content: "Changelog has been sent!",
        ephemeral: true,
      });
    }
  },
};
