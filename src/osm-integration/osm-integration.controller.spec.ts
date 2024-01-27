import { Test, TestingModule } from '@nestjs/testing';
import { OsmIntegrationController } from './osm-integration.controller';
import { OsmIntegrationService } from './osm-integration.service';

describe('OsmIntegrationController', () => {
  let controller: OsmIntegrationController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [OsmIntegrationController],
      providers: [OsmIntegrationService],
    }).compile();

    controller = module.get<OsmIntegrationController>(OsmIntegrationController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
