<?php

namespace App\Form\Field;

use DateTimeZone;
use MaiVu\Php\Form\Field\Select;

class CmsTimezone extends Select
{
	public function getOptions()
	{
		static $timezones = null;

		if (null === $timezones)
		{
			$timezones = [
				[
					'value' => 'UTC',
					'text'  => 'Universal Time, Coordinated (UTC)',
				]
			];
			$groups    = [
				'Africa',
				'America',
				'Antarctica',
				'Arctic',
				'Asia',
				'Atlantic',
				'Australia',
				'Europe',
				'Indian',
				'Pacific',
			];

			foreach (DateTimeZone::listIdentifiers() as $zone)
			{
				// Time zones not in a group we will ignore.
				if (false === strpos($zone, '/'))
				{
					continue;
				}

				// Get the group/locale from the timezone.
				list ($group, $locale) = explode('/', $zone, 2);

				// Only use known groups.
				if (in_array($group, $groups))
				{
					// Initialize the group if necessary.
					if (!isset($timezones[$group]))
					{
						$timezones[$group] = [
							'label'    => $group,
							'optgroup' => [],
						];
					}

					if (!empty($locale))
					{
						$timezones[$group]['optgroup'][] = [
							'value' => $zone,
							'text'  => str_replace('_', ' ', $locale),
						];
					}
				}
			}
		}

		return array_values($timezones);
	}
}
