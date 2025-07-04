import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { AttractionService } from './attraction.service';
import { CreateAttractionDto } from './dto/create-attraction.dto';
import { UpdateAttractionDto } from './dto/update-attraction.dto';
import { LoggingService } from 'nestjs-logging-lib'; // เปลี่ยนจาก Logger

@Controller('attraction')
export class AttractionController {
  constructor(
    private readonly attractionService: AttractionService,
    private readonly logger: LoggingService // เปลี่ยนจาก Logger
  ) {}

  @Post()
  async create(@Body() createAttractionDto: CreateAttractionDto) {
    this.logger.log(`POST /attraction - สร้าง attraction ใหม่`, 'AttractionController');
    this.logger.log(`ข้อมูลที่ส่งมา: ${JSON.stringify(createAttractionDto)}`, 'AttractionController');
    
    try {
      const attraction = await this.attractionService.create(createAttractionDto);
      this.logger.log(`สร้าง attraction สำเร็จ ID: ${attraction.id}, ชื่อ: ${attraction.name}`, 'AttractionController');
      return attraction;
    } catch (error) {
      this.logger.error('เกิดข้อผิดพลาดในการสร้าง attraction', error.stack, 'AttractionController');
      throw error;
    }
  }

  @Get()
  async findAll() {
    this.logger.log('GET /attraction - ดึงข้อมูล attraction ทั้งหมด', 'AttractionController');
    
    try {
      const attractions = await this.attractionService.findAll();
      this.logger.log(`พบข้อมูล attraction จำนวน ${attractions.length} รายการ`, 'AttractionController');
      return attractions;
    } catch (error) {
      this.logger.error('เกิดข้อผิดพลาดในการดึงข้อมูล attraction ทั้งหมด', error.stack, 'AttractionController');
      throw error;
    }
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    this.logger.log(`GET /attraction/${id} - ค้นหา attraction ID: ${id}`, 'AttractionController');
    
    try {
      const attraction = await this.attractionService.findOne(+id);
      if (!attraction) {
        this.logger.warn(`ไม่พบ attraction ID: ${id}`, 'AttractionController');
        throw new Error(`Attraction with id ${id} not found`);
      }
      this.logger.log(`พบ attraction: ${attraction.name} ที่ ${attraction.detail}`, 'AttractionController');
      return attraction;
    } catch (error) {
      this.logger.error(`เกิดข้อผิดพลาดในการค้นหา attraction ID: ${id}`, error.stack, 'AttractionController');
      throw error;
    }
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateAttractionDto: UpdateAttractionDto) {
    this.logger.log(`PATCH /attraction/${id} - อัปเดต attraction ID: ${id}`, 'AttractionController');
    this.logger.log(`ข้อมูลที่จะอัปเดต: ${JSON.stringify(updateAttractionDto)}`, 'AttractionController');
    
    try {
      const attraction = await this.attractionService.update(+id, updateAttractionDto);
      this.logger.log(`อัปเดต attraction สำเร็จ: ${attraction.name}`, 'AttractionController');
      return attraction;
    } catch (error) {
      this.logger.error(`เกิดข้อผิดพลาดในการอัปเดต attraction ID: ${id}`, error.stack, 'AttractionController');
      throw error;
    }
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    this.logger.log(`DELETE /attraction/${id} - ลบ attraction ID: ${id}`, 'AttractionController');
    
    try {
      const result = await this.attractionService.remove(+id);
      this.logger.log(`ลบ attraction ID: ${id} สำเร็จ`, 'AttractionController');
      return { message: `ลบ attraction ID ${id} สำเร็จ`, result };
    } catch (error) {
      this.logger.error(`เกิดข้อผิดพลาดในการลบ attraction ID: ${id}`, error.stack, 'AttractionController');
      throw error;
    }
  }
}