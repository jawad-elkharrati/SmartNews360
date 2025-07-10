export function shareText(text) {
  const url = window.location.href;
  if (navigator.share) {
    navigator.share({ title: 'SmartNews360', text, url }).catch((err) => {
      console.error('share failed', err);
    });
  } else {
    const shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text + ' ' + url)}`;
    window.open(shareUrl, '_blank');
  }
}
