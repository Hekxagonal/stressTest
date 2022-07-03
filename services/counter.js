const fs = require('fs');
const { dir: path } = require('./log');

class Counter {
  constructor() {
    this.limit = 0;
    this.total = 0;
    this.sucess = 0;
    this.fail = 0;
    this.duration = {
      total: 0,
      media: 0,
      pages: { max: 0, min: 0 },
      prod: { max: 0, min: 0 },
      expected: { max: 0, min: 0, media: 0 },
    };
    this.errors = {};
  }

  writeJSON() {
    fs.writeFile(path + '/data.json', JSON.stringify(this, null, 2), (err) => {
      if (err) {
        console.log(err);
      }
    });
  }

  setLimit(limit) {
    this.limit = limit;
    this.writeJSON();
  }

  addSucess() {
    this.sucess = this.sucess + 1;
    this.total = this.total + 1;
    this.writeJSON();
  }

  addFail() {
    this.fail = this.fail + 1;
    this.total = this.total + 1;
    this.writeJSON();
  }

  setDuration(type, duration) {
    if (this.duration[type].max < duration) {
      this.duration[type].max = duration;
    }
    if (this.duration[type].min === 0 || this.duration[type].min > duration) {
      this.duration[type].min = duration;
    }
    this.duration.total = this.duration.total + duration;
    this.writeJSON();
  }

  addError(type) {
    if (!this.errors[type]) {
      this.errors[type] = 0;
    }
    this.errors[type] = this.errors[type] + 1;
    this.writeJSON();
  }

  setExpectedDuration(loopLimit) {
    return new Promise((resolve) => {
      // tempo em segundos
      const maxRegistred = { page: 30, prod: 0.402 };
      const minRegistred = { page: 0.402, prod: 0.155 };

      this.duration.expected.max =
        maxRegistred.page * loopLimit + 12 * maxRegistred.prod;
      this.duration.expected.min =
        minRegistred.page * loopLimit + 12 * minRegistred.prod;
      this.duration.expected.media =
        this.duration.expected.max + this.duration.expected.min / 2;
      this.writeJSON();

      resolve({
        max: this.duration.expected.max,
        min: this.duration.expected.min,
        media: this.duration.expected.media,
      });
    });
  }
}

module.exports = Counter;
