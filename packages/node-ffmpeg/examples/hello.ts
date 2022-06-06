import { Ffmpeg } from "..";

async function main() {
  const ffmpeg = new Ffmpeg();
  const encoders = await ffmpeg.availableEncoders();
  console.log(encoders);
  console.log('done')
}


console.log('start');
main();
