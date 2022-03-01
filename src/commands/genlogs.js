const { Document, Paragraph, Packer, TextRun } = require("docx");
const FS = require("fs");

const Embed = require("../templates/embeds.js");

function generateDocs(Bot)
{
    let commits = [];
    Bot.store.git.forEach((commit, key) => {
        const repo = key.split(";").pop();
        commits.push(`${commit.name} committed in ${repo} on ${commit.date}.\n${commit.message}.\n${commit.url}`);
    });

    const doc = new Document({
        sections: [{
            properties: {},
            children: [
                new Table({
                    rows: commits
                })
            ]
        }]
    });

    Packer.toBuffer(doc).then((buffer)=> {
        FS.writeFileSync("Test Doc.docx", buffer);
    })
}

module.exports = {
    name : "genlogs",
    desc : "Generate the document logs",
    longdesc : "Generate document logs for the cached commits, upload them to discord",
    examples : [
        { name: "Generate document logs", value: "`$genlogs`" },
        { name: "Upload the generated document logs", value: "`$genlogs upload`" }
    ],
    visible : true,

    Run(Bot, args, message) {
        generateDocs(Bot);
        const embed = Embed.SimpleEmbed("Generated docs", "Saved internally");
        if (args.length <= 0) { message.reply({ embeds: [embed] }); return; }

        switch (args[0].toLowerCase())
        {
            case "upload":
            case "up":
                message.channel.send({files: ["./Test Doc.docx"]});
            break;
        }
    }

}