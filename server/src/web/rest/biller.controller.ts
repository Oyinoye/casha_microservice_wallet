import {
    Body,
    ClassSerializerInterceptor,
    Controller,
    Delete,
    Get,
    Logger,
    Param,
    Post as PostMethod,
    Put,
    UseGuards,
    Req,
    UseInterceptors,
} from '@nestjs/common';
import { ApiBearerAuth, ApiUseTags, ApiResponse, ApiOperation } from '@nestjs/swagger';
import { BillerDTO } from '../../service/dto/biller.dto';
import { BillerService } from '../../service/biller.service';
import { PageRequest, Page } from '../../domain/base/pagination.entity';
import { AuthGuard, Roles, RolesGuard, RoleType } from '../../security';
import { HeaderUtil } from '../../client/header-util';
import { Request } from '../../client/request';
import { LoggingInterceptor } from '../../client/interceptors/logging.interceptor';

@Controller('api/billers')
@UseGuards(AuthGuard, RolesGuard)
@UseInterceptors(LoggingInterceptor, ClassSerializerInterceptor)
@ApiBearerAuth()
@ApiUseTags('billers')
export class BillerController {
    logger = new Logger('BillerController');

    constructor(private readonly billerEntityService: BillerService) {}

    @Get('/')
    @Roles(RoleType.USER)
    @ApiResponse({
        status: 200,
        description: 'List all records',
        type: BillerDTO,
    })
    async getAll(@Req() req: Request): Promise<BillerDTO[]> {
        const pageRequest: PageRequest = new PageRequest(req.query.page, req.query.size, req.query.sort);
        const [results, count] = await this.billerEntityService.findAndCount({
            skip: +pageRequest.page * pageRequest.size,
            take: +pageRequest.size,
            order: pageRequest.sort.asOrder(),
        });
        HeaderUtil.addPaginationHeaders(req.res, new Page(results, count, pageRequest));
        return results;
    }

    @Get('/:id')
    @Roles(RoleType.USER)
    @ApiResponse({
        status: 200,
        description: 'The found record',
        type: BillerDTO,
    })
    async getOne(@Param('id') id: number): Promise<BillerDTO> {
        return await this.billerEntityService.findById(id);
    }

    @PostMethod('/')
    @Roles(RoleType.ADMIN)
    @ApiOperation({ title: 'Create billerEntity' })
    @ApiResponse({
        status: 201,
        description: 'The record has been successfully created.',
        type: BillerDTO,
    })
    @ApiResponse({ status: 403, description: 'Forbidden.' })
    async post(@Req() req: Request, @Body() billerEntityDTO: BillerDTO): Promise<BillerDTO> {
        const created = await this.billerEntityService.save(billerEntityDTO, req.user?.login);
        HeaderUtil.addEntityCreatedHeaders(req.res, 'Biller', created.id);
        return created;
    }

    @Put('/')
    @Roles(RoleType.ADMIN)
    @ApiOperation({ title: 'Update billerEntity' })
    @ApiResponse({
        status: 200,
        description: 'The record has been successfully updated.',
        type: BillerDTO,
    })
    async put(@Req() req: Request, @Body() billerEntityDTO: BillerDTO): Promise<BillerDTO> {
        HeaderUtil.addEntityCreatedHeaders(req.res, 'Biller', billerEntityDTO.id);
        return await this.billerEntityService.update(billerEntityDTO, req.user?.login);
    }

    @Put('/:id')
    @Roles(RoleType.ADMIN)
    @ApiOperation({ title: 'Update billerEntity with id' })
    @ApiResponse({
        status: 200,
        description: 'The record has been successfully updated.',
        type: BillerDTO,
    })
    async putId(@Req() req: Request, @Body() billerEntityDTO: BillerDTO): Promise<BillerDTO> {
        HeaderUtil.addEntityCreatedHeaders(req.res, 'Biller', billerEntityDTO.id);
        return await this.billerEntityService.update(billerEntityDTO, req.user?.login);
    }

    @Delete('/:id')
    @Roles(RoleType.ADMIN)
    @ApiOperation({ title: 'Delete billerEntity' })
    @ApiResponse({
        status: 204,
        description: 'The record has been successfully deleted.',
    })
    async deleteById(@Req() req: Request, @Param('id') id: number): Promise<void> {
        HeaderUtil.addEntityDeletedHeaders(req.res, 'Biller', id);
        return await this.billerEntityService.deleteById(id);
    }
}
