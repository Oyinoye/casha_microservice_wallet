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
import { AppTransactDTO } from '../../service/dto/app-transact.dto';
import { AppTransactService } from '../../service/app-transact.service';
import { PageRequest, Page } from '../../domain/base/pagination.entity';
import { AuthGuard, Roles, RolesGuard, RoleType } from '../../security';
import { HeaderUtil } from '../../client/header-util';
import { Request } from '../../client/request';
import { LoggingInterceptor } from '../../client/interceptors/logging.interceptor';

@Controller('api/app-transacts')
@UseGuards(AuthGuard, RolesGuard)
@UseInterceptors(LoggingInterceptor, ClassSerializerInterceptor)
@ApiBearerAuth()
@ApiUseTags('app-transacts')
export class AppTransactController {
    logger = new Logger('AppTransactController');

    constructor(private readonly appTransactEntityService: AppTransactService) {}

    @Get('/')
    @Roles(RoleType.USER)
    @ApiResponse({
        status: 200,
        description: 'List all records',
        type: AppTransactDTO,
    })
    async getAll(@Req() req: Request): Promise<AppTransactDTO[]> {
        const pageRequest: PageRequest = new PageRequest(req.query.page, req.query.size, req.query.sort);
        const [results, count] = await this.appTransactEntityService.findAndCount({
            skip: +pageRequest.page * pageRequest.size,
            take: +pageRequest.size,
            order: pageRequest.sort.asOrder(),
        });
        // HeaderUtil.addPaginationHeaders(req.res, new Page(results, count, pageRequest));
        return results;
    }

    @Get('/:id')
    @Roles(RoleType.USER)
    @ApiResponse({
        status: 200,
        description: 'The found record',
        type: AppTransactDTO,
    })
    async getOne(@Param('id') id: number): Promise<AppTransactDTO> {
        return await this.appTransactEntityService.findById(id);
    }

    @PostMethod('/')
    @Roles(RoleType.ADMIN)
    @ApiOperation({ title: 'Create appTransactEntity' })
    @ApiResponse({
        status: 201,
        description: 'The record has been successfully created.',
        type: AppTransactDTO,
    })
    @ApiResponse({ status: 403, description: 'Forbidden.' })
    async post(@Req() req: Request, @Body() appTransactEntityDTO: AppTransactDTO): Promise<AppTransactDTO> {
        const created = await this.appTransactEntityService.save(appTransactEntityDTO, req.user?.login);
        HeaderUtil.addEntityCreatedHeaders(req.res, 'AppTransact', created.id);
        return created;
    }

    @Put('/')
    @Roles(RoleType.ADMIN)
    @ApiOperation({ title: 'Update appTransactEntity' })
    @ApiResponse({
        status: 200,
        description: 'The record has been successfully updated.',
        type: AppTransactDTO,
    })
    async put(@Req() req: Request, @Body() appTransactEntityDTO: AppTransactDTO): Promise<AppTransactDTO> {
        HeaderUtil.addEntityCreatedHeaders(req.res, 'AppTransact', appTransactEntityDTO.id);
        return await this.appTransactEntityService.update(appTransactEntityDTO, req.user?.login);
    }

    @Put('/:id')
    @Roles(RoleType.ADMIN)
    @ApiOperation({ title: 'Update appTransactEntity with id' })
    @ApiResponse({
        status: 200,
        description: 'The record has been successfully updated.',
        type: AppTransactDTO,
    })
    async putId(@Req() req: Request, @Body() appTransactEntityDTO: AppTransactDTO): Promise<AppTransactDTO> {
        HeaderUtil.addEntityCreatedHeaders(req.res, 'AppTransact', appTransactEntityDTO.id);
        return await this.appTransactEntityService.update(appTransactEntityDTO, req.user?.login);
    }

    @Delete('/:id')
    @Roles(RoleType.ADMIN)
    @ApiOperation({ title: 'Delete appTransactEntity' })
    @ApiResponse({
        status: 204,
        description: 'The record has been successfully deleted.',
    })
    async deleteById(@Req() req: Request, @Param('id') id: number): Promise<void> {
        HeaderUtil.addEntityDeletedHeaders(req.res, 'AppTransact', id);
        return await this.appTransactEntityService.deleteById(id);
    }
}
