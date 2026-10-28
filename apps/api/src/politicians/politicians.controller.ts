import { Controller, Get, Header, NotFoundException, Param, Query } from '@nestjs/common';
import { RealDataService } from './real-data.service';

@Controller()
export class PoliticiansController {
  constructor(private readonly dataService: RealDataService) {}

  @Get('politicians')
  @Header('Cache-Control', 'public, max-age=86400, stale-while-revalidate=3600')
  async listPoliticians(
    @Query('q') q?: string,
    @Query('uf') uf?: string,
    @Query('party') party?: string,
    @Query('office') office?: string,
    @Query('page') page?: string,
    @Query('pageSize') pageSize?: string,
  ) {
    return this.dataService.listPoliticians({
      q,
      uf,
      party,
      office,
      page: page ? parseInt(page, 10) : 1,
      pageSize: pageSize ? parseInt(pageSize, 10) : 50,
    });
  }

  @Get('parties')
  @Header('Cache-Control', 'public, max-age=86400, stale-while-revalidate=3600')
  async listParties() {
    return this.dataService.listParties();
  }

  @Get('politicians/:id')
  @Header('Cache-Control', 'public, max-age=86400, stale-while-revalidate=3600')
  async getPolitician(@Param('id') id: string) {
    const p = await this.dataService.getPolitician(id);
    if (!p) throw new NotFoundException('Parlamentar não encontrado.');
    return p;
  }

  @Get('politicians/:id/votes')
  @Header('Cache-Control', 'public, max-age=86400, stale-while-revalidate=3600')
  async getVotes(@Param('id') id: string, @Query('year') year?: string) {
    return this.dataService.getVotes(id, year ? parseInt(year, 10) : undefined);
  }

  @Get('politicians/:id/proposals')
  @Header('Cache-Control', 'public, max-age=86400, stale-while-revalidate=3600')
  async getProposals(@Param('id') id: string, @Query('year') year?: string) {
    return this.dataService.getProposals(id, year ? parseInt(year, 10) : undefined);
  }

  @Get('proposals/:id')
  @Header('Cache-Control', 'public, max-age=86400, stale-while-revalidate=3600')
  async getProposal(@Param('id') id: string) {
    const prop = await this.dataService.getProposal(id);
    if (!prop) throw new NotFoundException('Proposição não encontrada.');
    return prop;
  }

  @Get('politicians/:id/expenses')
  @Header('Cache-Control', 'public, max-age=86400, stale-while-revalidate=3600')
  async getExpenses(@Param('id') id: string, @Query('year') year?: string) {
    return this.dataService.getExpenses(id, year ? parseInt(year, 10) : undefined);
  }

  @Get('politicians/:id/assets')
  @Header('Cache-Control', 'public, max-age=86400, stale-while-revalidate=3600')
  async getAssets(@Param('id') id: string) {
    return this.dataService.getAssets(id);
  }

  @Get('politicians/:id/staff')
  @Header('Cache-Control', 'public, max-age=86400, stale-while-revalidate=3600')
  async getStaff(@Param('id') id: string) {
    return this.dataService.getStaff(id);
  }

  @Get('politicians/:id/news')
  @Header('Cache-Control', 'no-cache, no-store, max-age=0, must-revalidate')
  async getNews(@Param('id') id: string) {
    return this.dataService.getNews(id);
  }

  @Get('politicians/:id/compatibility')
  @Header('Cache-Control', 'public, max-age=86400, stale-while-revalidate=3600')
  async getCompatibility(@Param('id') id: string) {
    return this.dataService.getCompatibility(id);
  }

  @Get('feed')
  async getFeed() {
    return this.dataService.getFeed();
  }

  @Get('users/me/feed')
  async getMyFeed() {
    return this.dataService.getFeed();
  }
}
