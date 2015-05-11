/**
 * An Audio object that implements HTML5 Audio into a generic API
 * @name HTML5Audio
 * @constructor HTML5Audio
 * @extends Sound
 */

'use strict';

const _ = require('lodash');
const Sound = require('./Sound');
const removeExtension = require('../utils/removeExtension');


//TODO: has replacement
// has.add('HTML5Audio', function(global){
//   return !!global.Audio;
// });



class HTML5Audio extends Sound {
  constructor(options){
    options = options || {};

    /**
     * The initial Audio object - used to load the sound prior to playing
     * @type {Audio}
     * @memberOf HTML5Audio#
     * @default
     */
    this.audio = null;

    _.assign(this, options);
    super(options);
  }

  load(filename){
    this.audio = new Audio();

    var self = this;

    this.name = filename;

    var basename = removeExtension(filename);
    if(basename === filename){
      filename = basename + this._chooseFormat();
    }
    filename = req.toUrl(filename);

    if(has('shittySound')){
      on.once(document, 'touchstart', function(e){
        var vol = self.audio.volume;
        self.audio.volume = 0;
        self.audio.play();
        self.audio.pause();
        self.audio.volume = vol;
      });
      this._updateCurrentTime = null;
      on.once(this.audio, 'progress', function(){
        if(self._updateCurrentTime !== null){
          self._updateCurrentTime();
        }
      });
    }

    this.audio.pause();
    this.audio.preload = 'auto';
    on.once(this.audio, 'error', function(){
      var format = self._nextFormat();
      if(format){
        self.load(self.name);
      } else {
        self.audio.src = null;
        self.complete = true;
      }
    });
    on.once(this.audio, 'loadeddata', function(e){
      self.complete = true;
    });
    this.audio.src = filename;
  }

  loop(volume){
    var audio = this._initAudio(volume, true);
    on.once(audio, 'loadeddata', function(e){
      audio.play();
    });
  }

  play(volume, startTime){
    startTime = startTime || 0;

    if(has('shittySound')){
      try {
        this.audio.currentTime = startTime / 1000;
        return this.audio.play();
      } catch(err){
        this._updateCurrentTime = function(){
          this._updateCurrentTime = null;
          this.audio.currentTime = startTime / 1000;
          return this.audio.play();
        };
        return this.audio.play();
      }
    }

    var audio = this._initAudio(volume, false);
    on.once(audio, 'loadeddata', function(e){
      audio.currentTime = startTime / 1000;
      audio.play();
    });
  }

  _initAudio(volume, loop){
    loop = typeof loop === 'boolean' ? loop : false;

    var audio = new Audio();
    audio.pause();
    audio.volume = volume || 1;
    audio.loop = loop;
    audio.preload = 'auto';
    // TODO: investigate if this.audio.currentSrc shares buffer and ditch mozLoadFrom if it does
    if(audio.mozLoadFrom){
      audio.mozLoadFrom(this.audio);
    } else {
      audio.src = this.audio.currentSrc;
    }
    return audio;
  }
}

module.exports = HTML5Audio;
