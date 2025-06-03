import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AuthorProfile } from './entities/author-profile.entity';
import { CreateAuthorProfileDto } from './dto/create-author-profile.dto';
import { UpdateAuthorProfileDto } from './dto/update-author-profile.dto';
import { User } from 'src/user/entities/user.entity';

@Injectable()
export class AuthorProfileService {
  constructor(
    @InjectRepository(AuthorProfile)
    private authorProfileRepo: Repository<AuthorProfile>,
    @InjectRepository(User)
    private userRepo: Repository<User>,
  ) {}

 async create(dto: CreateAuthorProfileDto): Promise<any> {
  const user = await this.userRepo.findOne({ where: { id: dto.userId } });

  if (!user || user.role !== 'author') {
    throw new BadRequestException('Only users with author role can have a profile.');
  }

  const existingProfile = await this.authorProfileRepo.findOne({ where: { user: { id: dto.userId } } });

  if (existingProfile) {
    throw new BadRequestException('Author profile already exists for this user.');
  }

  const profile = this.authorProfileRepo.create({
    ...dto,
    user,
  });

  const savedProfile = await this.authorProfileRepo.save(profile);

  return {
    user: {
      id: user.id,
      first_name: user.first_name,
      last_name: user.last_name,
      img: user.img,
      created_at: user.created_at,
    },
    bio_ar: savedProfile.bio_ar,
    bio_en: savedProfile.bio_en,
    works_ar: savedProfile.works_ar,
    works_en: savedProfile.works_en,
  };
}



  async findAll(
  lang?: 'ar' | 'en',
  page = 1,
  limit = 10,
  search?: string,
): Promise<any[]> {
  const skip = (page - 1) * limit;

  const query = this.authorProfileRepo.createQueryBuilder('profile')
    .leftJoinAndSelect('profile.user', 'user')
    .skip(skip)
    .take(limit);

  if (search) {
    query.andWhere(
      `(user.first_name LIKE :search OR user.last_name LIKE :search OR profile.bio_ar LIKE :search OR profile.bio_en LIKE :search OR profile.works_ar LIKE :search OR profile.works_en LIKE :search)`,
      { search: `%${search}%` },
    );
  }

  const profiles = await query.getMany();

  return profiles.map((profile) => {
    const user = {
      id: profile.user.id,
      first_name: profile.user.first_name,
      last_name: profile.user.last_name,
      img: profile.user.img,
      created_at: profile.user.created_at,
    };

    if (lang === 'ar') {
      return {
        user,
        bio: profile.bio_ar,
        works: profile.works_ar,
      };
    } else if (lang === 'en') {
      return {
        user,
        bio: profile.bio_en,
        works: profile.works_en,
      };
    } else {
      return {
        user,
        bio: {
          ar: profile.bio_ar,
          en: profile.bio_en,
        },
        works: {
          ar: profile.works_ar,
          en: profile.works_en,
        },
      };
    }
  });
}


  async findOne(id: number, lang?: 'ar' | 'en'): Promise<any> {
  const profile = await this.authorProfileRepo.findOne({
    where: { id },
    relations: ['user'],
    select: {
      user: {
        id: true,
        first_name: true,
        last_name: true,
        img: true,
        created_at: true,
      },
    },
  });

  if (!profile) {
    throw new NotFoundException('Author profile not found');
  }

  const user = {
    id: profile.user.id,
    first_name: profile.user.first_name,
    last_name: profile.user.last_name,
    img: profile.user.img,
    created_at: profile.user.created_at,
  };

  if (lang === 'ar') {
    return {
      user,
      bio: profile.bio_ar,
      works: profile.works_ar,
    };
  } else if (lang === 'en') {
    return {
      user,
      bio: profile.bio_en,
      works: profile.works_en,
    };
  } else {
    return {
      user,
      bio: {
        ar: profile.bio_ar,
        en: profile.bio_en,
      },
      works: {
        ar: profile.works_ar,
        en: profile.works_en,
      },
    };
  }
}


  async update(id: number, dto: UpdateAuthorProfileDto): Promise<any> {
    const profile = await this.authorProfileRepo.findOne({ where: { id }, relations: ['user'] });
    if (!profile) throw new NotFoundException('Author profile not found');

    Object.assign(profile, dto);
    const updated = await this.authorProfileRepo.save(profile);
    return this.format(updated);
  }

  async remove(ids: number[] | number) {
  const idsArray = Array.isArray(ids) ? ids : [ids];
  
  const deleteResult = await this.authorProfileRepo.delete(idsArray);
  
  const affectedRows = deleteResult.affected || 0;
  
  if (affectedRows === 0) {
    throw new NotFoundException(`No authors found with the provided IDs`);
  }
  
  if (affectedRows < idsArray.length) {
    return { 
      message: `Only ${affectedRows} authors deleted successfully`, 
      warning: 'Some authors were not found' 
    };
  }
  
  return { 
    message: `${affectedRows} authors deleted successfully` 
  };
}

  private format(profile: AuthorProfile) {
    return {
      id: profile.id,
      fullName: `${profile.user.first_name} ${profile.user.last_name}`,
      image: profile.user.img,
      createdAt: profile.user.created_at,
      bio_ar: profile.bio_ar,
      bio_en: profile.bio_en,
      works_ar: profile.works_ar,
      works_en: profile.works_en,
    };
  }
}
