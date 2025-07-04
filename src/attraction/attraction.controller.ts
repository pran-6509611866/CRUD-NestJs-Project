import { Controller, Get, Post, Body, Patch, Param, Delete, Logger } from '@nestjs/common';
import { AttractionService } from './attraction.service';
import { CreateAttractionDto } from './dto/create-attraction.dto';
import { UpdateAttractionDto } from './dto/update-attraction.dto';
import { LoggingModule } from 'nestjs-logging-lib';

@Controller('attraction')
export class AttractionController {
  private readonly logger = new Logger(AttractionController.name);

  constructor(private readonly attractionService: AttractionService) {}

  @Post()
  async create(@Body() createAttractionDto: CreateAttractionDto) {
    this.logger.log('Creating attraction: ' + JSON.stringify(createAttractionDto));
    try {
      const attraction = await this.attractionService.create(createAttractionDto);
      this.logger.log(`Created attraction with id: ${attraction.id}`);
      return attraction;
    } catch (error) {
      this.logger.error('Error creating attraction:', error);
      throw error;
    }
  }

  @Get()
  async findAll() {
    this.logger.log('Finding all attractions');
    try {
      const attractions = await this.attractionService.findAll();
      this.logger.log(`Found ${attractions.length} attractions`);
      return attractions;
    } catch (error) {
      this.logger.error('Error finding all attractions:', error);
      throw error;
    }
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    this.logger.log(`Finding attraction with id: ${id}`);
    try {
      const attraction = await this.attractionService.findOne(+id);
      if (!attraction) {
        this.logger.warn(`Attraction with id ${id} not found`);
        throw new Error(`Attraction with id ${id} not found`);
      }
      this.logger.log(`Found attraction: ${attraction.name}`);
      return attraction;
    } catch (error) {
      this.logger.error(`Error finding attraction with id ${id}:`, error);
      throw error;
    }
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateAttractionDto: UpdateAttractionDto) {
    this.logger.log(`Updating attraction with id: ${id}, data: ${JSON.stringify(updateAttractionDto)}`);
    try {
      const attraction = await this.attractionService.update(+id, updateAttractionDto);
      this.logger.log(`Updated attraction: ${attraction.name}`);
      return attraction;
    } catch (error) {
      this.logger.error(`Error updating attraction with id ${id}:`, error);
      throw error;
    }
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    this.logger.log(`Removing attraction with id: ${id}`);
    try {
      const result = await this.attractionService.remove(+id);
      this.logger.log(`Successfully removed attraction with id: ${id}`);
      return result;
    } catch (error) {
      this.logger.error(`Error removing attraction with id ${id}:`, error);
      throw error;
    }
  }
}
