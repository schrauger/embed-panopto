=== Embed Panopto ===
Contributors: schrauger
Tags: panopto,video,embed,block,gutenberg
Requires at least: 5.0
Tested up to: 5.3.2
Requires PHP: 5.4
Stable tag: trunk
License: GPLv3
License URI: https://www.gnu.org/licenses/gpl-3.0.txt

WordPress Gutenberg block for embedding Panopto videos and playlists. 

== Description ==
Embed Panopto videos and playlists onto your pages with this Gutenberg block. Users copy the video or playlist embed url into this new block.

The plugin embeds an iframe onto the page, even if the user does not have the capability to embed raw iframes. Using server-side rendering along with server-side validation, it embeds iframes to any subdomain of panopto.com. It also verifies that the url path points to a video or playlist.

== Installation ==
No configuration necessary. Install and activate the plugin to begin using the panopto media block.

== Frequently Asked Questions ==
=== Why do I need this plugin? ===
If you want to embed a Panopto video onto your page, your user normally needs to have iframe permissions. In a larger site where a user isn\'t an admin, they likely do not have the ability to embed an iframe.

This block gives standard users a simple way to embed a video or playlist from Panopto without requiring that they be given potentially dangerous permissions. The plugin verifies the url the user enters and ensures that only subdomains of panopto.com are rendered into iframes.

=== Can the html be formatted? ===
Not within the block itself. The iframe is generated within a div and a class `panopto-video`, so you may use css rules to format it. But if you have multiple panopto videos embedded on a single page, they would need other wrappers to differentiate the rules.

== Screenshots ==
1. Block editor
2. Block output

== Changelog ==
=== 2.2.1 ===
* Added readme, screenshots, gpl license details

=== 2.2.0 ===
* Renamed to meet WordPress naming guidelines

=== 2.1.0 ===
* First public release
