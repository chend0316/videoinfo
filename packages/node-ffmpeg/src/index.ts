import { availableCodecs, availableEncoders, availableFilters, availableFormats, _getFfmpegPath } from "./capabilities";
import {spawn} from "child_process";

var nlRegexp = /\r\n|\r|\n/g;
var streamRegexp = /^\[?(.*?)\]?$/;
var filterEscapeRegexp = /[,]/;

export class Ffmpeg {
  availableCodecs = availableCodecs;
  availableEncoders = availableEncoders;
  availableFilters = availableFilters;
  availableFormats = availableFormats;
  private _getFfmpegPath = _getFfmpegPath;

  protected _spawnFfmpeg(args: string[], options: {captureStdout: boolean; stdoutLines: number}, processCB?): Promise<{stdout: string[]; stderr: string[]}> {
    if (typeof processCB === 'undefined') {
      processCB = function() {};
    }

    return this._getFfmpegPath().then(command => {
      if (!command) {
        throw new Error('Cannot find ffmpeg');
      }

      return new Promise((resolve, reject) => {
        var stdout: string[] = [];
        var stderr: string[] = [];
        var ffmpegProc = spawn(command, args);

        ffmpegProc.stderr.setEncoding('utf8');
        ffmpegProc.stdout.setEncoding('utf8');

        ffmpegProc.on('error', function(err) {
          return reject(err);
        });

        ffmpegProc.on('exit', function(code, signal) {
          if (signal) {
            return reject(new Error('ffmpeg was killed with signal ' + signal));
          } else if (code) {
            return reject(new Error('ffmpeg exited with code ' + code));
          } else {
            return resolve({stdout, stderr});
          }
        });

        if (options.captureStdout) {
          ffmpegProc.stdout.on('data', function(data: string) {
            stdout = stdout.concat(data.split(nlRegexp));
          });

          // ffmpegProc.stdout.on('close', function() {
          //   stdout.close();
          // });
        }

        ffmpegProc.stderr.on('data', function(data: string) {
          stderr = stderr.concat(data.split(nlRegexp));
        });

        // ffmpegProc.stderr.on('close', function() {
        //   stderr.close();
        // });

        processCB(ffmpegProc, stdout, stderr);
      });
    });
  }
}