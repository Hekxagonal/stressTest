const toTimeString = (timeInSecunds) => {
  if (timeInSecunds <= 0) {
    return '0s';
  }

  if (timeInSecunds < 60) {
    return `${timeInSecunds.toFixed(2)}s`;
  }

  if (timeInSecunds < 3600) {
    const minutes = Math.floor(timeInSecunds / 60);
    const seconds = timeInSecunds - minutes * 60;
    return `${minutes}m ${seconds.toFixed(2)}s`;
  }

  const hours = Math.floor(timeInSecunds / 3600);
  const minutes = Math.floor((timeInSecunds - hours * 3600) / 60);
  const seconds = timeInSecunds - hours * 3600 - minutes * 60;
  return `${hours}h ${minutes}m ${seconds.toFixed(2)}s`;
};

module.exports = toTimeString;
