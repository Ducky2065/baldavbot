const mineflayer = require('mineflayer');

const username = 'NissanGTR'; // Updated username for your bot
const password = 'YourPassword'; // Set a secure password for your bot
const loginCommand = '/login rtyt@pro'; // Login command to be sent
const skyblockCommand = '/skyblock'; // Command to execute after login
const warpCommand = '/is warp Maxim_2065 afk'; // Warp command to player
const bookIconSlot = 4; // Slot number for the book icon (adjust based on server menu)
const coopPlayer = 'Maxim_2065'; // Player to coop with

let bot; // Declare a variable to hold the bot instance

function createBot() {
  // If there is an existing bot instance, end its connection
  if (bot) {
    bot.end();
  }

  // Create a new bot instance
  bot = mineflayer.createBot({
    host: 'mc.leftypvp.net', // Use the server's hostname
    port: 25565,             // Default Minecraft server port
    username: username,      // Username for your bot
    password: password       // Password for your bot, if required
  });

  bot.once('spawn', async () => {
    console.log('Bot has spawned and is now AFK.');

    try {
      // Handle login
      await handleLogin();

      // Execute /skyblock command
      await executeSkyblockCommand();

      // Warp to AFK location
      await warpToAFK();

      // Listen for player joins
      bot.on('playerJoined', (player) => {
        if (player.username === coopPlayer) {
          console.log(`Player ${coopPlayer} has joined the server.`);
          // Execute /is coop command with player name
          executeCoopCommand(player.username);
        }
      });

    } catch (err) {
      console.error('Error during bot operation:', err);
      bot.end(); // End bot session in case of error
    }
  });

  bot.on('chat', (username, message) => {
    if (username === bot.username) return; // Ignore messages from the bot itself

    // Command to disconnect the bot
    if (message === '!disconnect') {
      bot.chat('Bot is disconnecting...');
      bot.end();
    }
  });

  bot.on('end', () => {
    console.log('Bot has disconnected.');
    // Attempt to reconnect after a delay (e.g., 10 seconds)
    setTimeout(createBot, 10000); // Reconnect after 10 seconds
  });

  bot.on('error', (err) => {
    console.error('Bot encountered an error:', err);
    bot.end(); // End bot session in case of error
  });
}

async function handleLogin() {
  await bot.waitForChunksToLoad();
  console.log('Sending login command:', loginCommand);
  await openChatAndSend(loginCommand);
}

async function executeSkyblockCommand() {
  console.log('Executing Skyblock command:', skyblockCommand);
  await pressTThenType(skyblockCommand);
  await new Promise(resolve => setTimeout(resolve, 5000)); // Wait 5 seconds after command execution
}

async function warpToAFK() {
  console.log('Sending warp command:', warpCommand);
  await pressTThenType(warpCommand);
  await new Promise(resolve => setTimeout(resolve, 5000)); // Wait 5 seconds for warp execution
}

function executeCoopCommand(playerName) {
  const coopCommand = `/is coop ${playerName}`;
  console.log(`Executing coop command for player ${playerName}:`, coopCommand);
  pressTThenType(coopCommand);
}

async function openChatAndSend(message) {
  await pressTThenType(message);
}

async function pressTThenType(message) {
  await bot.waitForChunksToLoad();
  await bot.activateItem();
  await new Promise(resolve => setTimeout(resolve, 500)); // Wait 0.5 seconds after activating item (pressing 't')
  await bot.deactivateItem();
  await bot.chat(message);
}

createBot(); // Initial bot creation and connection


