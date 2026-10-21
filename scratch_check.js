const fs = require('fs');
const readline = require('readline');

async function main() {
  const fileStream = fs.createReadStream('C:\\Users\\Usuario\\.gemini\\antigravity-cli\\brain\\4cfe8f36-d8a9-485c-a391-2febc2a78db6\\.system_generated\\logs\\transcript_full.jsonl');
  const rl = readline.createInterface({ input: fileStream, crlfDelay: Infinity });
  let idx = 0;
  for await (const line of rl) {
    if (idx === 3) {
      const data = JSON.parse(line);
      console.log('Step 3:');
      console.log('Status:', data.status);
      console.log('Finish reason:', data.finish_reason || data.finishReason || data.stop_reason);
      console.log('Content len:', data.content ? data.content.length : 0);
      console.log('Content end snippet:', data.content ? data.content.slice(-200) : 'none');
      break;
    }
    idx++;
  }
}
main();
