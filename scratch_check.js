const fs = require('fs');
const readline = require('readline');

async function main() {
  const fileStream = fs.createReadStream('C:\\Users\\Usuario\\.gemini\\antigravity-cli\\brain\\4cfe8f36-d8a9-485c-a391-2febc2a78db6\\.system_generated\\logs\\transcript_full.jsonl');
  const rl = readline.createInterface({ input: fileStream, crlfDelay: Infinity });
  let idx = 0;
  for await (const line of rl) {
    if (idx === 3) {
      const data = JSON.parse(line);
      console.log('Keys on step 3:', Object.keys(data));
      if (data.thinking) console.log('Thinking len:', data.thinking.length);
      if (data.tool_calls) console.log('Tool calls count:', data.tool_calls.length);
      break;
    }
    idx++;
  }
}
main();
