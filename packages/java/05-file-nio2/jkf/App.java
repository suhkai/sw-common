package jkf;

import java.nio.file.*;
import java.io.IOException;
import java.net.URI;
import java.nio.file.LinkOption;
import java.nio.file.Files;
import java.nio.file.FileVisitResult;
import java.nio.file.attribute.BasicFileAttributes;
import java.nio.file.attribute.DosFileAttributeView;
import java.nio.file.attribute.DosFileAttributes;
import java.time.ZoneId;



//import jkf.PrintFiles;

public class App {

    final static String NS = System.getProperty("line.separator");
    final static String CWD = System.getProperty("user.dir");

    static void print(String fmt, Object... args) {
        System.out.format(fmt, args);
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
            // create link named  "Link" from "jkf/App.java" 
            // New-Item -ItemType SymbolicLink -Path "Link" -Target "jkf/App.java"
            App.print("(toRealPath %s%n", Paths.get("./Link").toRealPath());
        }
        catch (IOException ioe) {
            App.print("Err: %s%n", ioe);
        }
        var src = "c:\\hello\\world\\today";
        var relTarget = "..\\ali\\bagdadi";

        App.print("(join) \"%s\" with \"%s\" [%s]%n", src, relTarget, Paths.get(src).resolve(relTarget).normalize());

        var target = "c:\\ali\\bagdadi";
        App.print("(diff) \"%s\" with \"%s\" [%s]%n", src, target, Paths.get(src).relativize(Paths.get(target)).normalize());
       
        // test for equality
        // use some uppercase letters in path
        var src2 = "c:\\hEllo\\woRld\\TodaY";
        var p1 = Paths.get(src);
        var p2 = Paths.get(src2);
        App.print("(equals) %s same name but some letters turned capital: %s%n",  p1.compareTo(p2), src2);
        for (Path part: p2){
            App.print("(part) %s%n", part);
        }

    }

    public void fileOperations() {
        var startPath = Paths.get(".");
        try {
            Files.walkFileTree(startPath, new FileVisitor<Path>() {

                private void bfa2String(Path file, String prefix, BasicFileAttributes bfa) throws IOException{
                    // file times
                    var crTime = bfa.creationTime().toInstant().atZone(ZoneId.systemDefault());
                    var lastAccess = bfa.lastAccessTime().toInstant().atZone(ZoneId.systemDefault());;
                    var lastModified = bfa.lastModifiedTime().toInstant().atZone(ZoneId.systemDefault());;

                    var fileKey = bfa.fileKey();
                    var isDirectory = bfa.isDirectory();
                    var isOther = bfa.isOther();
                    var isRegular = bfa.isRegularFile();
                    var isSymbolicLink = bfa.isSymbolicLink();
                    var size = bfa.size();
                    
                    DosFileAttributes dosAttrs = Files.readAttributes(file, DosFileAttributes.class, LinkOption.NOFOLLOW_LINKS);
                    //DosFileAttributeView dosAttrsView = Files.readAttributes(file, DosFileAttributeView.class, LinkOption.NOFOLLOW_LINKS);
                    //dosAttrsView.setHidden(true);
                    System.out.println("DOSATTR (hidden):"+dosAttrs.isHidden());
                    //System.out.println("DOSViewATTR (hidden):"+dosAttrsView.getClass().getName());
                    
                    // file times;
                    System.out.format("===%s======================================%n", fileKey);
                    System.out.format("%s:(creation time  )\t%s%n", prefix, crTime);
                    System.out.format("%s:(last access    )\t%s%n", prefix, lastAccess);
                    System.out.format("%s:(last mod       )\t%s%n%n", prefix, lastModified);
                    // type
                    System.out.format("%s:(isdir          )\t%s%n", prefix, isDirectory);
                    System.out.format("%s:(isOther        )\t%s%n", prefix, isOther);
                    System.out.format("%s:(isRegular      )\t%s%n", prefix, isRegular);
                    System.out.format("%s:(isSymbolicLink )\t%s%n", prefix, isSymbolicLink);
                    System.out.format("%s:(size )\t%s%n", prefix, size);
                }

                @Override
                public FileVisitResult preVisitDirectory(Path dir,  BasicFileAttributes bfa) throws IOException {
                    System.out.format("bfa class name:%s%n", bfa.getClass().getName());
                    bfa2String(dir, String.format("preVisitDirectory/%s", dir ), bfa);
                    return FileVisitResult.CONTINUE;
                }

                @Override
                public FileVisitResult postVisitDirectory(Path dir, IOException exc) throws IOException {
                    if (exc != null){
                        System.out.format("postVisitDirectory (ioErr):%s%n", exc);
                        throw exc;
                    }
                    System.out.format("postVisitDirectory/%s%n" ,dir);
                    return FileVisitResult.CONTINUE;
                }

                @Override
                public FileVisitResult visitFile(Path file, BasicFileAttributes bfa)
                    throws IOException
                {
                    if (file.endsWith(".class")) return FileVisitResult.CONTINUE;
                    bfa2String(file, String.format("visitFile/%s", file ), bfa);
                    System.out.println(Files.getOwner(file));
                    return FileVisitResult.CONTINUE;
                }

                @Override
                public FileVisitResult visitFileFailed(Path file, IOException exc) throws IOException
                {
                    if (file instanceof Path){
                        System.out.format("visitFailed/%s%n", file);
                    }
                    if (exc != null){
                        System.err.format("visitedFailed/%s", exc);
                    }
                    throw exc;
                }
            });
        }
        catch(IOException ioe){
            System.err.format("IOException occurred %s%n", ioe);
        }
    }

    public App() {
        
    }

    public static void main(String... argv) throws IOException {
        var app = new App();
        //app.pathSamples();
        app.fileOperations();
        /*
         * // tested, java respects "root" part of path // ps: node does this for v16?
         * var p1 = Paths.get("//localhost/c$/temp/temp2"); //
         * System.out.println(p1.getClass().getName());
         * System.out.println(p1.getFileName()); var p2 =
         * Paths.get(URI.create("file:///Users/MSI/x")); //
         * System.out.println(p2.getClass().getName()); var p3 =
         * p1.resolve("../.././data.bin"); System.out.println(p3.normalize());
         * System.out.println(p3.normalize().toUri());
         * System.out.println(System.getProperty("user.home")); var diff =
         * p1.relativize(p1.resolve("../temp3/../temp4")); System.out.println(diff);
         * System.out.println(diff.normalize()); var fs =
         * Paths.get(".").getFileSystem(); System.out.println(fs.getRootDirectories());
         * FileSystems.getDefault().getFileStores(); for (FileStore store:
         * FileSystems.getDefault().getFileStores()){ long total =
         * store.getTotalSpace()/1024; long use = (store.getTotalSpace() -
         * store.getUnallocatedSpace()) / 1024; long avail =
         * store.getUsableSpace()/1024; String name = store.name();
         * System.out.format("%-20s %12d %12d %12d %12d%n", name, total, use, avail,
         * total-use); }
         */

    }
}
