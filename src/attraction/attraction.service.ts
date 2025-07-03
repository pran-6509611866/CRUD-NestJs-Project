import { Injectable } from '@nestjs/common';
import { CreateAttractionDto } from './dto/create-attraction.dto';
import { UpdateAttractionDto } from './dto/update-attraction.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Attraction } from './entities/attraction.entity';

@Injectable()
export class AttractionService {
  constructor(
    @InjectRepository(Attraction)
    private attractionRepository : Repository<Attraction>,
  ) {}


  async create(createAttractionDto: CreateAttractionDto) {
    const attraction = this.attractionRepository.create(createAttractionDto)
    return await this.attractionRepository.save(attraction);
  }

  findAll() {
    return this.attractionRepository.find();
  }

  findOne(id: number) {
    return this.attractionRepository.findOneBy({id: id});
  }

  async update(id: number, updateAttractionDto: UpdateAttractionDto) {
    const attraction = await this.attractionRepository.findOneBy({id: id});
    if (!attraction) {
      throw new Error(`Attraction with id ${id} not found`);
    }
    
    // Update only the provided fields
    Object.assign(attraction, updateAttractionDto);
    
    return await this.attractionRepository.save(attraction);
  }

  async remove(id: number) {
    return await this.attractionRepository.delete(id);
  }
}
