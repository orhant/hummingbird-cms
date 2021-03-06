<?php

namespace App\Widget;

use App\Helper\Language;
use App\Helper\State;
use App\Helper\Uri;
use App\Mvc\Model\UcmItem;

class LanguageSwitcher extends Widget
{
	public function getRenderData(): array
	{
		$displayUcmItem = State::getMark('displayUcmItem');
		$languages      = Language::getExistsLanguages();
		$active         = Language::getActiveLanguage();
		$routes         = [];

		if ($displayUcmItem instanceof UcmItem)
		{
			foreach ($languages as $language)
			{
				$code = $language->get('locale.code');
				$sef  = $language->get('locale.sef');

				if (($translations = $displayUcmItem->getTranslations($code))
					&& !empty($translations['route'])
				)
				{
					$routes[$code] = Uri::getInstance(['uri' => $translations['route'], 'language' => $sef]);
				}
				else
				{
					$routes[$code] = Uri::getInstance(['uri' => $displayUcmItem->route, 'language' => $sef]);
				}
			}
		}
		else
		{
			foreach ($languages as $language)
			{
				$code          = $language->get('locale.code');
				$sef           = $language->get('locale.sef');
				$routes[$code] = Uri::getInstance(['language' => $sef])->toString();

				if (empty($routes[$code]))
				{
					$routes[$code] = '/';
				}
			}
		}

		return [
			'languages' => $languages,
			'active'    => $active,
			'routes'    => $routes,
		];
	}
}