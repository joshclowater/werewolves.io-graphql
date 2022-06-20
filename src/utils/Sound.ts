export const playAsync = (audioFile: string) => {
  return new Promise(function(resolve, reject) {
    const audio = new Audio(audioFile);
    audio.onerror = reject;
    audio.onended = resolve;
    audio.play();
  });
};