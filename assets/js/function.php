<?php
/**
 * Plugin Name: Volunteer API Enhancer
 * Description: Exposes volunteer custom fields to REST API
 * Version: 1.0
 */

// Prevent direct access
if (!defined('ABSPATH')) {
    exit;
}

class VolunteerAPIEnhancer {
    
    public function __construct() {
        // Add custom fields to REST API
        add_action('rest_api_init', array($this, 'add_volunteer_fields'));
        
        // Create custom endpoint for volunteers with meta
        add_action('rest_api_init', array($this, 'register_custom_endpoints'));
    }
    
    public function add_volunteer_fields() {
        // Register for 'volunteer' post type
        register_rest_field('volunteer',
            'custom_fields',
            array(
                'get_callback' => array($this, 'get_volunteer_meta'),
                'schema' => array(
                    'description' => 'Volunteer custom fields',
                    'type' => 'object'
                )
            )
        );
        
        // Also add individual fields for easier access
        $meta_fields = array('suburb', 'role', 'phone', 'availability');
        
        foreach ($meta_fields as $field) {
            register_rest_field('volunteer',
                $field,
                array(
                    'get_callback' => function($object, $field_name) {
                        return get_post_meta($object['id'], $field_name, true);
                    },
                    'schema' => array(
                        'description' => 'Volunteer ' . $field,
                        'type' => 'string'
                    )
                )
            );
        }
    }
    
    public function get_volunteer_meta($object) {
        $post_id = $object['id'];
        $meta_fields = array('suburb', 'role', 'phone', 'availability', 'bio');
        
        $meta = array();
        foreach ($meta_fields as $field) {
            $value = get_post_meta($post_id, $field, true);
            if (!empty($value)) {
                $meta[$field] = $value;
            }
        }
        
        return $meta;
    }
    
    public function register_custom_endpoints() {
        register_rest_route('pantry/v1', '/volunteers', array(
            'methods' => 'GET',
            'callback' => array($this, 'get_all_volunteers'),
            'permission_callback' => '__return_true'
        ));
    }
    
    public function get_all_volunteers($request) {
        $volunteers = get_posts(array(
            'post_type' => 'volunteer',
            'posts_per_page' => -1,
            'post_status' => 'publish'
        ));
        
        $result = array();
        foreach ($volunteers as $volunteer) {
            $result[] = array(
                'id' => $volunteer->ID,
                'name' => $volunteer->post_title,
                'suburb' => get_post_meta($volunteer->ID, 'suburb', true),
                'role' => get_post_meta($volunteer->ID, 'role', true),
                'phone' => get_post_meta($volunteer->ID, 'phone', true),
                'availability' => get_post_meta($volunteer->ID, 'availability', true),
                'url' => get_permalink($volunteer->ID)
            );
        }
        
        return rest_ensure_response(array(
            'volunteers' => $result,
            'total' => count($result)
        ));
    }
}

// Initialize the plugin
new VolunteerAPIEnhancer();
// Add to wp-content/themes/your-theme/functions.php
function allow_frontend_access() {
    // Allow requests from your local frontend
    $allowed_origins = array(
        'http://192.168.8.98:8765',
        'http://localhost:8765',
        'http://pantry.local'
    );
    
    $origin = get_http_origin();
    if (in_array($origin, $allowed_origins)) {
        header("Access-Control-Allow-Origin: $origin");
        header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
        header("Access-Control-Allow-Headers: Content-Type, X-WP-Nonce");
        header("Access-Control-Allow-Credentials: true");
    }
    
    if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
        status_header(200);
        exit();
    }
}
add_action('init', 'allow_frontend_access');

// Ensure REST API is accessible
add_filter('rest_authentication_errors', function($result) {
    if (!is_user_logged_in()) {
        // Allow public access to volunteer endpoint
        $current_route = $GLOBALS['wp']->query_vars['rest_route'] ?? '';
        if (strpos($current_route, '/wp/v2/volunteer') !== false) {
            return true;
        }
        if (strpos($current_route, '/pantry/v1/volunteers') !== false) {
            return true;
        }
    }
    return $result;
});