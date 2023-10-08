package br.com.crispimlanches.loja_virtual_crispim;

import br.com.crispimlanches.loja_virtual_crispim.utils.UniqueFileKeyGenerator;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;

@SpringBootTest
public class UniqueFileKeyGeneratorTest {

    @Test
    public void testFileKeyGenerator(){
        String result = UniqueFileKeyGenerator.generateUniqueFileKey();
        System.out.println(result);
        Assertions.assertEquals("teste", result);
    }
}
