import {
  Injectable,
  NotFoundException,
  NotAcceptableException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, QueryFailedError } from 'typeorm';
import { Category } from './category.entity';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
  ) {}

  async findAll(): Promise<Category[]> {
    return await this.categoryRepository.find();
  }

  async findById(id: number): Promise<Category | undefined> {
    const category = await this.categoryRepository.findOne(id);
    if (!category) {
      throw new NotFoundException();
    }
    return category;
  }

  async create(dto: CreateCategoryDto): Promise<Category> {
    const category = this.categoryRepository.create(dto);
    return await this.categoryRepository.save(category);
  }

  async update(id: number, dto: UpdateCategoryDto): Promise<Category> {
    const category = await this.categoryRepository.findOne(id);
    if (category) {
      const updatedCategory = this.categoryRepository.merge(category, dto);
      return this.categoryRepository.save(updatedCategory);
    } else {
      throw new NotFoundException();
    }
  }

  async delete(id: number): Promise<Category> {
    const category = await this.categoryRepository.findOne(id);
    if (category) {
      try {
        await this.categoryRepository.delete(id);
      } catch (error) {
        if (error instanceof QueryFailedError) {
          throw new NotAcceptableException(error);
        } else {
          throw error;
        }
      }
      return category;
    } else {
      throw new NotFoundException();
    }
  }
}
