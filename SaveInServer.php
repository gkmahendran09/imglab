<?php
require('./vendor/autoload.php');

use League\Flysystem\Filesystem;
use League\Flysystem\Adapter\Local;

$adapter = new Local(__DIR__.'/labeldata');
$filesystem = new Filesystem($adapter);

$time_stamp = time();
$folder_name = $_POST['folderName'];

$folder_path = $folder_name . '_' . $time_stamp;

$dlibXMLData_file_path = $folder_path . '/' . 'dlibXMLData.xml';
$dlibXMLData_file_contents = $_POST['dlibXMLData'];

$labellingData_file_path = $folder_path . '/' . 'labellingData.json';
$labellingData_file_contents = $_POST['labellingData'];

$response = $filesystem->createDir($folder_path);

if($response == true) {
    $filesystem->put($dlibXMLData_file_path, $dlibXMLData_file_contents);
    $filesystem->put($labellingData_file_path, $labellingData_file_contents);

    for($i=0; $i<count($_FILES); $i++) {
        $upload_name = 'file_' . $i;
        $stream = fopen($_FILES[$upload_name]['tmp_name'], 'r+');
        $filesystem->writeStream(
            $folder_path . '/' .$_FILES[$upload_name]['name'],
            $stream
        );
        if (is_resource($stream)) {
            fclose($stream);
        }
    }

    echo 'success';

} else {
    echo 'Error.Could not create directory.';
}








