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

    public boolean recursiveDelete(Path p) throws IOException {
        var file = p.toFile();
        try (var stream = Files.newDirectoryStream(p)){
            for (var entry: stream){
                var sub = entry.toFile();
                if (sub.isDirectory()){
                    if (this.recursiveDelete(entry)){
                        System.err.format("could not recursively delete:(dir) %s%n", sub.getName());
                    }
                }
                var rc = sub.delete();
                if (!rc){
                    System.err.format(
                        "could not delete (%s): %s%n",
                        sub.isDirectory() ? "dir":"file",
                        sub.getAbsolutePath().toString()
                    );
                }
            }
        }
        catch(IOException ioe){
            System.err.format("ERR:(recursiveDelete) %s%n", ioe);
        }
        return file.delete();
    }

    public void fileSystems() {

        FileSystem defaultFileSystem = FileSystems.getDefault();
        var provider = FileSystems.getDefault().provider();

        // installed = java.util.Collections$UnmodifiableRandomAccessList
        var installed = FileSystems.getDefault().provider().installedProviders();

        // scheme, class
        // ===================
        // file, sun.nio.fs.WindowsFileSystemProvider
        // jar, jdk.nio.zipfs.ZipFileSystemProvider
        // jrt, jdk.internal.jrtfs.JrtFileSystemProvider

        for (var prov : installed) {
            System.out.format("provider-class:[%s]%n", prov.getClass());
            System.out.format("provider-uri:[%s]%n", prov.getScheme());
        }

        var dirs = defaultFileSystem.getRootDirectories();

        for (var rootDir : dirs) {
            System.out.format("rootDir: %s%n", rootDir);
            System.out.format("class: %s%n", rootDir.getClass().getName());
        }
        // create a directory

        var createDir = Paths.get("testData/createdDir/subDir2");
        var testData = Paths.get("testData");

        try {
            var createdDir = Files.createDirectories(createDir);
            Files.setAttribute(createdDir, "dos:hidden", true, LinkOption.NOFOLLOW_LINKS);
        } catch (IOException ioe) {
            System.err.format("ERR36: createDir failed:%s%n", ioe);
        }

        // DOS attributes
        // private static final String READONLY_NAME = "readonly";
        // private static final String ARCHIVE_NAME = "archive";
        // private static final String SYSTEM_NAME = "system";
        // private static final String HIDDEN_NAME = "hidden";
        // private static final String ATTRIBUTES_NAME = "attributes";

        // create temporary directory
        try {
            // in windows temp dir, mostly this will nbe
            // C:\Users\<USERNAME>\AppData\Local\Temp
            var tempDir = Files.createTempDirectory(testData, "prefix-v2-");
            System.out.format("temp dir created at %s%n", tempDir.getFileName());
            var tempFile = Files.createTempFile(tempDir, "temp-file-", ".tmp");
            System.out.format("temp file created at %s%n", tempFile.getFileName());
        }
        /*
         * catch(InterruptedException ie){
         * System.err.format("ERR37:Thread interrupted:%s%n", ie); }
         */
        catch (IOException ioe) {
            System.err.format("ERR38:IOException:%s%n", ioe);
        }

        // contents of a directory as a sream
        try (var stream = Files.newDirectoryStream(testData)) {
            for (var entry : stream) {
                var uri = entry.toUri();
                var file = entry.toFile();
                var name = file.getName();
                var isDir = file.isDirectory();
                var isPlainFile = file.isFile();
                var isHidden = file.isHidden();
                var info = String.format(
                    "{%nname=%s, isDir=%s, isPlain=%s, hidden=%s%nuri=%s%n}%n",
                    name,
                    isDir,
                    isPlainFile,
                    isHidden,
                    uri
                );
                System.out.print(info);
            }
        } catch (IOException ioe) {
            System.err.format("ERR39:IOException:%s%n", ioe);
        }

        // filter
        var filter = new DirectoryStream.Filter<Path>() {
            public boolean accept(Path p) throws IOException{
                var name = p.getName(p.getNameCount()-1).toString();
                return name.startsWith("prefix");
            }
        };

        System.out.println("====start show filter");
        try (var stream = Files.newDirectoryStream(testData, filter)) {
            for (var entry: stream){
                var file = entry.toFile();
                boolean deleted;
                if (file.isDirectory()){
                    deleted = this.recursiveDelete(entry);
                }
                else {
                    deleted = file.delete();
                }
                System.out.format("%b deleted, %s%n", deleted, entry.getName(entry.getNameCount()-1));
            }
        } catch (IOException ieo) {
            // Failed to determine if it's a directory.
            System.err.println(ieo);
        }
        System.out.println("====end show filter");
    
    }

    public void smallFileOperations() {
        Path fileSrc = Paths.get("testdata/dracula_full.png");
        Path fileDst = Paths.get("testdata/copy_dracula_full.png");

        var random = new Random(123);

        try {
            byte[] fileArray = Files.readAllBytes(fileSrc);
            System.out.format("bytes read: %d%n", fileArray.length);
            Files.write(fileDst, fileArray);

        } catch (IOException ioe) {
            System.err.format("There was an error:%s %n", ioe);
        }
        //
        Charset utf8Set = Charset.forName("UTF-8");
        Charset asciiSet = Charset.forName("US-ASCII");
        var asciiTextFile = Paths.get("testdata/ascii-textfile");
        var utf8TextFile = Paths.get("testdata/utf8-textfile");
        try (BufferedReader asciiReader = Files.newBufferedReader(asciiTextFile, asciiSet);
                BufferedReader utf8Reader = Files.newBufferedReader(utf8TextFile, utf8Set)) {
            // read ascii text
            for (;;) {
                String line = asciiReader.readLine();
                if (line == null)
                    break;
                System.out.format("ascii:%s%n", line);
            }
            for (;;) {
                String line = utf8Reader.readLine();
                if (line == null)
                    break;
                System.out.format("utf8:%s%n", line);
            }
        } catch (IOException ioe) {
            System.err.format("ERR: %s%n", ioe);
        }
        // save some random blob values
        var blobFile = Paths.get("testdata/blob.bin");
        OpenOption[] options = { StandardOpenOption.CREATE, StandardOpenOption.TRUNCATE_EXISTING,
                StandardOpenOption.WRITE };
        try (var fos = Files.newOutputStream(blobFile, options); var bos = new BufferedOutputStream(fos)) {
            var buffer = new byte[2048];

            for (int i = 0; i < buffer.length; i++) {
                buffer[i] = (byte) (random.nextInt(255));// (byte)(random.nextInt(255) & 255);
            }
            bos.write(buffer);
        } catch (IOException ioe) {
            System.err.format("ERR:%s%n", ioe);
        } finally {
            System.out.format("saved to %s%n", blobFile.getFileName());
            // System.out.println("\u0007");
            // Toolkit.getDefaultToolkit().beep();
        }
        // Methods for Channels and ByteBuffers
        var blob2File = Paths.get("testdata/using_byte_channel.bin");
        try (var sbc = Files.newByteChannel(blob2File, options)) {
            final int BUFFER_CAPACITY = 1024;
            ByteBuffer buf = ByteBuffer.allocate(BUFFER_CAPACITY);
            String encoding = System.getProperty("file.encoding");
            System.out.format("file.encoding=%s%n", encoding);
            for (; buf.remaining() > 0;) {
                buf.putShort((short) random.nextInt(65536)); // range 0000-FFFF(inclusive)
            }
            sbc.write(buf.flip());

        } catch (IOException ioe) {
            System.err.format("err34:%s", ioe);
        }
        // read it back again
        OpenOption[] readOptions = { StandardOpenOption.READ, StandardOpenOption.WRITE };
        try (var sbc = Files.newByteChannel(blob2File, readOptions);) {
            var buf = ByteBuffer.allocate(600);
            var sum = 0;
            for (;;) {
                var read = sbc.read(buf);
                System.out.format("remaining bytes in buffer:%d%n", buf.remaining());
                if (read < 0) {
                    System.out.format("file depleated");
                    break;
                }
                if (read == 0) {
                    System.out.format("buffer full, rewind%n");
                    buf.rewind();
                    continue;
                }
                sum += read;
                System.out.format("sum total read:%d%n", sum);
                System.out.format("position: %d%n", sbc.position());
                // buf.rewind();
            }
        } catch (IOException ioe) {
            System.err.format("err35:%s", ioe);
        }
        // random access files

    }

    public void pathAndFileSystem() {
        // tested, java respects "root" part of path // ps: node does this for v16?
        var p1 = Paths.get("//localhost/c$/temp/temp2"); //
        System.out.println(p1.getClass().getName());
        System.out.println(p1.getFileName());
        var p2 = Paths.get(URI.create("file:///Users/MSI/x")); //
        System.out.println(p2.getClass().getName());
        var p3 = p1.resolve("../.././data.bin");
        System.out.println(p3.normalize());
        System.out.println(p3.normalize().toUri());
        System.out.println(System.getProperty("user.home"));
        var diff = p1.relativize(p1.resolve("../temp3/../temp4"));
        System.out.println(diff);
        System.out.println(diff.normalize());
        var fs = Paths.get(".").getFileSystem();
        System.out.println(fs.getRootDirectories());
        FileSystems.getDefault().getFileStores();
        for (FileStore store : FileSystems.getDefault().getFileStores()) {
            try {
                long total = store.getTotalSpace() / 1024;
                long use = (store.getTotalSpace() - store.getUnallocatedSpace()) / 1024;
                long avail = store.getUsableSpace() / 1024;
                String name = store.name();
                System.out.format("%-20s %12d %12d %12d %12d%n", name, total, use, avail, total - use);
            } catch (IOException ioe) {
                System.err.format("Error:%s %n", ioe);
            }
        }
    }

    public void pathSamples() {
        var path = Paths.get("C://home/joe/foo");
        var path2 = Paths.get("/home/joe/foo");

        App.print("toString: %s%n", path.toString());
        App.print("getFileName: %s%n", path.getFileName());
        App.print("getName(0): %s%n", path.getName(0));
        App.print("getNameCount: %d%n", path.getNameCount());
        App.print("subpath(1,3): %s%n", path.subpath(1, 3));
        App.print("getParent: %s%n", path.getParent());
        App.print("getRoot: %s%n", path.getRoot());

        App.print("(linux) getRoot: %s%n", path2.getRoot());
        App.print("(linux) sunpath(1,3): %s%n", path2.subpath(1, 3));
        App.print("(linux) className: %s%n", path2.getClass().getName());

        App.print("(normalize C://home/.) %s%n", Paths.get("C://home/.").normalize());
        App.print("(normalize C://home/) %s%n", Paths.get("C://home/").normalize());
        App.print("(toUri C://home/) %s%n", Paths.get("C://home").toUri());
        App.print("(toAbsolutePath 'thisdir' %s%n", Paths.get("thisdir").toAbsolutePath());
        try {
            // create link named "Link" from "jkf/App.java"
            // New-Item -ItemType SymbolicLink -Path "Link" -Target "jkf/App.java"
            App.print("(toRealPath %s%n", Paths.get("./Link").toRealPath());
        } catch (IOException ioe) {
            App.print("Err: %s%n", ioe);
        }
        var src = "c:\\hello\\world\\today";
        var relTarget = "..\\ali\\bagdadi";

        App.print("(join) \"%s\" with \"%s\" [%s]%n", src, relTarget, Paths.get(src).resolve(relTarget).normalize());

        var target = "c:\\ali\\bagdadi";
        App.print("(diff) \"%s\" with \"%s\" [%s]%n", src, target,
                Paths.get(src).relativize(Paths.get(target)).normalize());

        // test for equality
        // use some uppercase letters in path
        var src2 = "c:\\hEllo\\woRld\\TodaY";
        var p1 = Paths.get(src);
        var p2 = Paths.get(src2);
        App.print("(equals) %s same name but some letters turned capital: %s%n", p1.compareTo(p2), src2);
        for (Path part : p2) {
            App.print("(part) %s%n", part);
        }

    }

    public void fileOperations() {
        var startPath = Paths.get(".");
        try {
            Files.walkFileTree(startPath, new FileVisitor<Path>() {

                private void bfa2String(Path file, String prefix, BasicFileAttributes bfa) throws IOException {
                    // file times
                    var crTime = bfa.creationTime().toInstant().atZone(ZoneId.systemDefault());
                    var lastAccess = bfa.lastAccessTime().toInstant().atZone(ZoneId.systemDefault());
                    ;
                    var lastModified = bfa.lastModifiedTime().toInstant().atZone(ZoneId.systemDefault());
                    ;

                    var fileKey = bfa.fileKey();
                    var isDirectory = bfa.isDirectory();
                    var isOther = bfa.isOther();
                    var isRegular = bfa.isRegularFile();
                    var isSymbolicLink = bfa.isSymbolicLink();
                    var size = bfa.size();

                    DosFileAttributes dosAttrs = Files.readAttributes(file, DosFileAttributes.class,
                            LinkOption.NOFOLLOW_LINKS);
                    // DosFileAttributeView dosAttrsView = Files.readAttributes(file,
                    // DosFileAttributeView.class, LinkOption.NOFOLLOW_LINKS);
                    // dosAttrsView.setHidden(true);
                    System.out.println("DOSATTR (hidden):" + dosAttrs.isHidden());
                    // System.out.println("DOSViewATTR
                    // (hidden):"+dosAttrsView.getClass().getName());

                    // file times;
                    System.out.format("===%s======================================%n", fileKey);
                    System.out.format("%s:(creation time  )\t%s%n", prefix, crTime);
                    System.out.format("%s:(last access    )\t%s%n", prefix, lastAccess);
                    System.out.format("%s:(last mod       )\t%s%n%n", prefix, lastModified);
                    // type
                    System.out.format("%s:(isDir          )\t%s%n", prefix, isDirectory);
                    System.out.format("%s:(isOther        )\t%s%n", prefix, isOther);
                    System.out.format("%s:(isRegular      )\t%s%n", prefix, isRegular);
                    System.out.format("%s:(isSymbolicLink )\t%s%n", prefix, isSymbolicLink);
                    System.out.format("%s:(size           )\t%s%n", prefix, size);
                    //
                }

                @Override
                public FileVisitResult preVisitDirectory(Path dir, BasicFileAttributes bfa) throws IOException {
                    System.out.format("bfa class name:%s%n", bfa.getClass().getName());
                    bfa2String(dir, String.format("preVisitDirectory/%s", dir), bfa);
                    return FileVisitResult.CONTINUE;
                }

                @Override
                public FileVisitResult postVisitDirectory(Path dir, IOException exc) throws IOException {
                    if (exc != null) {
                        System.out.format("postVisitDirectory (ioErr):%s%n", exc);
                        throw exc;
                    }
                    System.out.format("postVisitDirectory/%s%n", dir);
                    return FileVisitResult.CONTINUE;
                }

                @Override
                public FileVisitResult visitFile(Path file, BasicFileAttributes bfa) throws IOException {
                    if (file.endsWith(".class"))
                        return FileVisitResult.CONTINUE;
                    bfa2String(file, String.format("visitFile/%s", file), bfa);
                    System.out.println(Files.getOwner(file));
                    return FileVisitResult.CONTINUE;
                }

                @Override
                public FileVisitResult visitFileFailed(Path file, IOException exc) throws IOException {
                    if (file instanceof Path) {
                        System.out.format("visitFailed/%s%n", file);
                    }
                    if (exc != null) {
                        System.err.format("visitedFailed/%s", exc);
                    }
                    throw exc;
                }
            });
        } catch (IOException ioe) {
            System.err.format("IOException occurred %s%n", ioe);
        }
    }

    public App() {

    }

    public static void main(String... argv) throws IOException {
        var app = new App();
        // app.pathSamples();
        //app.fileOperations();
        // app.smallFileOperations();
        app.fileSystems();

    }
}
