<?php
	function nifl_load_cssjs() {
		// CSS
		wp_enqueue_style( 'parent', get_template_directory_uri().'/style.css' );
	}
	add_action( 'wp_enqueue_scripts', 'nifl_load_cssjs' );

	function nifl_bgcolor_none( $wp_customize ){
		$wp_customize->remove_section( 'colors' );
	}
	add_action( 'customize_register', 'nifl_bgcolor_none' );
?>