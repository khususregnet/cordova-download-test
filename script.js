window.requestFileSystem(window.TEMPORARY, 5 * 1024 * 1024, function (fs) {
 
    console.log('file system open: ' + fs.name);
 
    // Make sure you add the domain name to the Content-Security-Policy <meta> element.
    var url = 'http://cordova.apache.org/static/img/cordova_bot.png';
    // Parameters passed to getFile create a new file or return the file if it already exists.
    fs.root.getFile('downloaded-image.png', { create: true, exclusive: false }, function (fileEntry) {
        download(fileEntry, url, true);
 
    }, onErrorCreateFile);
 
}, onErrorLoadFs);


function download(fileEntry, uri, readBinaryData) {
 
    var fileTransfer = new FileTransfer();
    var fileURL = fileEntry.toURL();
 
    fileTransfer.download(
        uri,
        fileURL,
        function (entry) {
            console.log("Successful download...");
            console.log("download complete: " + entry.toURL());
            if (readBinaryData) {
              // Read the file...
              readBinaryFile(entry);
            }
            else {
              // Or just display it.
              displayImageByFileURL(entry);
            }
        },
        function (error) {
            console.log("download error source " + error.source);
            console.log("download error target " + error.target);
            console.log("upload error code" + error.code);
        },
        null, // or, pass false
        {
            //headers: {
            //    "Authorization": "Basic dGVzdHVzZXJuYW1lOnRlc3RwYXNzd29yZA=="
            //}
        }
    );
}

function displayImageByFileURL(fileEntry) {
    var elem = document.getElementById('imageElement');
    elem.src = fileEntry.toURL();
}

function readBinaryFile(fileEntry) {
    fileEntry.file(function (file) {
        var reader = new FileReader();
 
        reader.onloadend = function() {
 
            console.log("Successful file read: " + this.result);
            // displayFileData(fileEntry.fullPath + ": " + this.result);
 
            var blob = new Blob([new Uint8Array(this.result)], { type: "image/png" });
            displayImage(blob);
        };
 
        reader.readAsArrayBuffer(file);
 
    }, onErrorReadFile);
}

function displayImage(blob) {
 
    // Note: Use window.URL.revokeObjectURL when finished with image.
    var objURL = window.URL.createObjectURL(blob);
 
    // Displays image if result is a valid DOM string for an image.
    var elem = document.getElementById('imageElement');
    elem.src = objURL;
}