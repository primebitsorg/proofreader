/* eslint-disable import/no-named-as-default-member */
import { deleteAsync } from 'del';
import gulp from 'gulp';
import cleanPackageJson from 'gulp-clean-package';
import gulpSourceMaps from 'gulp-sourcemaps';
import gulpTypescript from 'gulp-typescript';
import mergeStream from 'merge-stream';

import babel from 'gulp-babel';
import sourcemaps from 'gulp-sourcemaps';

const buildDir = 'dist';

// Helpers
function tsCompilerFactory(outPath, settings) {
	return function compileTS() {
		const tsProject = gulpTypescript.createProject('tsconfig.json', settings);

		return gulp
			.src(['src/**/!(*.test).{ts,tsx}', '!src/**/__tests__/**', '!src/demo.ts'])
			.pipe(gulpSourceMaps.init())
			.pipe(tsProject())
			.pipe(gulpSourceMaps.write('./sourcemaps'))
			.pipe(gulp.dest(outPath));
	};
}

function copyNotTranspilableSourcesFactory(outPath) {
	return function copyNotTranspilableSources() {
		return gulp.src([`src/**/!(*.test).{js,d.ts,json}`]).pipe(gulp.dest(outPath));
	};
}

// Main
function buildESM() {
	const out = buildDir;

	return gulp.parallel([
		// Compile TS files
		Object.assign(tsCompilerFactory(out, { module: 'esnext' }), {
			displayName: 'TSC:esnext',
		}),

		// Copy js files and declarations
		Object.assign(copyNotTranspilableSourcesFactory(out), {
			displayName: 'CopyPureSources:esnext',
		}),
	]);
}

function makeCJSFromESM() {
	const esm = buildDir;
	const out = `${buildDir}/cjs`;

	return mergeStream(
		// Copy type declarations
		gulp.src([`${esm}/**/*.ts`]),
		// Convert to CJS
		gulp
			.src([`${esm}/**/*.js`])
			.pipe(sourcemaps.init())
			.pipe(
				babel({
					plugins: ['@babel/plugin-transform-modules-commonjs'],
				}),
			)
			.pipe(sourcemaps.write()),
	).pipe(gulp.dest(out));
}

function copyMetaFiles() {
	return mergeStream(
		// Clean package.json
		gulp.src(['./package.json']).pipe(
			cleanPackageJson({
				publicProperties: ['publishConfig'],
				additionalProperties: {
					bin: {
						pedantify: './cjs/bin/pedantify.js',
					},
				},
			}),
		),
		// Copy other
		gulp.src(['README.md', 'LICENSE']),
		// Copy bin directory
		gulp.src('bin/**/**', { base: '.' }),
	).pipe(gulp.dest(buildDir));
}

function clean() {
	return deleteAsync(buildDir);
}

// Compilations
const fullBuild = gulp.series([clean, copyMetaFiles, buildESM(), makeCJSFromESM]);

export default fullBuild;
