# embed-panopto
WordPress Block for embedding Panopto playlists

## Description
Adds a WordPress Block for embedding video playlists from Panopto. You provide the video or playlist url, and it will embed an iframe pointing to the video.

It utilizes server-side rendering, so it will work even for standard users who are prohibited from embedding iframes. The code verifies that the url is a video on panopto.com, preventing other iframe urls from being injected onto the page.
