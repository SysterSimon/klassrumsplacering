export function wait(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

export async function runShuffleSequence({ onStateChange, waitFn = wait }) {
  onStateChange({ phase: 'countdown', value: 3 });
  await waitFn(1000);
  onStateChange({ phase: 'countdown', value: 2 });
  await waitFn(1000);
  onStateChange({ phase: 'countdown', value: 1 });
  await waitFn(1000);

  onStateChange({ phase: 'loading' });
  await waitFn(2000);

  onStateChange({ phase: 'done' });
}
