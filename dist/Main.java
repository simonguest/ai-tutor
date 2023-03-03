/***
 * My AP CSA Homework
 */
import java.lang.System;

public class Main {

    private static String reverse(String original) {
        String reversed = "";
        for (int index = 0; index < original.length(); index++) {
            String singleLetter = original.substring(index, index + 1);
            reversed = singleLetter + reversed;
        }
        return reversed;
    }

    private static double getAverage(int[] theArray) {
        double average = 0.0;
        for (int index = 0; index < theArray.length; index++) {
            average += theArray[index];
        }
        average = average / theArray.length;
        return average;
    }

    public static void main(String[] args) {
        System.out.println("Here are a couple of AP CSA examples:");

        // Reverse a string
        System.out.println(reverse("Hello, World!"));

        // Compute an average
        int[] numbers = { 1, 2, 3, 4, 5 };
        System.out.println(getAverage(numbers));
    }
}