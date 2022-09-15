<?php

namespace modules\Boilerplate\Filters;

use Twig\Extension\AbstractExtension;
use Twig\TwigFilter;

class RevAsset extends AbstractExtension
{
    private string $manifestFile;
    private string $distFolder;

    public function __construct()
    {
        $this->manifestFile = THEME_BASE_PATH . '/' . getenv('REV_MANIFEST_FILE');
        $this->distFolder = THEME_BASE_PATH . '/' . getenv('DIST_FOLDER');
    }

    public function getFilters(): array
    {
        return [
            new TwigFilter('revAsset', [$this, 'revAsset'])
        ];
    }

    public function revAsset($asset): string
    {
        if (!file_exists($this->manifestFile))
            return $asset;

        $file = json_decode(file_get_contents($this->manifestFile), true);

        if (!isset($file[$asset]))
            return $asset;

        if (!file_exists($this->distFolder . '/' . $file[$asset]))
            return $asset;

        return $file[$asset];
    }
}