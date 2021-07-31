package jkf;

import java.io.IOException;
import java.io.UnsupportedEncodingException;

import java.nio.file.FileSystems;
import java.nio.file.Files;
import java.nio.file.OpenOption;
import java.nio.file.attribute.UserPrincipal;
import java.nio.file.attribute.AclEntry;
import java.nio.file.attribute.AclEntryType;
import java.nio.file.attribute.AclEntryPermission;
import java.nio.file.attribute.AclFileAttributeView;
import java.nio.file.attribute.FileAttributeView;

import java.nio.ByteBuffer;
import java.nio.channels.FileChannel;
import java.nio.file.StandardOpenOption;
import java.nio.file.Paths;
import java.nio.file.Path;

import java.nio.file.attribute.AclEntryPermission;

public class App {

    final static String NS = System.getProperty("line.separator");
    final static String CWD = System.getProperty("user.dir");

    static void print(String fmt, Object... args) {
        System.out.format(fmt, args);
    }

    public void randomAccess() {
        var copy = new byte[16384];
        String s = "I was here.";
        byte[] iwashere;
        try {
            iwashere = s.getBytes("UTF-8");
        } catch (UnsupportedEncodingException usce) {
            System.out.format("There was an error: [%s]%n", usce);
            return;
        }

        //AclEntryPermission.READ_ACL;


        var buffer = ByteBuffer.wrap(iwashere);
        var fileBin = Paths.get("testData/random_bin.bin");
        var intBuffer = ByteBuffer.allocate(10);
        var copyBuffer = ByteBuffer.wrap(copy);

        for (byte i = 0; intBuffer.hasRemaining();) {
            intBuffer.put(i++);
        }
        intBuffer.rewind();

        OpenOption[] options = { StandardOpenOption.CREATE, StandardOpenOption.READ, StandardOpenOption.WRITE };

        try (var channel = FileChannel.open(fileBin, options)) {
            // forward to position 10
            channel.position(10);
            while (buffer.hasRemaining()) {
                channel.write(buffer);
            }
            buffer.rewind();
            // channel.position(0);
            while (intBuffer.hasRemaining()) {
                channel.write(intBuffer);
            }
            intBuffer.rewind();
            while (copyBuffer.position() < 12) {
                copyBuffer.put((byte) copyBuffer.position());
            }
            copyBuffer.flip();
            while (copyBuffer.hasRemaining()) {
                channel.write(copyBuffer);
            }

        } catch (IOException ioe) {
            System.err.format("ERR:01, [%s]%n", ioe);
        }
    }

    public void fileSystemRoots() {
        var dirs = FileSystems.getDefault().getRootDirectories();
        for (var dir : dirs) {
            System.out.println(dir.toString());
        }
    }

    public void setAclOfType(Path file, UserPrincipal principal, AclEntryType type) throws IOException {
        var view = Files.getFileAttributeView(file, AclFileAttributeView.class);
        var acls = view.getAcl();

        var entry = AclEntry.newBuilder()
                .setType(type)
                .setPrincipal(principal)
                .setPermissions(AclEntryPermission.READ_DATA)
                .build();
        acls.add(0, entry);
        view.setAcl(acls);        
    }

    public boolean removeAllOfType(Path file, UserPrincipal principal, AclEntryType... types) throws IOException {

        var view = Files.getFileAttributeView(file, AclFileAttributeView.class);
        var acls = view.getAcl();
        var iter = acls.iterator();
        boolean altered = false;

        for (; iter.hasNext();) {
            var acl = iter.next();
            for (var type: types){
                if (acl.type().equals(type) && acl.principal().equals(principal)) {
                    iter.remove();
                    altered = true;
                }
            }
        }
        if (altered){
            view.setAcl(acls);
        }
        return altered;
    }

    public void makeFileNonReadable() {

        var filePath = Paths.get("testData/random_bin.bin");
        var supportedAttr = filePath.getFileSystem().supportedFileAttributeViews();
        for (var sup: supportedAttr){
            System.out.format("supportedAttr:%s%n", sup);
        }
        
        UserPrincipal fileOwner = null;
        

        try {
            fileOwner = Files.getOwner(filePath);
            System.out.format("userPrincipal:%s%n", fileOwner);
           
            this.removeAllOfType(filePath, fileOwner, AclEntryType.DENY, AclEntryType.ALLOW);
            this.setAclOfType(filePath, fileOwner, AclEntryType.DENY);
        
            OpenOption[] onlyRead = { StandardOpenOption.READ };
            try(
                var stream = FileChannel.open(filePath, onlyRead )
            ){
                System.err.format("ERR:04 opening the file succeeded (should not happen)%n");
                // do noting special
            }
            catch(IOException ioe){
                System.out.format("(Intentional) reading the file failed:%s%n", ioe);
            }

            this.removeAllOfType(filePath, fileOwner, AclEntryType.DENY, AclEntryType.ALLOW);
//            this.setAclOfType(filePath, fileOwner, AclEntryType.ALLOW);
            
        }
        catch(IOException ioe){
            System.out.format("Error:%s%n", ioe);
        }
        
    }

    // this doesnt work
    // we get this error:
    // java.nio.file.FileSystemException: testData\link_random_bin.bin: A required privilege is not held by the client.
    // New-Item -ItemType SymbolicLink -Path "link_random_bin.bin" -Target "random_bin.bin"
    // New-Item: Administrator privilege required for this operation.
    // New-Item -ItemType HardLink -Path "hardlink_random_bin.bin" -Target "random_bin.bin"
    public void createSymbolicLinks() {

        var target = Paths.get("testData/random_bin.bin");
        var link = Paths.get("testData/link_random_bin.bin");

        try {
            var llink = Files.createSymbolicLink(link, target);
            if (llink.toFile().exists()) {
                System.out.format("link is created:%s%n", llink);
            } else {
                System.out.format("link %s is NOT created for:%s%n", target, llink);
            }
        } catch (IOException ioe) {
            System.err.format("ERR:07 restoring ACL failed:%s%n", ioe);
        }
    }

    public App() {

    }

    public static void main(String... argv) {
        var app = new App();
        System.out.println("Start");

        app.randomAccess();
        app.fileSystemRoots();
        app.makeFileNonReadable();
        //app.createSymbolicLinks();

    }
}
