var fs = require('fs')
var del = require('del')
var runSequence = require('run-sequence')
var autoprefixer = require('autoprefixer')
var gulp = require('gulp')
var sass = require('gulp-sass')
var scsslint = require('gulp-scss-lint')
var rename = require('gulp-rename')
var postcss = require('gulp-postcss')
var imagemin = require('gulp-imagemin')
var bump = require('gulp-bump')
var concat = require('gulp-concat')
var replace = require('gulp-replace')
var uglify = require('gulp-uglify')
var plumber = require("gulp-plumber")
var sourcemaps = require('gulp-sourcemaps')
var gap = require('gulp-append-prepend')

var paths = {
    dist: './build/',
    src: './app/',
    components: 'components/'
}

var staticFiles = [
    paths.src + 'images/**/*',
    paths.src + 'font/**/*',
    paths.src + 'components/**',
    paths.src + 'css-thirdparty/**.*',
    paths.src + 'js/thirdparty/**.*'
]


gulp.task('clean', function(cb) {
	return del([paths.dist + '**/*'], cb);
})

gulp.task('scss-lint', function() {
  // return gulp.src(cssSrc)
  return gulp.src('./app/css/*.scss')
    .pipe(scsslint({
      'config': 'scss-lint.yml',
      'maxBuffer': 30000000000000000000 * 1024
    }))
})
gulp.task('scss-lint:watch', function() {
    gulp.watch('./app/css/*.scss', ['scss-lint'])
})

gulp.task('styles', function() {
    
    var sassOptions = {
        outputStyle: 'compressed'
    }

    var processors = [
        autoprefixer({ 
            browsers: [
                'last 2 versions'
            ]
        })
    ]

    return gulp.src('./app/css/**')
        .pipe(plumber()) // onerror won't break gulp task
        .pipe(sourcemaps.init())
        .pipe(sass(sassOptions).on('error', sass.logError))
        .pipe(postcss(processors))
        .pipe(sourcemaps.write('./'))
        .pipe(gulp.dest('./build/css/'))
})

gulp.task('styles:watch', function() {
    gulp.watch('./app/css/**', ['styles'])
})

gulp.task('scripts', function(){
  return gulp.src('./app/js/app.js')
    .pipe(sourcemaps.init())
    .pipe(concat('app.min.js'))
    .pipe(sourcemaps.write())
    .pipe(gulp.dest('build/js'))
});

gulp.task('scripts:watch', function() {
    gulp.watch('./app/js/**', ['scripts'])
})

gulp.task('images', function(){
  return gulp.src('app/images/**/*.+(png|jpg|gif|svg)')
  .pipe(imagemin())
  .pipe(gulp.dest('build/images'))
});

gulp.task('images:watch', function() {
    gulp.watch(paths.src + '**/*.+(png|jpg|gif|svg)', ['images'])
})

gulp.task('html', function() {
	
    return gulp.src(paths.src + '*.html')
        .pipe(replace('<% header %>', fs.readFileSync(paths.src + paths.components + 'header.html')))
        .pipe(replace('<% footer %>', fs.readFileSync(paths.src + paths.components + 'footer.html')))
		.pipe(gulp.dest(paths.dist))
})

gulp.task('html:watch', function() {
	gulp.watch(paths.src + '*.html', ['html'])
})

gulp.task('static', function() {
    
    return gulp.src(staticFiles, {
            base: paths.src
        })
        .pipe(gulp.dest(paths.dist));
})

gulp.task('static:watch', function() {
	gulp.watch(staticFiles, ['static'])
})

gulp.task('bump', function() {
	return gulp.src(['./bower.json', './package.json'])
			.pipe(bump({
				type: 'patch'
			}))
			.pipe(gulp.dest(paths.dist))
})

gulp.task('build', function() {
	runSequence('clean', ['scripts', 'scss-lint', 'styles', 'images', 'html', 'static']);
})

gulp.task('dev', ['scss-lint:watch', 'styles:watch', 'scripts:watch', 'images:watch', 'html:watch', 'static:watch'])

