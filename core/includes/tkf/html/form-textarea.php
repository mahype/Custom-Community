<?php
class TK_Form_Textarea extends TK_Form_Element{
		$args = wp_parse_args($args, $defaults);
		parent::__construct( $args );
		$this->extra = $extra;
		$this->rows = $rows;
	/**