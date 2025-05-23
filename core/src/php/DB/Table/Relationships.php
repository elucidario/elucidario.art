<?php
/**
 * Relationships class.
 *
 * @since 0.2.0
 * @package elucidario/pkg-core
 */

namespace LCDR\DB\Table;

// @codeCoverageIgnoreStart
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}
if ( ! defined( 'LCDR_PATH' ) ) {
	exit;
}
// @codeCoverageIgnoreEnd

/**
 * Relationships table class.
 */
final class Relationships extends Table {
	/**
	 * Table name.
	 *
	 * @var string
	 */
	protected $name = 'relationships';

	/**
	 * Table schema.
	 */
	protected function set_schema() {
		$this->schema = '
            rel_id bigint(20) unsigned NOT NULL AUTO_INCREMENT,
            subject bigint(20) unsigned NOT NULL,	
            predicate varchar(30) NOT NULL,
            object bigint(20) unsigned NOT NULL,
            rel_order int(11) NOT NULL,
            PRIMARY KEY (rel_id),
            KEY subject (subject),
            KEY predicate (predicate),
            KEY object (object),
            KEY rel_order (rel_order)
        ';
	}
}
