import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Portfolio } from '../entity/portFolio.entity';
import { Repository } from 'typeorm';

@Injectable()
export class PortfolioService {
  constructor(
    @InjectRepository(Portfolio)
    private portfolioRepository: Repository<Portfolio>,
  ) {}

  async create(portfolio: Portfolio): Promise<Portfolio> {
    console.log(portfolio)
    const Portfolio = this.portfolioRepository.create(portfolio);
    return await this.portfolioRepository.save(Portfolio);
  }

  async findAll(): Promise<Portfolio[]> {
    return await this.portfolioRepository.find();
  }

  async findOne(id: number): Promise<Portfolio> {
    return await this.portfolioRepository.findOne({ where: { id } });
  }

  async update(id: number, portfolio: Partial<Portfolio>): Promise<void> {
    await this.portfolioRepository.update(id, portfolio);
  }

  async remove(id: number): Promise<void> {
    await this.portfolioRepository.delete(id);
  }
}
