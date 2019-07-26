<?php

/*
Plugin Name: Panopto Playlist Embed
Plugin URI: http://URI_Of_Page_Describing_Plugin_and_Updates
Description: WordPress Block for embedding Panopto playlists.
Version: 1.1
Author: Stephen Schrauger
Author URI: https://github.com/schrauger/wp-panopto-embed
License: A "Slug" license name e.g. GPL2
*/

function loadPanoptoBlock() {
	wp_enqueue_script(
		'panopto-block',
		plugin_dir_url(__FILE__) . 'panopto-block.js',
		array('wp-blocks','wp-editor'),
		true
	);
}

add_action('enqueue_block_editor_assets', 'loadPanoptoBlock');