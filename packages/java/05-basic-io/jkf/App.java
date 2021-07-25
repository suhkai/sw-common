package jkf;

import java.io.IOException;
import java.io.FileNotFoundException;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.nio.file.Paths;
import java.io.BufferedWriter;
//
import java.io.FileReader;
import java.io.FileWriter;
import java.io.PrintWriter;
import java.io.BufferedReader;
//
import java.io.BufferedInputStream;
import java.io.BufferedOutputStream;

import jkf.CloseSafe;

public class App {

    final static String NS = System.getProperty("line.separator");

    final CloseSafe closeSafe = new CloseSafe();

    void copyBytesBuffered(String iname, String oname) {

        BufferedInputStream in = null;
        BufferedOutputStream out = null;
        
        try {
            in = new BufferedInputStream(new FileInputStream(iname));
            out = new BufferedOutputStream(new FileOutputStream(oname));
            int c;
            for (;;) {
                c = in.read();
                System.out.println((char)c);
                if (c < 0)
                    break;
                out.write(c);
            }
            out.flush();
        } catch (IOException ioe) {
            System.out.println(String.format("%s", ioe.getMessage()));
        } finally {
            System.out.println(String.format("input file: %s", in.getClass().getName()));
            System.out.println(String.format("output file: %s", out.getClass().getName()));
            closeSafe.close(in);
            closeSafe.close(out);
        }
    }

    void copyBytes(String iname, String oname) {

        FileInputStream in = null;
        FileOutputStream out = null;

        try {
            in = new FileInputStream(iname);
            out = new FileOutputStream(oname);
            int c;
            for (;;) {
                c = in.read();
                System.out.println(c);
                if (c < 0)
                    break;
                out.write(c);
            }
        } catch (IOException ioe) {
            System.out.println(String.format("%s", ioe.getMessage()));
        } finally {
            System.out.println(String.format("input file: %s", in.getClass().getName()));
            System.out.println(String.format("output file: %s", out.getClass().getName()));
            closeSafe.close(in);
            closeSafe.close(out);
        }
    }


    void copyCharacters(String iname, String oname) {

        FileReader in = null;
        FileWriter out = null;

        try {
            in = new FileReader(iname);
            out = new FileWriter(oname);
            int c;
            for (;;) {
                c = in.read();
                System.out.println(c);
                if (c < 0)
                    break;
                out.write(c);
            }
        } catch (IOException ioe) {
            System.out.println(String.format("%s", ioe.getMessage()));
        } finally {
            System.out.println(String.format("input file: %s", in.getClass().getName()));
            System.out.println(String.format("output file: %s", out.getClass().getName()));
            closeSafe.close(in);
            closeSafe.close(out);
        }
    }

    public void copyLines(String iname, String oname) {

        BufferedReader in = null;
        PrintWriter out = null;

        try {
            in = new BufferedReader(new FileReader(iname));
            out = new PrintWriter(new FileWriter(oname));

            for (;;) {
                var l = in.readLine();
                if (l == null)
                    break;
                out.println(l);
            }
        } 
        catch(FileNotFoundException  fnfe){

        }
        catch(IOException  ioe){

        }
        finally {
            System.out.println(String.format("input file: %s", in.getClass().getName()));
            System.out.println(String.format("output file: %s", out.getClass().getName()));
            closeSafe.close(in);
            closeSafe.close(out);
        }
        
    }

    public App() {

    }

    public static void main(String... argv) {
        var app = new App();
        var src = "xanadu.txt";
       
        app.copyBytes(src, "outgoing.txt");
        app.copyCharacters(src,"outgoing_char.txt");
        app.copyLines(src, "outgoingLines.txt");
        app.copyBytesBuffered(src, "outgoingBuffered.txt" );
    }
}
