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

export function shareTo(platform, text) {
  const url = window.location.href;
  const encodedText = encodeURIComponent(text);
  const encodedUrl = encodeURIComponent(url);
  let shareUrl = '';
  switch (platform) {
    case 'facebook':
      shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}&quote=${encodedText}`;
      break;
    case 'linkedin':
      shareUrl = `https://www.linkedin.com/shareArticle?mini=true&url=${encodedUrl}&title=${encodedText}`;
      break;
    case 'wordpress':
      shareUrl = `https://wordpress.com/wp-admin/press-this.php?u=${encodedUrl}&t=${encodedText}`;
      break;
    case 'twitter':
    default:
      shareUrl = `https://twitter.com/intent/tweet?text=${encodedText}&url=${encodedUrl}`;
      break;
  }
  window.open(shareUrl, '_blank');
}
