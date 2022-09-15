const env = process.env.NODE_ENV ?? 'dev';

import { readFile } from 'fs/promises';

import browsersync from "browser-sync";

import dartSass from 'sass';
import autoprefixer from "autoprefixer";
import cssnano from "cssnano";
import tailwindcss from "tailwindcss";
import tailwindConfig from './tailwind.config.js';

import gulp from 'gulp';
import gulpImagemin, {gifsicle, mozjpeg, optipng, svgo} from 'gulp-imagemin';
import gulpSass from "gulp-sass";
import sassglob from "gulp-sass-glob";
import postcss from "gulp-postcss";
import sourcemaps from "gulp-sourcemaps";
import newer from "gulp-newer";
import minify from "gulp-minify";
import purgecss from "gulp-purgecss";
import concat from "gulp-concat";
import favicons from 'gulp-favicons';
import rev from "gulp-rev";
import revDel from "rev-del";
import plumber from "gulp-plumber";
import notify from "gulp-notify";
import {generate} from "critical";
import clean from "gulp-dest-clean";

const sass = gulpSass(dartSass);


import webpack from 'webpack';
import webpackStream from 'webpack-stream';
import {merge} from 'webpack-merge';

import webpackCommon from './webpack.common.js';
import webpackDev from './webpack.dev.js';
import webpackProd from './webpack.prod.js';

const webpackConfig = merge(env === 'prod' ? webpackProd : webpackDev, webpackCommon);

const packageJson = JSON.parse(
        await readFile(
            new URL('./package.json', import.meta.url)
        )
    );

function browserSync(done) {

    if (packageJson.env.local === "") {
        browsersync.init({
            server: {
                baseDir: packageJson.paths.public
            }
        });
    }
    else {
        browsersync.init({
            proxy: packageJson.env.local
        });
    }
    done();

}

function browserSyncReload(done) {

    browsersync.reload();
    done();

}

function css() {

    const cssFiles = [
        packageJson.paths.assets.scss + packageJson.files.assets.scss
    ];

    for (var i = 0; i < packageJson.cssDependencies.length; i++) {
        cssFiles.unshift(packageJson.paths.dependencies + packageJson.cssDependencies[i]);
    }

    const plugins = [
        tailwindcss(tailwindConfig),
        // require("@tailwindcss/jit"),
        autoprefixer()
    ];

    return gulp
        .src(cssFiles)
        .pipe(plumber({ errorHandler: notify.onError("Error [css]: <%= error.message %>") }))
        .pipe(concat(packageJson.files.dist.css))
        .pipe(sourcemaps.init())
        .pipe(sassglob())
        .pipe(sass())
        .pipe(postcss(plugins))
        .pipe(sourcemaps.write("/"))
        .pipe(gulp.dest(packageJson.paths.public + packageJson.paths.dist.css))
        .pipe(browsersync.stream());

}

function js() {
    return gulp
        .src(packageJson.paths.assets.base + packageJson.files.assets.js)
        .pipe(plumber({ errorHandler: notify.onError("Error [js]: <%= error.message %>") }))
        .pipe(webpackStream(webpackConfig), webpack)
        // .pipe(concat(packageJson.files.dist.js)) // If you use Vue, you should comment this line
        .pipe(sourcemaps.init())
        .pipe(sourcemaps.write("/"))
        .pipe(gulp.dest(packageJson.paths.public + packageJson.paths.dist.js))
        .pipe(browsersync.stream());
}

function minifyCss() {

    return gulp
        .src(packageJson.paths.public + packageJson.paths.dist.css + packageJson.files.dist.css)
        .pipe(plumber({ errorHandler: notify.onError("Error [css]: <%= error.message %>") }))
        .pipe(postcss([cssnano()]))
        .pipe(gulp.dest(packageJson.paths.public + packageJson.paths.dist.css));

}

function minifyJs() {

    return gulp
        .src(packageJson.paths.public + packageJson.paths.dist.js + packageJson.files.dist.js)
        .pipe(plumber({ errorHandler: notify.onError("Error [js]: <%= error.message %>") }))
        .pipe(
            minify(
                {
                    ext:{
                        min:".js"
                    },
                    noSource: true
                }
            )
        )
        .pipe(gulp.dest(packageJson.paths.public + packageJson.paths.dist.js));

}

function images() {

    return gulp
        .src(packageJson.paths.assets.images + "**/*")
        .pipe(plumber({ errorHandler: notify.onError("Error [images]: <%= error.message %>") }))
        .pipe(clean(packageJson.paths.public + packageJson.paths.dist.images, 'favicon/**'))
        .pipe(newer(packageJson.paths.public + packageJson.paths.dist.images))
        .pipe(
            gulpImagemin(
                [
                    gifsicle({ interlaced: true }),
                    mozjpeg({ progressive: true }),
                    optipng({ optimizationLevel: 5 }),
                    svgo({
                        plugins: [
                            {
                                name: 'preset-default',
                                params: {
                                    overrides: {
                                        cleanupIDs: false
                                    },
                                },
                            }
                        ]
                    })
                ],
                { verbose: true }
            )
        )
        .pipe(gulp.dest(packageJson.paths.public + packageJson.paths.dist.images));

}

function favicon() {

    return gulp
        .src(packageJson.paths.assets.favicon + "favicon.{jpg,png}")
        .pipe(plumber({ errorHandler: notify.onError("Error [favicon]: <%= error.message %>") }))
        .pipe(newer(packageJson.paths.public + packageJson.paths.dist.favicon + "favicon.{jpg,png}"))
        .pipe(
            favicons({
                appName: packageJson.name,
                appDescription: packageJson.description,
                background: '#fff',
                path: "/" + packageJson.paths.dist.favicon,
                display: 'standalone',
                orientation: 'any',
                version: packageJson.version,
                html: 'favicons.html',
                pipeHTML: true,
                replace: true,
            })
        )
        .pipe(gulp.dest(packageJson.paths.public + packageJson.paths.dist.favicon));
}

function faviconHtml() {
    return gulp
        .src(
            packageJson.paths.public + packageJson.paths.dist.favicon + "favicons.html"
        )
        .pipe(
            gulp.dest(packageJson.paths.templates + "_components/")
        );
}

function purgeCss() {

    var whitelistPatterns = [];
    for (let i = 0; i < packageJson.purgeCss.whitelistPatterns.length; i++) {
        whitelistPatterns.push(new RegExp(packageJson.purgeCss.whitelistPatterns[i], ""));
    }

    return gulp
        .src(packageJson.paths.public + packageJson.paths.dist.css + packageJson.files.dist.css)
        .pipe(plumber({ errorHandler: notify.onError("Error [purgeCss]: <%= error.message %>") }))
        .pipe(
            purgecss({
                content: [
                    packageJson.paths.templates + "**/*.{html,twig,vue}",
                    packageJson.paths.public + packageJson.paths.dist.base + "**/*.{js}"
                ],
                whitelist: packageJson.purgeCss.whitelist,
                whitelistPatterns: whitelistPatterns,
                whitelistPatternsChildren: whitelistPatterns,
                defaultExtractor: content => content.match(/[^<>"'`\s]*[^<>"'`\s:]/g) || []
            })
        )
        .pipe(gulp.dest(packageJson.paths.public + packageJson.paths.dist.css));

}

function doSynchronousLoop(data, processData, done) {

    if (data.length > 0) {
        const loop = (data, i, processData, done) => {
            processData(data[i], i, () => {
                if (++i < data.length) {
                    loop(data, i, processData, done);
                } else {
                    done();
                }
            });
        };
        loop(data, 0, processData, done);
    } else {
        done();
    }

}

const processCriticalCSS = (element, i, callback) => {

    generate(
        {
            inline: false,
            base: './',
            src: packageJson.env.local + element.uri,
            css: [packageJson.paths.public + packageJson.paths.dist.css + packageJson.files.dist.css],
            width: 1920,
            height: 1200,
            target: {
                css: packageJson.paths.templates + packageJson.critical.dest + element.slug + ".css"
            },
            minify: true,
            extract: true
        }
    );

    callback();

}

function criticalCss(done) {

    doSynchronousLoop(
        packageJson.critical.elements,
        processCriticalCSS,
        () => {
            done();
        }
    );

}

function revCssJs(done) {

    return gulp
        .src(
            [
                packageJson.paths.public + packageJson.paths.dist.css + packageJson.files.dist.css,
                packageJson.paths.public + packageJson.paths.dist.js + packageJson.files.dist.js
            ],
            {
                base: packageJson.paths.public + packageJson.paths.dist.base
            }
        )
        .pipe(rev())
        .pipe(gulp.dest(packageJson.paths.public + packageJson.paths.dist.base))
        .pipe(rev.manifest(
            {
                base: "./"
            }
        ))
        .pipe(revDel(
            {
                oldManifest: "./rev-manifest.json",
                dest: packageJson.paths.public + packageJson.paths.dist.base
            }
        ))
        .pipe(gulp.dest("./"));
}

function watch(done) {

    gulp.watch(
        [
            "package.json",
            packageJson.files.tailwind,
            packageJson.paths.assets.base + "**/*.{css,scss,vue}",
        ],
        css
    );

    gulp.watch(
        [
            "package.json",
            packageJson.paths.assets.base + "**/*.{js,vue}"
        ],
        js
    );

    gulp.watch(packageJson.paths.assets.images + "**/*", images);

    gulp.watch(packageJson.paths.public + "**/*", browserSyncReload);

    gulp.watch(packageJson.paths.templates + "**/*.{html,twig}", browserSyncReload);

    gulp.watch(packageJson.paths.templates + "**/*.{html,twig}", css);

    done();

}

const dev = gulp.series(css, js, images, watch, browserSync);

const prod = gulp.series(
    gulp.parallel(css, js),
    minifyCss,
    minifyJs,
    purgeCss,
    criticalCss,
    revCssJs,
    favicon,
    faviconHtml,
    images
);

export {
    browserSync,
    browserSyncReload,
    css,
    js,
    images,
    favicon,
    faviconHtml,
    minifyCss,
    minifyJs,
    purgeCss,
    criticalCss,
    revCssJs,
    watch,
    dev,
    prod
};
