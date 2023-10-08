package br.com.crispimlanches.loja_virtual_crispim.utils;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.UUID;

public class UniqueFileKeyGenerator {

    public static String generateUniqueFileKey() {
        SimpleDateFormat dateFormat = new SimpleDateFormat("yyyyMMddHHmmssSSS");
        String timestamp = dateFormat.format(new Date());

        // Generate a random UUID (Universally Unique Identifier)
        String uuid = UUID.randomUUID().toString().replace("-", "");

        // Combine the timestamp and UUID to create a unique file key
        String uniqueFileKey = timestamp + uuid;

        return uniqueFileKey;
    }

    public static void main(String[] args) {
        String uniqueKey = generateUniqueFileKey();
        System.out.println("Generated Unique File Key: " + uniqueKey);
    }
}
