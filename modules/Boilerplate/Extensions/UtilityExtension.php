<?php

namespace modules\Boilerplate\Extensions;

use Twig\Extension\AbstractExtension;
use Twig\TwigFunction;

class UtilityExtension extends AbstractExtension
{
    public function getFunctions(): array
    {
        return [
            new TwigFunction('get_env', [$this, 'get_env'])
        ];
    }

    public function get_env($envVar) : string
    {
        return getenv($envVar);
    }
}