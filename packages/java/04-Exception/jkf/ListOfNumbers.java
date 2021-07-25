// Note: This class will not compile yet.
package jkf;

import java.io.*;
import java.io.FileWriter;
import java.util.List;
import java.io.IOException;
import java.util.ArrayList;

public class ListOfNumbers {

    private List<Integer> list;
    private static final int SIZE = 10;

    public ListOfNumbers() {
        list = new ArrayList<Integer>(SIZE);
        for (int i = 0; i < SIZE; i++) {
            list.add(i);
        }
    }

    public void writeList() throws IOException {
        // The FileWriter constructor throws IOException, which must be caught.
        try (PrintWriter out = new PrintWriter(new FileWriter("OutFile.txt"))) {
            for (int i = 0; i < SIZE; i++) {
                // The get(int) method throws IndexOutOfBoundsException, which must be caught.
                out.println("Value at: " + i + " = " + list.get(i));
            }
        }
    }
}