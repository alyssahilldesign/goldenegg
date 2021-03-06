<?php

/**
 * Update TinyMCE
 */
add_action( 'init', 'egg_tinymce' );
function egg_tinymce() {
	// filters
	add_filter( 'mce_buttons',				'egg_mce_buttons' );
	add_filter( 'mce_buttons_2',			'egg_mce_buttons_2' );
	add_filter( 'tiny_mce_before_init', 	'egg_mce_show_row_2' );
	add_filter( 'tiny_mce_before_init',		'egg_tiny_mce_before_init' );
	add_filter( 'tiny_mce_before_init',		'tinymce_allow_unsafe_link_target');
}


/**
 * Disables a tinyMCE security feature: rel = noopener noreferrer
 */
function tinymce_allow_unsafe_link_target( $mceInit ) {
	$mceInit['allow_unsafe_link_target']=true;
	return $mceInit;
}


/**
 * Editor Styles
 */
add_action( 'admin_init', 'egg_editor_styles' );
function egg_editor_styles() {
	add_editor_style( get_template_directory_uri() . '/assets/css/editor.css' );
}


/**
 * Customize TinyMCE buttons in row 1
 *
 * @return	array Modified buttons in row 1
 */
function egg_mce_buttons( $buttons ) {
	$remove = array('blockquote', 'wp_more', 'wp_adv');
	//print_r($buttons);
	return array_diff($buttons, $remove);
}


/**
 * Customize TinyMCE buttons in row 2
 *
 * @return	array Modified buttons in row 2
 */
function egg_mce_buttons_2( $buttons2 ) {
	// Remove items
	$remove  = array('styleselect', 'strikethrough', 'underline', 'forecolor', 'alignjustify', 'wp_help');
	return array_diff($buttons2, $remove);
}


/**
 * Callback function to filter the MCE settings
 *
 * @return	array Modified settings
 */
function egg_tiny_mce_before_init( $settings ) {
	// Insert the array, JSON ENCODED, into 'style_formats'
	$settings['block_formats'] = "Paragraph=p;Heading 1=h1;Heading 2=h2;Heading 3=h3;Heading 4=h4;Heading 5=h5;Heading 6=h6; Superscript=superscript; Subscript=subscript; blockquote=blockquote";
	return $settings;
}


/**
 * Sets second mce toolbar view to 'show'
 */
function egg_mce_show_row_2( $in ) {
	$in['wordpress_adv_hidden'] = FALSE;
	return $in;
}


/**
 * Adds the 'button' class to the selected anchor node
 */
add_action('admin_head', 'egg_add_magic_button');
function egg_add_magic_button() {
	add_filter("mce_external_plugins", "egg_add_tinymce_button_plugin");
	add_filter('mce_buttons', 'egg_register_magic_button');
}
function egg_add_tinymce_button_plugin($plugin_array) {
   	$plugin_array['egg_magic_button'] = get_template_directory_uri().'/admin/assets/js/tinymce-functions.js'; 
   	return $plugin_array;
}
function egg_register_magic_button($buttons) {
   array_push($buttons, "egg_magic_button");
   return $buttons;
}


/**
 * Inserts the selection into a span element with class='nowrap'
 */
add_action('admin_head', 'egg_add_no_wrap');
function egg_add_no_wrap() {
	add_filter("mce_external_plugins", "egg_add_tinymce_no_wrap_plugin");
	add_filter('mce_buttons', 'egg_register_no_wrap');
}
function egg_add_tinymce_no_wrap_plugin($plugin_array) {
   	$plugin_array['egg_no_wrap'] = get_template_directory_uri().'/admin/assets/js/tinymce-functions.js'; 
   	return $plugin_array;
}
function egg_register_no_wrap($buttons) {
   array_push($buttons, "egg_no_wrap");
   return $buttons;
}
