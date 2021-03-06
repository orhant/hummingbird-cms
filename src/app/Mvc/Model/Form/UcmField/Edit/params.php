<?php

return [
	[
		'name'    => 'required',
		'type'    => 'Switcher',
		'label'   => 'attr-required',
		'value'   => 'Y',
		'filters' => ['yesNo'],
	],
	[
		'name'      => 'hint',
		'type'      => 'Text',
		'label'     => 'placeholder',
		'translate' => true,
		'filters'   => ['string', 'trim'],
		'class'     => 'uk-input',
	],
	[
		'name'     => 'rules',
		'type'     => 'Select',
		'label'    => 'field-rules',
		'multiple' => true,
		'options'  => [
			[
				'value' => 'Regex',
				'text'  => 'regex-pattern',
			],
		],
		'rules'    => ['Options'],
		'class'    => 'uk-select',
	],
	[
		'name'    => 'regex',
		'type'    => 'Text',
		'label'   => 'regex-string',
		'filters' => ['string', 'trim'],
		'showOn'  => 'rules:Regex',
	],
	[
		'name'    => 'checkboxValue',
		'type'    => 'Text',
		'label'   => 'checkbox-value',
		'filters' => ['string', 'trim'],
		'showOn'  => '.type:Check',
		'class'   => 'uk-input',
	],
	[
		'name'    => 'checked',
		'type'    => 'Switcher',
		'label'   => 'checked',
		'value'   => 'Y',
		'filters' => ['yesNo'],
		'showOn'  => '.type:Check,Switcher',
	],
	[
		'name'    => 'value',
		'type'    => 'TextArea',
		'label'   => 'default-value',
		'rows'    => 2,
		'cols'    => 15,
		'filters' => ['string', 'trim'],
		'showOn'  => '.type:!Check,Switcher',
		'class'   => 'uk-textarea',
	],
	[
		'name'    => 'translate',
		'type'    => 'Switcher',
		'value'   => 'Y',
		'label'   => 'translatable',
		'filters' => ['yesNo'],
	],
	[
		'name'          => 'multiple',
		'type'          => 'Switcher',
		'label'         => 'multiple',
		'rows'          => 2,
		'cols'          => 15,
		'filters'       => ['yesNo'],
		'showOn'        => '.type:Select',
	],
	[
		'name'    => 'cols',
		'type'    => 'Number',
		'label'   => 'cols',
		'min'     => 1,
		'value'   => 15,
		'filters' => ['uint'],
		'showOn'  => '.type:TextArea',
		'class'   => 'uk-input',
	],
	[
		'name'    => 'rows',
		'type'    => 'Number',
		'label'   => 'rows',
		'min'     => 1,
		'value'   => 3,
		'filters' => ['uint'],
		'showOn'  => '.type:TextArea',
		'class'   => 'uk-input',
	],
	[
		'name'      => 'options',
		'type'      => 'CmsOptionRepeat',
		'label'     => 'options',
		'translate' => true,
		'showOn'    => '.type:Select,Radio,CheckList',
	],
];