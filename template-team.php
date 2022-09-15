<?php
/**
 * Template Name: Team Template
 *
 * This is the template that displays story page.
 *
 * @package  WordPress
 * @subpackage  Timber
 * @since    Timber 0.1
 */

$context = Timber::context();

$context['teamMembers'] = Timber::get_posts(array(
    'post_type' => 'team',
    'posts_per_page' => -1,
    'orderby' => array(
        'date' => 'ASC'
    )
));

Timber::render(array('team.twig'), $context);
