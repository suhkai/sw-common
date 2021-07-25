package jkf;

import java.io.IOException;
import java.util.ArrayList;
import java.util.LinkedList;

import java.nio.charset.Charset;
import java.nio.charset.StandardCharsets;

import java.nio.file.Paths;
import java.util.zip.ZipFile;
import java.util.zip.ZipEntry;
import java.io.BufferedWriter;
import java.nio.file.Files;

// new ZipFile(zipFileName);

import jkf.ListOfNumbers;

public class App {

    final static String NS = System.getProperty("line.separator");

    public App() {
    }

    public void showEntry(ZipEntry entry){
        if (entry.isDirectory()){
            return;
        }
        var name = entry.getName();
        var len = name.length();
        var size = entry.getSize();
        var compressedSize = entry.getCompressedSize();
        // ellipsis for long names
        var shortName = name.length() > 30 ? "..." + name.substring(len-27, len): name;
        var ratio = size == 0 ? 0 : (double)compressedSize/size;
        System.out.println(String.format("[%30s]\t%10d\t%f", shortName, size, ratio));
    }

    public void getEntries(String zipFileName, String outputFileName) throws IOException, IndexOutOfBoundsException {

        var cwd = System.getProperty("user.dir");
        var zipfilePath = Paths.get(cwd, zipFileName);
        var outputFilePath = Paths.get(cwd, outputFileName);

        System.out.println(String.format("inp: %s", zipfilePath));
        System.out.println(String.format("out: %s", outputFilePath));

        try (
             var zf = new ZipFile(zipfilePath.toString());
             var writer = Files.newBufferedWriter(outputFilePath, StandardCharsets.US_ASCII)
             ) {
            for (var entries = zf.entries(); entries.hasMoreElements();) {
                  var entry = entries.nextElement();
                  this.showEntry(entry);
            }
        } // try
    } // main

    public static void main(String... argv) {
        var app = new App();
        //
        var file = new ListOfNumbers();
        try {
            file.writeList();
        } catch (IOException ioe) {
        }

        try {
            app.getEntries("toolbox.zip", "zipentries.txt");
        } catch (IOException|IndexOutOfBoundsException ioe) {
        }
    }
}
