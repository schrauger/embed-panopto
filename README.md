# wp-panopto-embed
WordPress Block for embedding Panopto playlists

## Description
Adds a WordPress Block for embedding video playlists from Panopto. You provide the Playlist ID (pid), and it will embed an iframe pointing to uc.hosted.panopto.com.

As of version 1.2, you can only embed video playlists, not individual videos. Also, it only works on the ucf.hosted.panopto.com domain.

## Future development
* Allow other domains (perhaps a site setting, or maybe just another option for each block embed)
* Allow individual videos (editor toggle between playlist and video mode?)
* Auto-parse a panopto url and extract the PID (or other params) directly, rather than require the user to get the string
