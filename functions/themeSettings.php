<?php

/** Disable Block Editor on all Post Types **/
add_filter('use_block_editor_for_post', '__return_false');


/** Add Theme Settings Panel **/
if (function_exists('acf_add_options_page')) {
    acf_add_options_page(array(
        'page_title' 	=> 'Theme Settings',
        'menu_title'	=> 'Theme Settings',
        'menu_slug' 	=> 'theme-settings',
        'capability'	=> 'edit_posts',
        'position'      => false,
        'icon_url'      => false,
        'redirect'		=> true
    ));
}

/** Allow Theme Options Site Wide **/
add_filter('timber_context', 'mytheme_timber_context');

function mytheme_timber_context($context)
{
    $context['options'] = get_fields('option');
    return $context;
}


/* remove admin bar */
add_action('after_setup_theme', 'remove_admin_bar');
function remove_admin_bar()
{
    /*if (!current_user_can('administrator') && !is_admin()) {
        show_admin_bar(false);
    }*/
    show_admin_bar(false);
}