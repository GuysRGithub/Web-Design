    public static void main(String[] args) {
        String inp = new Scanner(System.in).nextLine();
        int countNum = 0;
        int countSpace = 0;
        int countChar = 0;
        String inverse = new java.lang.String();
        for (int i = 0; i < inp.length(); i++) {
            if (Character.isDigit(inp.charAt(i))) {
                countNum++;
            }

            if (Character.isSpaceChar(inp.charAt(i))) {
                countSpace++;
            }

            if (Character.isAlphabetic(inp.charAt(i))) {
                countChar++;
            }

            inverse += inp.charAt(inp.length() - 1 - i);
        }

        System.out.printf("%d %d %d %s", countNum, countSpace, countChar, inverse);

    }