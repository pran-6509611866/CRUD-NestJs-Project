import { Injectable } from '@nestjs/common';
import { CreateAttractionDto } from './dto/create-attraction.dto';
import { UpdateAttractionDto } from './dto/update-attraction.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Attraction } from './entities/attraction.entity';
import { LoggingService } from 'nestjs-logging-lib'; // เพิ่มบรรทัดนี้

@Injectable()
export class AttractionService {
  constructor(
    @InjectRepository(Attraction)
    private attractionRepository: Repository<Attraction>,
    private readonly logger: LoggingService // เพิ่มบรรทัดนี้
  ) {}

  async create(createAttractionDto: CreateAttractionDto) {
    this.logger.log('เริ่มสร้าง attraction ใหม่', 'AttractionService');
    this.logger.log(`ข้อมูล: name=${createAttractionDto.name}, location=${createAttractionDto.detail}`, 'AttractionService');
    
    try {
      const attraction = this.attractionRepository.create(createAttractionDto);
      const savedAttraction = await this.attractionRepository.save(attraction);
      this.logger.log(`บันทึก attraction สำเร็จ ID: ${savedAttraction.id}`, 'AttractionService');
      return savedAttraction;
    } catch (error) {
      this.logger.error('เกิดข้อผิดพลาดในการบันทึก attraction', error.stack, 'AttractionService');
      throw error;
    }
  }

  async findAll() {
    this.logger.log('เริ่มดึงข้อมูล attraction ทั้งหมดจากฐานข้อมูล', 'AttractionService');
    
    try {
      const attractions = await this.attractionRepository.find();
      this.logger.log(`ดึงข้อมูลจากฐานข้อมูลสำเร็จ จำนวน ${attractions.length} รายการ`, 'AttractionService');
      
      if (attractions.length > 0) {
        this.logger.log(`ตัวอย่างข้อมูล: ${attractions[0].name} (${attractions[0].detail})`, 'AttractionService');
      }
      
      return attractions;
    } catch (error) {
      this.logger.error('เกิดข้อผิดพลาดในการดึงข้อมูลจากฐานข้อมูล', error.stack, 'AttractionService');
      throw error;
    }
  }

  async findOne(id: number) {
    this.logger.log(`ค้นหา attraction ID: ${id} จากฐานข้อมูล`, 'AttractionService');
    
    try {
      const attraction = await this.attractionRepository.findOneBy({ id: id });
      
      if (attraction) {
        this.logger.log(`พบ attraction: ${attraction.name} ที่พิกัด (${attraction.latitude}, ${attraction.logitude})`, 'AttractionService');
      } else {
        this.logger.warn(`ไม่พบ attraction ID: ${id} ในฐานข้อมูล`, 'AttractionService');
      }
      
      return attraction;
    } catch (error) {
      this.logger.error(`เกิดข้อผิดพลาดในการค้นหา attraction ID: ${id}`, error.stack, 'AttractionService');
      throw error;
    }
  }

  async update(id: number, updateAttractionDto: UpdateAttractionDto) {
    this.logger.log(`เริ่มอัปเดต attraction ID: ${id}`, 'AttractionService');
    this.logger.log(`ฟิลด์ที่จะอัปเดต: ${Object.keys(updateAttractionDto).join(', ')}`, 'AttractionService');
    
    try {
      const attraction = await this.attractionRepository.findOneBy({ id: id });
      if (!attraction) {
        this.logger.error(`ไม่พบ attraction ID: ${id} สำหรับการอัปเดต`, null, 'AttractionService');
        throw new Error(`Attraction with id ${id} not found`);
      }

      // บันทึกข้อมูลเดิมก่อนอัปเดต
      this.logger.log(`ข้อมูลเดิม: ${attraction.name}`, 'AttractionService');
      
      Object.assign(attraction, updateAttractionDto);
      const updatedAttraction = await this.attractionRepository.save(attraction);
      
      this.logger.log(`อัปเดต attraction สำเร็จ: ${updatedAttraction.name}`, 'AttractionService');
      return updatedAttraction;
    } catch (error) {
      this.logger.error(`เกิดข้อผิดพลาดในการอัปเดต attraction ID: ${id}`, error.stack, 'AttractionService');
      throw error;
    }
  }

  async remove(id: number) {
    this.logger.log(`เริ่มลบ attraction ID: ${id}`, 'AttractionService');
    
    try {
      // ตรวจสอบว่ามีข้อมูลอยู่หรือไม่ก่อนลบ
      const attraction = await this.attractionRepository.findOneBy({ id: id });
      if (attraction) {
        this.logger.log(`จะลบ attraction: ${attraction.name}`, 'AttractionService');
      }
      
      const result = await this.attractionRepository.delete(id);
      
      if ((result.affected ?? 0) > 0) {
        this.logger.log(`ลบ attraction ID: ${id} สำเร็จ`, 'AttractionService');
      } else {
        this.logger.warn(`ไม่มีข้อมูลที่ถูกลบ ID: ${id}`, 'AttractionService');
      }
      
      return result;
    } catch (error) {
      this.logger.error(`เกิดข้อผิดพลาดในการลบ attraction ID: ${id}`, error.stack, 'AttractionService');
      throw error;
    }
  }
}