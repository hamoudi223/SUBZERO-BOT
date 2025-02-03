const { Storage } = require('megajs'); // Import the Storage class from megajs
const { cmd } = require('../command'); // Assuming you have a command handler

cmd({
    pattern: "library", // Command trigger
    alias: ["lib", "subzero"], // Aliases
    use: '.library', // Example usage
    react: "📚", // Emoji reaction
    desc: "Access the SubZero Library.", // Description
    category: "utility", // Command category
    filename: __filename // Current file name
},

async (conn, mek, m, { from, reply, senderNumber }) => {
    try {
        // Welcome message
        await reply("Welcome to SubZero Library! To proceed, type `showlibrary`.");

    } catch (error) {
        console.error("Error:", error); // Log the error
        reply("*Error: Unable to initialize the library. Please try again later.*");
    }
});

cmd({
    pattern: "showlibrary", // Command trigger
    alias: ["showlib", "listbooks"], // Aliases
    use: '.showlibrary', // Example usage
    react: "📂", // Emoji reaction
    desc: "List all files in the SubZero Library.", // Description
    category: "utility", // Command category
    filename: __filename // Current file name
},

async (conn, mek, m, { from, reply, senderNumber }) => {
    try {
        const username = "gardinastu@gufum.com"; // Your Mega.nz username
        const password = "darrell123"; // Your Mega.nz password

        // Authenticate with Mega.nz using the Storage class
        const storage = await new Storage({
            email: username,
            password: password,
            userAgent: 'Mozilla/5.0' // Add a user agent to avoid issues
        }).ready;

        // Fetch files from the root directory
        const files = storage.root.children;

        if (files.length === 0) {
            return reply("No files found in the SubZero Library."); // No files found
        }

        // Construct a numbered list of files
        let fileList = "        📑 `SUBZERO LIBRARY` \n*📂 Available Books:*\n";
        fileList += `*🏮 Total Books: ${files.length}*\n\n`; // Add total files count here
        files.forEach((file, index) => {
            fileList += `${index + 1}. ${file.name}\n`; // Add file name to the list
        });

        // Footer message
        fileList += "\n*To download a book, simply reply with the number of the book.*\n*Example:* `download 1`";

        // Send the list to the user
        await reply(fileList);
    } catch (error) {
        console.error("Error:", error); // Log the error
        reply("*Error: Unable to fetch files from the SubZero Library. Please try again later.*");
    }
});

cmd({
    pattern: "download", // Command trigger
    alias: ["dl", "getbook"], // Aliases
    use: '.download <number>', // Example usage
    react: "📥", // Emoji reaction
    desc: "Download a book from the SubZero Library.", // Description
    category: "utility", // Command category
    filename: __filename // Current file name
},

async (conn, mek, m, { from, reply, senderNumber, args }) => {
    try {
        const username = "gardinastu@gufum.com"; // Your Mega.nz username
        const password = "darrell123"; // Your Mega.nz password

        // Authenticate with Mega.nz using the Storage class
        const storage = await new Storage({
            email: username,
            password: password,
            userAgent: 'Mozilla/5.0' // Add a user agent to avoid issues
        }).ready;

        // Fetch files from the root directory
        const files = storage.root.children;

        if (files.length === 0) {
            return reply("No files found in the SubZero Library."); // No files found
        }

        // Check if the user provided a file number
        if (!args[0]) {
            return reply("*Please specify the number of the book you want to download.*\n*Example:* `download 1`");
        }

        const fileNumber = parseInt(args[0]); // Get the file number

        if (fileNumber < 1 || fileNumber > files.length) {
            return reply("*Invalid book number. Please provide a valid book number.*");
        }

        const fileToDownload = files[fileNumber - 1]; // Get the file by index

        // Get the download link for the file
        const downloadLink = await fileToDownload.link();

        // Send the download link to the user
        await reply(`*📥 Download Link for ${fileToDownload.name}:*\n${downloadLink}`);

    } catch (error) {
        console.error("Error:", error); // Log the error
        reply("*Error: Unable to download the book. Please try again later.*");
    }
});
