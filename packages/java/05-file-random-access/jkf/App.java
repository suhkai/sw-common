package jkf;

import java.nio.file.StandardOpenOption; // enum
import java.nio.file.OpenOption; //interface

import java.nio.charset.Charset;
import java.nio.file.*;
import java.io.IOException;
import java.io.BufferedOutputStream;
import java.io.BufferedReader;
import java.net.URI;
import java.nio.file.LinkOption;
import java.nio.file.Files;
import java.nio.file.FileVisitResult;
import java.nio.file.attribute.BasicFileAttributes;
import java.nio.file.attribute.DosFileAttributes;
import java.time.ZoneId;
import java.util.Random;
import java.nio.ByteBuffer;
import java.nio.file.DirectoryStream;
import java.nio.file.FileSystems;

//import java.awt.*;

//import jkf.PrintFiles;

public class App {

    final static String NS = System.getProperty("line.separator");
    final static String CWD = System.getProperty("user.dir");

    static void print(String fmt, Object... args) {
        System.out.format(fmt, args);
    }

    
    public App() {

    }

    public static void main(String... argv) {
        var app = new App();
    }
}
