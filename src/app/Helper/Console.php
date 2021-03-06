<?php

namespace App\Helper;

use App\Queue\Composer;
use MaiVu\Php\Registry;

class Console
{
	/**
	 * @var Registry
	 */
	protected $arguments;

	protected function __construct()
	{
		$this->arguments = new Registry;

		foreach (($_SERVER['argv'] ?? []) as $arg)
		{
			if (strpos($arg, '--') === 0)
			{
				if (false === strpos($arg, '='))
				{
					$this->arguments->set(ltrim($arg, '-'), '');
				}
				else
				{
					list($k, $v) = explode('=', $arg, 2);
					$this->arguments->set(ltrim($k, '-'), trim($v, '"\''));
				}
			}
		}
	}

	public static function getInstance(): Console
	{
		static $instance = null;

		if (null === $instance)
		{
			$instance = new Console;
		}

		return $instance;
	}

	public function getArguments(): Registry
	{
		return $this->arguments;
	}

	public function getArgument($name, $default = null, $filter = null)
	{
		return $this->arguments->get($name, $default, $filter);
	}

	public function hasArgument($name): bool
	{
		return $this->arguments->has($name);
	}

	public function error(string $message)
	{
		fwrite(STDERR, PHP_EOL . $message);
	}

	public function out(string $message)
	{
		fwrite(STDOUT, PHP_EOL . $message);
	}

	public function executeNow(...$args)
	{
		return $this->execute(false, ...$args);
	}

	public function execute($queue, ...$args)
	{
		$cmd = ($_SERVER['_'] ?? 'php') . ' ' . PUBLIC_PATH . '/index.php';

		if ($args)
		{
			$cmd .= ' ' . implode(' ', $args);
		}

		$cmd .= ' > /dev/null 2>&1' . ($queue ? ' &' : '');

		return shell_exec($cmd);
	}

	public function executeQueue(...$args)
	{
		return $this->execute(true, ...$args);
	}

	public function composer(string $command, string $pathToJson)
	{
		Queue::add(
			Composer::class,
			[
				'command'    => $command,
				'pathToJson' => $pathToJson,
			]
		);
	}
}