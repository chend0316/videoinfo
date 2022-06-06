import fs from 'fs/promises';
import * as which from 'which';
import { Ffmpeg } from '.';

const avCodecRegexp = /^\s*([D ])([E ])([VAS])([S ])([D ])([T ]) ([^ ]+) +(.*)$/;
const ffCodecRegexp = /^\s*([D\.])([E\.])([VAS])([I\.])([L\.])([S\.]) ([^ ]+) +(.*)$/;
const ffEncodersRegexp = /\(encoders:([^\)]+)\)/;
const ffDecodersRegexp = /\(decoders:([^\)]+)\)/;
const encodersRegexp = /^\s*([VAS\.])([F\.])([S\.])([X\.])([B\.])([D\.]) ([^ ]+) +(.*)$/;
const formatRegexp = /^\s*([D ])([E ]) ([^ ]+) +(.*)$/;
const lineBreakRegexp = /\r\n|\r|\n/;
const filterRegexp = /^(?: [T\.][S\.][C\.] )?([^ ]+) +(AA?|VV?|\|)->(AA?|VV?|\|) +(.*)$/;

const cache: any = {};

export async function availableEncoders(this: Ffmpeg) {
  if ('encoders' in cache) {
    return Promise.resolve(cache.encoders);
  }

  return this._spawnFfmpeg(['-encoders'], { captureStdout: true, stdoutLines: 0 }).then(({stdout}) => {
    var lines = stdout;
    var data = {};

    lines.forEach(function(line) {
      var match = line.match(encodersRegexp);
      if (match && match[7] !== '=') {
        data[match[7]] = {
          type: { 'V': 'video', 'A': 'audio', 'S': 'subtitle' }[match[1]],
          description: match[8],
          frameMT: match[2] === 'F',
          sliceMT: match[3] === 'S',
          experimental: match[4] === 'X',
          drawHorizBand: match[5] === 'B',
          directRendering: match[6] === 'D'
        };
      }
    });

    cache.encoders = data;
    return data;
  });
};

export async function _getFfmpegPath(this: Ffmpeg) {
  if ('ffmpegPath' in cache) {
    return cache.ffmpegPath as string;
  }

  if (process.env.FFMPEG_PATH) {
    const stat = await fs.stat(process.env.FFMPEG_PATH)
    if (stat.isFile()) {
      return cache.ffmpegPath = process.env.FFMPEG_PATH;
    }
  }

   return cache.ffmpegPath = await which('ffmpeg');
};