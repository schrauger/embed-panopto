<?php

/*
Plugin Name: Panopto Playlist Embed
Plugin URI: http://URI_Of_Page_Describing_Plugin_and_Updates
Description: WordPress Block for embedding Panopto playlists.
Version: 1.5.1
Author: Stephen Schrauger
Author URI: https://github.com/schrauger/wp-panopto-embed
License: A "Slug" license name e.g. GPL2
*/

add_action('init', 'loadPanoptoBlock');

/**
 * register the react script for a block, and also define
 * the server side render callback to allow for raw html.
 */
function loadPanoptoBlock() {

	wp_register_script(
		'panopto-block',
		plugins_url('panopto-block.js', __FILE__),
		array('wp-blocks','wp-editor','wp-data')
		//filemtime(plugin_dir_path(__FILE__) . 'panopto-block.js')
	);

	register_block_type(
		'panopto-embed/panopto-block', array(
			'editor_script' => 'panopto-block',
			'render_callback' => 'renderPanoptoCallback' // lets us do server-side rendering
		)
	);
}

/**
 * Overwrites the client side 'save' method with our own data. This allows us to print out raw html without
 * filtering it based on user permissions, so we can embed an iframe.
 * @param $attributes // input elements from the client
 * @param $content // post-filtered html from the client-side 'save' method. we don't use it here, instead we create our own html.
 *
 * @return string // like shortcode callbacks, this is the html that we render in place of the block.
 */
function renderPanoptoCallback($attributes, $content){
	return "
		<iframe 
			src='https://ucf.hosted.panopto.com/Panopto/Pages/Embed.aspx?pid={$attributes['playlistID']}&v=1'
			width='720'
            height='405'
            frameborder='0'
            allowfullscreen='true'
            allow='autoplay'
		></iframe>
	";
}

// have to use init hook, since there is server-side rendering
// can't just use enqueue_block_editor_assets hook, since an editor-only return is client side rendered html, which is
// subject to html filtering (and would remove the iframe for less privileged users)
//add_action('enqueue_block_editor_assets', 'loadPanoptoBlock');
