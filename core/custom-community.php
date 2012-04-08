<?php
class Custom_Community{
	
	/**
	 * PHP 4 constructor
	 *
	 * @package Custom Community
	 * @since 1.8.3
	 */
	function custom_community() {
		$this->__construct();
	}

	/**
	 * PHP 5 constructor
	 *
	 * @package Custom Community
	 * @since 1.8.3
	 */	
	function __construct() {
		global $bp;
			
		// Load predefined constants first thing
		add_action( 'cc_init', array( $this, 'load_constants' ), 2 );
		
		// Includes necessary files
		// add_action( 'cc_init', array( $this, 'includes' ), 100, 4 );
		
		$this->includes();
		
		// Includes the necessary js
		add_action('wp_enqueue_scripts', array( $this, 'enqueue_script' ), 2 );
		
		// Let plugins know that Custom Community has started loading
		$this->init_hook();

		// Let other plugins know that Custom Community has finished initializing
		$this->loaded();
		
		if ( function_exists( 'bp_is_active' ) )
			BPUnifiedsearch::get_instance(); //that is the beauty of singleton, no proliferation of globals and you can always acess the same instance if you want to :)
		
		$this->framework_init();
		
		add_action( 'init', array( $this, 'generate_theme'), 10 );

		add_action( 'admin_menu',  array( $this, 'init_backend' ) );
		
		add_action( 'after_setup_theme', array( $this, 'set_globals' ), 10 );
		
		add_action( 'after_setup_theme', array( $this, 'cc_setup' ), 20 );
		
		add_action( 'wp_head', array( $this, 'add_header_script' ) );
		
		add_action( 'wp_footer', array( $this, 'add_footer_script' ), 20 );
		
	}
	
	/**
	 * Sets up theme defaults and registers support for various WordPress features.
	 *
	 * To override cc_setup() in a child theme, add your own cc_setup to your child theme's
	 * functions.php file.
	 *
	 * @uses add_theme_support() To add support for post thumbnails and automatic feed links.
	 * @uses register_nav_menus() To add support for navigation menus.
	 * @uses add_custom_background() To add support for a custom background.
	 * @uses add_editor_style() To style the visual editor.
	 * @uses load_theme_textdomain() For translation/localization support.
	 * @uses add_custom_image_header() To add support for a custom header.
	 * @uses register_default_headers() To register the default custom header images provided with the theme.
	 * @uses set_post_thumbnail_size() To set a custom post thumbnail size.
	 * @uses $content_width To set a content width according to the sidebars.
	 * @uses BP_DISABLE_ADMIN_BAR To disable the admin bar if set to disabled in the themesettings.
	 *
	 */
	
	function cc_setup() {
		global $tkf, $content_width;
	
	
		// This theme styles the visual editor with editor-style.css to match the theme style.
		add_editor_style();
	
		// This theme uses post thumbnails
		if ( function_exists( 'add_theme_support' ) ) {
			add_theme_support( 'post-thumbnails' );
			set_post_thumbnail_size( 222, 160, true );
			add_image_size( 'slider-top-large', 1000, 250, true  );
			add_image_size( 'slider-middle', 756, 250, true  );
			add_image_size( 'slider-thumbnail', 80, 50, true );
			add_image_size( 'post-thumbnails', 222, 160, true  );
			add_image_size( 'single-post-thumbnail', 598, 372, true );
		}
	
		// Add default posts and comments RSS feed links to head
		add_theme_support( 'automatic-feed-links' );
	
		// Make theme available for translation
		// Translations can be filed in the /languages/ directory
		load_theme_textdomain( 'cc', TEMPLATEPATH . '/languages' );
	
		$locale = get_locale();
		$locale_file = TEMPLATEPATH . "/languages/$locale.php";
		if ( is_readable( $locale_file ) )
			require_once( $locale_file );
	
		// This theme uses wp_nav_menu() in one location.
		register_nav_menus( array(
			'menu_top' => __( 'Header top menu', 'cc' ),
			'primary' => __( 'Header bottom menu', 'cc' ),
		) );
		
		// This theme allows users to set a custom background
		if($tkf->add_custom_background == 'true'){
			add_custom_background();
		}
		// Your changeable header business starts here
		define( 'HEADER_TEXTCOLOR', '888888' );
		
		// No CSS, just an IMG call. The %s is a placeholder for the theme template directory URI.
		define( 'HEADER_IMAGE', '%s/images/default-header.png' );
	
		// The height and width of your custom header. You can hook into the theme's own filters to change these values.
		// Add a filter to cc_header_image_width and cc_header_image_height to change these values.
		define( 'HEADER_IMAGE_WIDTH', apply_filters( 'cc_header_image_width', 1000 ) );
		define( 'HEADER_IMAGE_HEIGHT', apply_filters( 'cc_header_image_height', 233 ) );
	
	
		// Add a way for the custom header to be styled in the admin panel that controls
		// custom headers. See cc_admin_header_style(), below.
		if($tkf->add_custom_image_header == 'true'){
			add_custom_image_header( 'cc_header_style', 'cc_admin_header_style', 'cc_admin_header_image' );
		}
		
		// Define Content with
		$content_width  = "670";
		if($tkf->sidebar_position == "left and right"){
			$content_width  = "432";
		}
		
		// Define disable the admin bar
		if($tkf->bp_login_bar_top == 'off') {
			define( 'BP_DISABLE_ADMIN_BAR', true );
		}
		
		if($tkf->buddydev_search == 'true' && defined('BP_VERSION') && function_exists('bp_is_active')) {
				
			//* Add these code to your functions.php to allow Single Search page for all buddypress components*/
			//	Remove Buddypress search drowpdown for selecting members etc
			add_filter("bp_search_form_type_select", "cc_remove_search_dropdown"  );
			function cc_remove_search_dropdown($select_html){
			    return '';
			}
			
			remove_action( 'init', 'bp_core_action_search_site', 5 );//force buddypress to not process the search/redirect
			add_action( 'init', 'cc_bp_buddydev_search', 10 );// custom handler for the search
			
			function cc_bp_buddydev_search(){
			global $bp;
				if ( $bp->current_component == BP_SEARCH_SLUG )//if thids is search page
					bp_core_load_template( apply_filters( 'bp_core_template_search_template', 'search-single' ) );//load the single searh template
			}
			add_action("advance-search","cc_show_search_results",1);//highest priority
			
			/* we just need to filter the query and change search_term=The search text*/
			function cc_show_search_results(){
			    //filter the ajaxquerystring
			   	add_filter("bp_ajax_querystring","cc_global_search_qs",100,2);
			}
			
			//show the search results for member*/
			function cc_show_member_search(){
			    ?>
			   <div class="memberss-search-result search-result">
			   <h2 class="content-title"><?php _e("Members Results","cc");?></h2>
			  <?php locate_template( array( 'members/members-loop.php' ), true ) ;  ?>
			  <?php global $members_template;
				if($members_template->total_member_count>1):?>
					<a href="<?php echo bp_get_root_domain().'/'.BP_MEMBERS_SLUG.'/?s='.$_REQUEST['search-terms']?>" ><?php _e(sprintf("View all %d matched Members",$members_template->total_member_count),"cc");?></a>
				<?php 	endif; ?>
			</div>
			<?php	
			 }
			
			//Hook Member results to search page
			add_action("advance-search","cc_show_member_search",10); //the priority defines where in page this result will show up(the order of member search in other searchs)
			function cc_show_groups_search(){
			    ?>
			<div class="groups-search-result search-result">
			 	<h2 class="content-title"><?php _e("Group Search","cc");?></h2>
				<?php locate_template( array('groups/groups-loop.php' ), true ) ;  ?>
				
				<a href="<?php echo bp_get_root_domain().'/'.BP_GROUPS_SLUG.'/?s='.$_REQUEST['search-terms']?>" ><?php _e("View All matched Groups","cc");?></a>
			</div>
				<?php
			 //endif;
			  }
			
			//Hook Groups results to search page
			 if(bp_is_active( 'groups' ))
			    add_action("advance-search","cc_show_groups_search",10);
			
			/**
			 *
			 * Show blog posts in search
			 */
			function cc_show_site_blog_search(){
			    ?>
			 <div class="blog-search-result search-result">
			 
			  <h2 class="content-title"><?php _e("Blog Search","cc");?></h2>
			   
			   <?php locate_template( array( 'search-loop.php' ), true ) ;  ?>
			   <a href="<?php echo bp_get_root_domain().'/?s='.$_REQUEST['search-terms']?>" ><?php _e("View All matched Posts","cc");?></a>
			</div>
			   <?php
			  }
			
			//Hook Blog Post results to search page
			 add_action("advance-search","cc_show_site_blog_search",10);
			
			//show forums search
			function cc_show_forums_search(){
			    ?>
			 <div class="forums-search-result search-result">
			   <h2 class="content-title"><?php _e("Forums Search","cc");?></h2>
			  <?php locate_template( array( 'forums/forums-loop.php' ), true ) ;  ?>
			  <a href="<?php echo bp_get_root_domain().'/'.BP_FORUMS_SLUG.'/?s='.$_REQUEST['search-terms']?>" ><?php _e("View All matched forum posts","cc");?></a>
			</div>
			  <?php
			  }
			
			//Hook Forums results to search page
			if ( bp_is_active( 'forums' ) && bp_is_active( 'groups' ) && ( function_exists( 'bp_forums_is_installed_correctly' )))
				add_action("advance-search","cc_show_forums_search",20);
			
			
			//show blogs search result
			
			function cc_show_blogs_search(){
			
			if(!is_multisite())
				return;
				
			    ?>
			  <div class="blogs-search-result search-result">
			  <h2 class="content-title"><?php _e("Blogs Search","cc");?></h2>
			  <?php locate_template( array( 'blogs/blogs-loop.php' ), true ) ;  ?>
			  <a href="<?php echo bp_get_root_domain().'/'.BP_BLOGS_SLUG.'/?s='.$_REQUEST['search-terms']?>" ><?php _e("View All matched Blogs","cc");?></a>
			 </div>
			  <?php
			  }
			
			//Hook Blogs results to search page if blogs comonent is active
			 if(bp_is_active( 'blogs' ))
			    add_action("advance-search","cc_show_blogs_search",10);
			
			
			 //modify the query string with the search term
			function cc_global_search_qs(){
				if(empty($_REQUEST['search-terms']))
					return;
			
				return "search_terms=".$_REQUEST['search-terms'];
			}
			
			function cc_is_advance_search(){
			global $bp;
			if($bp->current_component == BP_SEARCH_SLUG)
				return true;
			return false;
			}
			remove_action( 'bp_init', 'bp_core_action_search_site', 7 );
				
		}
		
	}
	
	function generate_theme(){
		global $Theme_Generator;
		$Theme_Generator = new CC_Theme_Generator();
	
		$args = array('echo' => '0','hide_empty' => '0');
		$categories = get_categories($args);
		foreach($categories as $category) {
			tk_select_add_option( 'slideshow_cat', $category->slug , $category->name );
			tk_select_add_option( 'home_featured_posts_category', $category->slug , $category->name );
			
		}

		
		if(defined('BP_VERSION')){
			
			if ( bp_is_active( 'xprofile' ) ) :
				 if ( bp_has_profile() ) : 
					while ( bp_profile_groups() ) : bp_the_profile_group(); 
						tk_select_add_option( 'register_profile_groups',  bp_get_the_profile_group_id() , bp_get_the_profile_group_name() );
					endwhile;
				endif;
			endif; 
		
		}
		/*
		 * Hiding elemts by id 
		 */
		if(!defined('BP_VERSION'))
			tk_hide_element( 'buddypress' );
				
	}
	
	function framework_init(){
		
		// Registering the form where the data have to be saved
		$args['forms'] = array( 'cc-config' );
		$args['text_domain'] = 'my_text_domain';
		tk_framework( $args ); 
		
		 
	}
	 
	function set_globals(){
		global $tkf;
			
		$tkf = tk_get_values( 'cc-config' );
		
	}
	 
	function init_backend(){
		/*
		* WML
		*/
	 	tk_wml_parse_file( $this->require_path('/core/includes/admin/cc-config.xml') );
	}
	
	/**
	 * defines custom community init action
	 *
	 * this action fires on WP's init action and provides a way for the rest of custom community,
	 * as well as other dependend plugins, to hook into the loading process in an
	 * orderly fashion.
	 *
	 * @package Custom Community
	 * @since 1.8.3
	 */	
	function init_hook() {
		do_action( 'cc_init' );
	}
	
	/**
	 * defines custom community action
	 *
	 * this action tells custom community and other plugins that the main initialization process has
	 * finished.
	 * 
	 * @package Custom Community
	 * @since 1.8.3
	 */	
	function loaded() {
		do_action( 'cc_loaded' );
	}
	
	/**
	 * defines constants needed throughout the theme.
	 *
	 * these constants can be overridden in bp-custom.php or wp-config.php.
	 *
	 * @package Custom Community
	 * @since 1.8.3
	 */		
	function load_constants() {
		
		// The slug used when deleting a doc
		if ( !defined( 'CC_TEMPLATE_PATH' ) )
			define( 'CC_TEMPLATE_PATH', 'CC_TEMPLATE_PATH' );
			
	}	
	
	/**
	 * includes files needed by custom community
	 *
	 * @package Custom Community
	 * @since 1.8.3
	 */	
	function includes() {
		
		// TKF
		require_once($this->require_path('/core/includes/tkf/loader.php'));
			
		require_once($this->require_path('/_inc/ajax.php'));
		
		require_once($this->require_path('/custom-community-hooks.php'));
		
		
		// helper functions
		require_once($this->require_path('/core/includes/helper-functions.php'));
		
		// theme layout specific functions
		require_once($this->require_path('/core/includes/theme-generator/style.php'));
		require_once($this->require_path('/core/includes/theme-generator/theme-generator.php'));
		
		// wordpress specific functions
		require_once($this->require_path('/core/includes/shortcodes.php'));
		//require_once($this->require_path('/core/includes/wp/templatetags.php'));
		require_once($this->require_path('/core/includes/wp/widgets.php'));

		// buddypress specific functions
		if(defined('BP_VERSION')){
			require_once($this->require_path('/core/includes/bp/templatetags.php'));
			require_once($this->require_path('/core/includes/bp/buddydev-search.php'));	
		}
				
	}
	
	function add_header_script() { ?>
	
		<?php global $tkf; ?>
		
		<script type="text/javascript" charset="utf-8">
			jQuery(document).ready(function(){
				boxgrid();
				
				jQuery('.wp-pagenavi a, #navigation a').live('click', function(e){
					e.preventDefault();
					
					var link = jQuery(this).attr('href');
					
					jQuery.fx.interval = 100;
					<?php
					
					switch ($tkf->home_featured_posts_pagination_ajax_effect) {
						case 'hide_show':
								echo "jQuery('#featured_posts').hide(600).load(link + ' #list_posts', function(){ jQuery('#featured_posts').show('400')";			
							break;
						case 'fadeOut_fadeIn':
								echo "jQuery('#featured_posts').fadeOut('slow').load(link + ' #list_posts', function(){ jQuery('#featured_posts').fadeIn('400')";			
							break;
						case 'slideUp_slidedown':
								echo "jQuery('#featured_posts').slideUp('slow').load(link + ' #list_posts', function(){ jQuery('#featured_posts').slideDown('600')";			
							break;
						default:
								echo "jQuery('#featured_posts').fadeOut(600).load(link + ' #list_posts', function(){ jQuery('#featured_posts').fadeIn(400)";			
							break;
					}
					?>		
					boxgrid();
		
					});
				});
				function boxgrid(){
					jQuery('.boxgrid.captionfull').hover(function(){
						jQuery('.cover', this).stop().animate({top:'-90px'},{queue:false,duration:160});
					}, function() {
						jQuery(".cover", this).stop().animate({top:"0px"},{queue:false,duration:160});
					});
				}
			});
		</script>

	<?php }

	function add_footer_script() { ?>
	
		<style type="text/css" media="screen">
	      .custom-hover {
	        box-shadow: black 0 0 5px;
	        -moz-box-shadow: black 0 0 5px;
	        -webkit-box-shadow: black 0 0 5px;
	      }
	    </style>
	    
	    <script type="text/javascript">
	      jQuery(document).ready(function() {
	        jQuery.fn.brosho({						//call to the brosho plugin
	          position:           'bottom',			//initial position of the editor ('top', 'bottom', 'left', 'right')
	          elementHoverClass:  'custom-hover',	//a custom hover class
	          editorOpacity:      1					//full opacity on editor
	        });
	      });
	    </script>
		
	<?php }
		
	### add css and js
 	function enqueue_script() {
 		global $tkf;
		
	     if( is_admin() )
	        return;
	
		// on single blog post pages with comments open and threaded comments
		if(defined('BP_VERSION')){
			if ( is_singular() && bp_is_blog_page() && get_option( 'thread_comments' ) ) {
		    // enqueue the javascript that performs in-link comment reply fanciness
	        wp_enqueue_script( 'comment-reply' ); 
	    	}
	    } else {
			if ( is_singular() && comments_open() && get_option( 'thread_comments' ) ) { 
	        // enqueue the javascript that performs in-link comment reply fanciness
	        wp_enqueue_script( 'comment-reply' ); 
	    	}
	    }
	        
	    wp_deregister_script( 'ep-jquery-css' );
	        
	    wp_enqueue_script( 'jquery' );
		wp_enqueue_script( 'jquery-ui' );	
		wp_enqueue_script( 'jquery-ui-tabs' );
		
		wp_register_script('reflection',get_template_directory_uri() . '/_inc/js/reflection.js','','' );
		wp_enqueue_script('reflection');
		

		
		if($tkf->css_inspector == 'on'){
			
			wp_register_script('brosho',get_template_directory_uri() . '/_inc/js/jquery.brosho.js','','' );
			wp_enqueue_script('brosho');
			
			wp_register_style( 'brosho-css', get_template_directory_uri() .'/_inc/css/jquery.brosho.css' );
			wp_enqueue_style( 'brosho-css' );
			
		}
		
	}	
	
	/** check if it's a child theme or parent theme and return the correct path */
	function require_path($path){
	if( TEMPLATEPATH != STYLESHEETPATH && is_file(STYLESHEETPATH . $path) ): 	
        return STYLESHEETPATH . $path;
    else:
        return TEMPLATEPATH . $path;
    endif;
	}
}

?>