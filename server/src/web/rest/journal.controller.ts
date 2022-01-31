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
import { JournalDTO } from '../../service/dto/journal.dto';
import { JournalService } from '../../service/journal.service';
import { PageRequest, Page } from '../../domain/base/pagination.entity';
import { AuthGuard, Roles, RolesGuard, RoleType } from '../../security';
import { HeaderUtil } from '../../client/header-util';
import { Request } from '../../client/request';
import { LoggingInterceptor } from '../../client/interceptors/logging.interceptor';

@Controller('api/journals')
@UseGuards(AuthGuard, RolesGuard)
@UseInterceptors(LoggingInterceptor, ClassSerializerInterceptor)
@ApiBearerAuth()
@ApiUseTags('journals')
export class JournalController {
    logger = new Logger('JournalController');

    constructor(private readonly journalEntityService: JournalService) {}

    @Get('/')
    @Roles(RoleType.USER)
    @ApiResponse({
        status: 200,
        description: 'List all records',
        type: JournalDTO,
    })
    async getAll(@Req() req: Request): Promise<JournalDTO[]> {
        const pageRequest: PageRequest = new PageRequest(req.query.page, req.query.size, req.query.sort);
        const [results, count] = await this.journalEntityService.findAndCount({
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
        type: JournalDTO,
    })
    async getOne(@Param('id') id: number): Promise<JournalDTO> {
        return await this.journalEntityService.findById(id);
    }

    @PostMethod('/')
    @Roles(RoleType.ADMIN)
    @ApiOperation({ title: 'Create journalEntity' })
    @ApiResponse({
        status: 201,
        description: 'The record has been successfully created.',
        type: JournalDTO,
    })
    @ApiResponse({ status: 403, description: 'Forbidden.' })
    async post(@Req() req: Request, @Body() journalEntityDTO: JournalDTO): Promise<JournalDTO> {
        const created = await this.journalEntityService.save(journalEntityDTO, req.user?.login);
        HeaderUtil.addEntityCreatedHeaders(req.res, 'Journal', created.id);
        return created;
    }

    @Put('/')
    @Roles(RoleType.ADMIN)
    @ApiOperation({ title: 'Update journalEntity' })
    @ApiResponse({
        status: 200,
        description: 'The record has been successfully updated.',
        type: JournalDTO,
    })
    async put(@Req() req: Request, @Body() journalEntityDTO: JournalDTO): Promise<JournalDTO> {
        HeaderUtil.addEntityCreatedHeaders(req.res, 'Journal', journalEntityDTO.id);
        return await this.journalEntityService.update(journalEntityDTO, req.user?.login);
    }

    @Put('/:id')
    @Roles(RoleType.ADMIN)
    @ApiOperation({ title: 'Update journalEntity with id' })
    @ApiResponse({
        status: 200,
        description: 'The record has been successfully updated.',
        type: JournalDTO,
    })
    async putId(@Req() req: Request, @Body() journalEntityDTO: JournalDTO): Promise<JournalDTO> {
        HeaderUtil.addEntityCreatedHeaders(req.res, 'Journal', journalEntityDTO.id);
        return await this.journalEntityService.update(journalEntityDTO, req.user?.login);
    }

    @Delete('/:id')
    @Roles(RoleType.ADMIN)
    @ApiOperation({ title: 'Delete journalEntity' })
    @ApiResponse({
        status: 204,
        description: 'The record has been successfully deleted.',
    })
    async deleteById(@Req() req: Request, @Param('id') id: number): Promise<void> {
        HeaderUtil.addEntityDeletedHeaders(req.res, 'Journal', id);
        return await this.journalEntityService.deleteById(id);
    }
}
