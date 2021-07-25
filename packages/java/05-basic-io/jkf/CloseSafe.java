package jkf;

import java.io.InputStream;
import java.io.OutputStream;
import java.io.Reader;
import java.io.Writer;

public class CloseSafe {
    void close(InputStream is){
        if (is == null){
            return;
        }
        try {
            is.close();
        }
        catch(Throwable e){}
    }
    void close(OutputStream os){
        if (os == null){
            return;
        }
        try {
            os.close();
        }
        catch(Throwable e){}
    }

    void close(Reader r){
        if (r == null){
            return;
        }
        try {
            r.close();
        }
        catch(Throwable e){}
    }
    
    void close(Writer w){
        if (w == null){
            return;
        }
        try {
            w.close();
        }
        catch(Throwable e){}
    }
}