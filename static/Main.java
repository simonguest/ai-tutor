/***
 * This is a simple Java program.
 */
import System;

public class Main {

    public static void main(String[] args) {
        System.out.println("Hello World");

        String original = "the string";
        String reversed = "";
        
        for (int index = 0; index < original.length(); index++) {
           String singleLetter = original.substring(index, index + 1);
           reversed = singleLetter + reversed;
        }
    }
}