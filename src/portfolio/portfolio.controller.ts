import { Controller, Get, Post, Param, Body, Put, Delete } from '@nestjs/common';
import { PortfolioService } from './portfolio.service';
import { Portfolio } from '../entity/portFolio.entity';

@Controller('/api/v1/portfolio')
export class PortfolioController {
  constructor(private readonly portfolioService: PortfolioService) {}

  @Post()
  async create(@Body() portfolio: Portfolio) {
    return await this.portfolioService.create(portfolio);
  }

  @Get()
  async findAll() {
    return await this.portfolioService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: number) {
    return await this.portfolioService.findOne(id);
  }

  @Put(':id')
  async update(@Param('id') id: number, @Body() portfolio: Partial<Portfolio>) {
    await this.portfolioService.update(id, portfolio);
    return { message: `Portfolio with ID ${id} updated successfully` };
  }

  @Delete(':id')
  async remove(@Param('id') id: number) {
    await this.portfolioService.remove(id);
    return { message: `Portfolio with ID ${id} deleted successfully` };
  }
}
