export let share = ({ shareButton }) => {
  shareButton.addEventListener("click", async () => {
    const shareData = {
      title: document.title,
      text: "Check out Beastify!",
      url: window.location.href,
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (error) {
        console.error("Share failed:", error);
      }
    } else {
      try {
        await navigator.clipboard.writeText(window.location.href);
        alert("Link copied to clipboard.");
      } catch (error) {
        console.error("Clipboard fallback failed:", error);
        alert("Sharing is not supported in this browser.");
      }
    }
  });
};
