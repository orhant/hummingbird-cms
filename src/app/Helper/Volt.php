<?php

namespace App\Helper;

use MaiVu\Php\Registry;
use Phalcon\Mvc\View\Engine\Volt\Compiler;

class Volt
{
	/** @var Compiler */
	protected static $compiler;

	public function __construct(Compiler $compiler)
	{
		static::$compiler = $compiler;
	}

	public static function getCompiler()
	{
		return static::$compiler;
	}

	public static function voidFilter($arguments)
	{

	}

	public static function publicResource($baseFile, bool $image = false)
	{
		$baseFile = trim($baseFile, '/\\\\.');

		if (Uri::isClient('site'))
		{
			$publicResource = TPL_SITE_PATH . '/public/' . $baseFile;

			if (is_file($publicResource))
			{
				return ROOT_URI . '/resources/public/' . Template::getTemplate()->id . '/' . $baseFile;
			}
		}

		return ROOT_URI . '/' . $baseFile;
	}

	public static function css()
	{
		$assets = Service::assets();

		ob_start();
		$assets->outputCss();
		$assets->outputInlineCss();

		return ob_get_clean();
	}


	public static function js()
	{
		$assets = Service::assets();

		ob_start();
		$assets->outputJs();
		$assets->outputInlineJs();

		return ob_get_clean();
	}

	public function compileFunction($name, $resolvedArgs, $exprArgs)
	{
		$helperPrefix = Constant::NAMESPACE_HELPER . '\\';

		switch ($name)
		{
			case '_':
				return $helperPrefix . 'Text::_(' . $resolvedArgs . ')';

			case 'addAssets':
				return $helperPrefix . 'Assets::add(' . $resolvedArgs . ')';

			case 'widget':
				return $helperPrefix . 'Widget::renderPosition(' . $resolvedArgs . ')';

			case 'route':
				return $helperPrefix . 'Uri::route(' . $resolvedArgs . ')';

			case 'currentLink':
				return $helperPrefix . 'Uri::getActive()->toString()';

			case 'currentUri':
				return $helperPrefix . 'Uri::getActive()->toPath()';

			case 'rootUri':
				return 'constant(\'ROOT_URI\')';

			case 'baseUri':
				return $helperPrefix . 'Uri::getBaseUriPrefix()';

			case 'isHome':
				return $helperPrefix . 'Uri::isHome()';

			case 'isAdmin':
				return $helperPrefix . 'Uri::isClient(\'administrator\')';

			case 'isSite':
				return $helperPrefix . 'Uri::isClient(\'site\')';

			case 'menu':
				return $helperPrefix . 'Menu::renderMenu(' . $resolvedArgs . ')';

			case 'trigger':
				return $helperPrefix . 'Event::trigger(' . $resolvedArgs . ')';

			case 'user':
				return $helperPrefix . 'User::getInstance(' . $resolvedArgs . ')';

			case 'isEmpty':
				return 'empty(' . $resolvedArgs . ')';

			case 'isSet':
				return 'isset(' . $resolvedArgs . ')';

			case 'icon':
				return $helperPrefix . 'IconSvg::render(' . $resolvedArgs . ')';

			case 'csrfInput':
				return $helperPrefix . 'Form::tokenInput(' . $resolvedArgs . ')';

			case 'csrf':
				return $helperPrefix . 'Form::getToken(' . $resolvedArgs . ')';

			case 'price':
				return $helperPrefix . 'Utility::priceFormat(' . $resolvedArgs . ')';

			case 'public':
				return $helperPrefix . 'Volt::publicResource(' . $resolvedArgs . ')';

			case 'css':
				return $helperPrefix . 'Volt::css()';

			case 'js':
				return $helperPrefix . 'Volt::js()';

			case 'reCaptcha':
				return $helperPrefix . 'ReCaptcha::render()';

			case 'metadata':
				return $helperPrefix . 'MetaData::getInstance()->render()';

			case 'helper':
				$helperMethod = str_replace('\'', '', static::$compiler->expression($exprArgs[0]['expr']));
				$resolvedArgs = [];

				for ($i = 1, $n = count($exprArgs); $i < $n; $i++)
				{
					$resolvedArgs[] = static::$compiler->expression($exprArgs[$i]['expr']);
				}

				$resolvedArgs = implode(',', $resolvedArgs);

				return $helperPrefix . $helperMethod . '(' . $resolvedArgs . ')';

			case 'registry':
				return Registry::class . '::create(' . $resolvedArgs . ')';

			default:

				if (function_exists($name))
				{
					return $name . '(' . $resolvedArgs . ')';
				}

		}
	}

	public function compileFilter($name, $resolvedArgs, $exprArgs)
	{
		switch ($name)
		{
			case 'j2nl':
				return 'implode(PHP_EOL, ' . $resolvedArgs . ')';

			case 'void':
				return 'App\\Helper\\Volt::voidFilter(' . $resolvedArgs . ')';

			default:

				if (function_exists($name))
				{
					return $name . '(' . $resolvedArgs . ')';
				}
		}
	}
}