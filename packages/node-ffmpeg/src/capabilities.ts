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

export async function availableFilters(this: Ffmpeg) {
  if ('filters' in cache) {
    return Promise.resolve(cache.filters);
  }

  return this._spawnFfmpeg(['-filters'], { captureStdout: true, stdoutLines: 0 })
    .then(({stdout}) => {
      var lines = stdout;
      var data = {};
      var types = { A: 'audio', V: 'video', '|': 'none' };

      lines.forEach(function(line) {
        var match = line.match(filterRegexp);
        if (match) {
          data[match[1]] = {
            description: match[4],
            input: types[match[2].charAt(0)],
            multipleInputs: match[2].length > 1,
            output: types[match[3].charAt(0)],
            multipleOutputs: match[3].length > 1
          };
        }
      });

      cache.filters = data;
      return data;
    });
};

interface Codec {
  type: 'video' | 'audio' | 'subtitle';
  description: string;
  /** tells whether ffmpeg is able to decode streams using this codec */
  canDecode: boolean;
  /** tells whether ffmpeg is able to encode streams using this codec */
  canEncode: boolean;
  drawHorizBand?: boolean;
  /** tells if codec can render directly in GPU RAM; useless for transcoding purposes */
  directRendering?: boolean;
  weirdFrameTruncation?: boolean;
  /** tells if codec can only work with I-frames */
  intraFrameOnly?: boolean;
  /** tells if codec can do lossy encoding/decoding */
  isLossy?: boolean;
  /** tells if codec can do lossless encoding/decoding */
  isLossless?: boolean;
}

export async function availableCodecs(this: Ffmpeg): Promise<{[name: string]: Codec}> {
  if ('codecs' in cache) {
    return Promise.resolve(cache.codecs);
  }

  return this._spawnFfmpeg(['-codecs'], { captureStdout: true, stdoutLines: 0 })
    .then(({stdout}) => {
      var lines = stdout;
      var data: {[name: string]: Codec} = {};

      lines.forEach(function(line) {
        var match = line.match(avCodecRegexp);
        if (match && match[7] !== '=') {
          data[match[7]] = {
            type: { 'V': 'video', 'A': 'audio', 'S': 'subtitle' }[match[3]] as any,
            description: match[8],
            canDecode: match[1] === 'D',
            canEncode: match[2] === 'E',
            drawHorizBand: match[4] === 'S',
            directRendering: match[5] === 'D',
            weirdFrameTruncation: match[6] === 'T'
          };
        }

        match = line.match(ffCodecRegexp);
        if (match && match[7] !== '=') {
          var codecData = data[match[7]] = {
            type: { 'V': 'video', 'A': 'audio', 'S': 'subtitle' }[match[3]] as any,
            description: match[8],
            canDecode: match[1] === 'D',
            canEncode: match[2] === 'E',
            intraFrameOnly: match[4] === 'I',
            isLossy: match[5] === 'L',
            isLossless: match[6] === 'S'
          };

          var encoders = codecData.description.match(ffEncodersRegexp);
          encoders = encoders ? encoders[1].trim().split(' ') : [];

          var decoders = codecData.description.match(ffDecodersRegexp);
          decoders = decoders ? decoders[1].trim().split(' ') : [];

          if (encoders.length || decoders.length) {
            let coderData = { ...codecData, canDecode: false, canEncode: false };

            encoders.forEach(function(name) {
              data[name] = { ...coderData, canEncode: true };
            });

            decoders.forEach(function(name) {
              if (name in data) {
                data[name].canDecode = true;
              } else {
                data[name] = { ...coderData, canDecode: true };
              }
            });
          }
        }
      });

      cache.codecs = data;
      return data;
    });
};

export async function availableFormats(this: Ffmpeg) {
  if ('formats' in cache) {
    return Promise.resolve(cache.formats);
  }

  return this._spawnFfmpeg(['-formats'], { captureStdout: true, stdoutLines: 0 }).then(({stdout}) => {
    var lines = stdout;
    var data = {};

    lines.forEach(function(line) {
      var match = line.match(formatRegexp)!;
      if (match) {
        match[3].split(',').forEach(function(format) {
          if (!(format in data)) {
            data[format] = {
              description: match[4],
              canDemux: false,
              canMux: false
            };
          }
          if (match[1] === 'D') {
            data[format].canDemux = true;
          }
          if (match[2] === 'E') {
            data[format].canMux = true;
          }
        });
      }
    });

    cache.formats = data;
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
