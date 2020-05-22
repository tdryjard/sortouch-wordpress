<?php
// This file enqueues your shortcode.

defined( 'ABSPATH' ) or die( 'Direct script access disallowed.' );

add_shortcode( 'erw_sortouch', function( $atts ) {
  $default_atts = array( 'user' => '0', 'model' => '0' );
  $args = shortcode_atts( $default_atts, $atts );
  $uniqid = uniqid('id');

  ob_start(); ?>
  <script>
  window.erwSettings = window.erwSettings || {};
  window.erwSettings["<?= $uniqid ?>"] = {
    'user': '<?= $args["user"] ?>',
    'model': '<?= $args["model"] ?>',
  }
  </script>
  <div class="erw-root" data-id="<?= $uniqid ?>"></div>

  <?php
  return ob_get_clean();
});