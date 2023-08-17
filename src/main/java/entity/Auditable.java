package entity;

import jakarta.persistence.MappedSuperclass;
import jakarta.persistence.Temporal;
import jakarta.persistence.TemporalType;
import lombok.Data;
import java.util.Date;

@Data
@MappedSuperclass
public class Auditable {

    @Temporal(TemporalType.TIMESTAMP)
    private Date creationDate;

    @Temporal(TemporalType.TIMESTAMP)
    private Date updateDate;


}
