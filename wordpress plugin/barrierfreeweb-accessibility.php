<?php
/**
 * Plugin Name: BarrierFreeWeb - Accessibility Widget
 * Description: Comprehensive accessibility widget with presets, text controls, highlighting, contrast modes, and more
 * Version: 1.0.0
 * Author: Poorani Ramakrishnan
 * License: MIT
 * Text Domain: barrierfreeweb-accessibility
 * Domain Path: /languages
 */

// Prevent direct file access
if (!defined('ABSPATH')) {
    exit;
}

/**
 * Main Plugin Class
 */
class BarrierFreeWeb_Accessibility_Plugin {
    
    /**
     * Plugin slug for use with WordPress functions
     */
    private $plugin_slug = 'barrierfreeweb-accessibility';
    
    /**
     * Plugin version
     */
    private $plugin_version = '1.0.0';
    
    /**
     * Constructor - Initialize plugin hooks
     */
    public function __construct() {
        // Register hooks
        add_action('wp_enqueue_scripts', array($this, 'enqueue_assets'));
        add_action('wp_footer', array($this, 'output_widget_wrapper'));
    }
    
    /**
     * Enqueue CSS and JavaScript on frontend only
     */
    public function enqueue_assets() {
        // Don't load in admin area
        if (is_admin()) {
            return;
        }
        
        // Get the absolute path to the plugin directory
        $plugin_dir = plugin_dir_url(__FILE__);
        $plugin_file_path = plugin_dir_path(__FILE__);
        
        // Use file modification time for cache busting (ensures fresh CSS loads)
        $css_file = $plugin_file_path . 'css/accessibility.css';
        $css_version = file_exists($css_file) ? filemtime($css_file) : $this->plugin_version;
        
        // Register and enqueue stylesheet
        wp_register_style(
            $this->plugin_slug . '-style',
            $plugin_dir . 'css/accessibility.css',
            array(),
            $css_version,
            'all'
        );
        wp_enqueue_style($this->plugin_slug . '-style');
        
        // Use file modification time for JS as well
        $js_file = $plugin_file_path . 'js/accessibility.js';
        $js_version = file_exists($js_file) ? filemtime($js_file) : $this->plugin_version;
        
        // Register and enqueue script
        wp_register_script(
            $this->plugin_slug . '-script',
            $plugin_dir . 'js/accessibility.js',
            array(),
            $js_version,
            true // Load in footer
        );
        wp_enqueue_script($this->plugin_slug . '-script');
        
        // Localize script with AJAX data if needed
        wp_localize_script(
            $this->plugin_slug . '-script',
            'barrierFreeWeb',
            array(
                'pluginUrl' => $plugin_dir,
                'version' => $this->plugin_version,
            )
        );
    }
    
    /**
     * Output the widget wrapper HTML
     */
    public function output_widget_wrapper() {
        // Don't load in admin area
        if (is_admin()) {
            return;
        }
        
        ?>
        <!-- BarrierFreeWeb Accessibility Widget -->
        <div id="bfw-widget-container"></div>
        <?php
    }
    
    /**
     * Get plugin version
     */
    public function get_version() {
        return $this->plugin_version;
    }
}

/**
 * Initialize the plugin
 */
function barrierfreeweb_accessibility_init() {
    new BarrierFreeWeb_Accessibility_Plugin();
}

// Initialize on WordPress loaded hook
add_action('plugins_loaded', 'barrierfreeweb_accessibility_init');

/**
 * Activation hook
 */
function barrierfreeweb_accessibility_activate() {
    // Future: Add any activation routines here
    // e.g., Set default options, create database tables, etc.
}

register_activation_hook(__FILE__, 'barrierfreeweb_accessibility_activate');

/**
 * Deactivation hook
 */
function barrierfreeweb_accessibility_deactivate() {
    // Future: Add any deactivation routines here
    // Note: Don't delete options here to preserve user settings on reactivation
}

register_deactivation_hook(__FILE__, 'barrierfreeweb_accessibility_deactivate');
