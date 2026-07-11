// Thuật toán lặp lại ngắt quãng (spaced repetition), kiểu SM-2 rút gọn.
function srsNext(prev, rating) {
  let { interval = 1, ef = 2.5, reps = 0 } = prev || {};
  if (rating === 0) {
    interval = 1;
    reps = 0;
  } else if (rating === 1) {
    interval = Math.max(1, Math.round(interval * 1.2));
    reps++;
  } else if (rating === 2) {
    interval = Math.round(interval * ef);
    reps++;
    ef = Math.max(1.3, ef - 0.15);
  } else {
    interval = Math.round(interval * ef * 1.3);
    reps++;
    ef = Math.min(3.0, ef + 0.1);
  }
  return { interval, ef, reps, lastRating: rating };
}

module.exports = { srsNext };
