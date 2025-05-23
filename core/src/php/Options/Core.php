<?php
/**
 * LCDR\Options\Core
 *
 * @since 0.1.0
 * @package elucidario/pkg-core
 */

namespace LCDR\Options;

// @codeCoverageIgnoreStart
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}
if ( ! defined( 'LCDR_PATH' ) ) {
	exit;
}
// @codeCoverageIgnoreEnd

/**
 * Core options class.
 */
class Core {
	/**
	 *     __             _ __
	 *    / /__________ _(_) /______
	 *   / __/ ___/ __ `/ / __/ ___/
	 *  / /_/ /  / /_/ / / /_(__  )
	 *  \__/_/   \__,_/_/\__/____/
	 */
	use \LCDR\Utils\singleton, \LCDR\Utils\debug;

	/**
	 * Painéis de opções.
	 *
	 * @var array
	 */
	public $panels;

	/**
	 * Campos de opções.
	 *
	 * @var array
	 */
	public $options;

	/**
	 * Construtor.
	 */
	public function __construct() {
		/**
		 * Ação executada antes da construção do objeto de opções.
		 *
		 * @wp-action lcdr_options_before_construct
		 */
		do_action( lcdr_hook( array( 'options', 'before', 'construct' ) ), $this );
		add_action( 'admin_menu', array( $this, 'add_admin_menu' ) );
		add_filter( lcdr_hook( array( 'script', 'data' ) ), array( $this, 'script_data' ) );

		/**
		 * Ação executada após a construção do objeto de opções.
		 *
		 * @wp-action lcdr_options_after_construct
		 */
		do_action( lcdr_hook( array( 'options', 'after', 'construct' ) ), $this );
	}

	/**
	 * Adiciona o menu de opções no painel de administração.
	 *
	 * @return void
	 */
	public function add_admin_menu() {
		add_menu_page(
			__( 'Opções', 'lcdr' ),
			__( 'Opções', 'lcdr' ),
			'manage_options',
			'lcdr-options',
			array( $this, 'display_admin_page' ),
			'dashicons-admin-generic',
			200
		);
	}

	/**
	 * Exibe a página de opções no painel de administração.
	 *
	 * @return void
	 */
	public function display_admin_page() {
		lcdr_enqueue_script();
		echo '<div id="lcdr"></div>';
	}

	/**
	 * Script data
	 *
	 * @param object $data
	 * @return object
	 */
	public function script_data( $data ) {
		if ( str_contains( $data->hook, 'lcdr-options' ) ) {
			$data->type = 'options';
		}
		return $data;
	}
}
