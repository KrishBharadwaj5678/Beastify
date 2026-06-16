export let screenshot = ({ screenshotButton, modelViewer }) => {
  // Check if the model-viewer supports the `toDataURL` method
  screenshotButton.addEventListener("click", () => {
    // Check if the `model-viewer` element supports the toDataURL method for screenshots
    if (modelViewer.toDataURL) {
      const imageUrl = modelViewer.toDataURL("image/png"); // Capture the screenshot as a PNG

      // Create a temporary link to trigger the download
      const link = document.createElement("a");
      link.href = imageUrl;
      link.download = "Beastify.png"; // Name the downloaded file
      link.click();
    } else {
      alert("Screenshot functionality is not supported by this model viewer.");
    }
  });
};
