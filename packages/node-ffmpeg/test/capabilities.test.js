var { Ffmpeg } = require('..'),
  path = require('path'),
  assert = require('assert');

// delimiter fallback for node 0.8
var PATH_DELIMITER = path.delimiter || (require('os').platform().match(/win(32|64)/) ? ';' : ':');

describe('Capabilities', function() {
  describe('ffmpeg capabilities', function() {
    it('should enable querying for available encoders', async function() {
      const encoders = await new Ffmpeg().availableEncoders();

      (typeof encoders).should.equal('object');
      Object.keys(encoders).length.should.not.equal(0);

      ('pcm_s16le' in encoders).should.equal(true);
      ('type' in encoders.pcm_s16le).should.equal(true);
      (typeof encoders.pcm_s16le.type).should.equal('string');
      ('description' in encoders.pcm_s16le).should.equal(true);
      (typeof encoders.pcm_s16le.description).should.equal('string');
      ('experimental' in encoders.pcm_s16le).should.equal(true);
      (typeof encoders.pcm_s16le.experimental).should.equal('boolean');
    });
  });
});
