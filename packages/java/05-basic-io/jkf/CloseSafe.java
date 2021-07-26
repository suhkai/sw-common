package jkf;

import java.io.Closeable;

public class CloseSafe {
    void close(Closeable s){
        if (s == null){
            return;
        }
        try {
            s.close();
        }
        catch(Throwable e){}
    }
}