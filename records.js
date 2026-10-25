// Workout records stored in localStorage as [{count, date}].
const Records = (() => {
  const KEY = 'workoutRecords';
  const load = () => {
    try { return JSON.parse(localStorage.getItem(KEY)) || []; } catch { return []; }
  };
  const fmt = iso => new Date(iso).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' });
  return {
    all: load,
    fmt,
    // Saves the finished workout and returns the previous record (if any).
    add(count) {
      const list = load();
      const previous = list[list.length - 1] || null;
      list.push({ count, date: new Date().toISOString() });
      try { localStorage.setItem(KEY, JSON.stringify(list)); } catch {}
      return { current: list[list.length - 1], previous };
    }
  };
})();
