import { Expose, Transform } from 'class-transformer';
import { serializerObjectIdTransformer } from 'src/common/helpers/misc/transformer';

export class UserEntity {
  @Transform(serializerObjectIdTransformer)
  @Expose({ name: 'id' })
  _id: string;

  @Expose()
  email?: string;

  @Expose()
  fullname?: string;
}
