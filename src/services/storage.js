export default class Storage {
  static get(key, defaultValue) {
    let stored;
    try {
      stored = localStorage.getItem(key);
      stored = JSON.parse(stored);
    } catch (err) {
      stored = null;
    }
    if (typeof defaultValue !== 'undefined' && stored === null) {
      stored = defaultValue;
    }
    return stored;
  }

  static set(key, value) {
    if (typeof value !== 'undefined') {
      localStorage.setItem(key, JSON.stringify(value));
    }
  }

  static remove(key) {
    localStorage.removeItem(key);
  }

  static clear() {
    localStorage.clear();
  }
}
