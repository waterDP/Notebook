const through = require('./through2');
const fromArray = require('./from2-array');
const fs = require('fs');

console.log(fromArray);
function concatFiles(destination, files, callback) {
	const destStream = fs.createWriteStream(destination);
	fromArray.obj(files)
		.pipe(through.obj((file, enc, done) => {
			const src = fs.createReadStream(file);
			src.pipe(destStream, {end: false});
			src.on('end', done);
		}))
		.on('finish', () => {
			destStream.end();
			callback();
		});
}

// module.exports = concatFiles
// 
concatFiles(process.argv[2], process.argv.slice(3), () => {
	console.log('Files Concatenated successfully');
});