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
import { JournalLineDTO } from '../../service/dto/journal-line.dto';
import { JournalLineService } from '../../service/journal-line.service';
import { PageRequest, Page } from '../../domain/base/pagination.entity';
import { AuthGuard, Roles, RolesGuard, RoleType } from '../../security';
import { HeaderUtil } from '../../client/header-util';
import { Request } from '../../client/request';
import { LoggingInterceptor } from '../../client/interceptors/logging.interceptor';

@Controller('api/journal-lines')
@UseGuards(AuthGuard, RolesGuard)
@UseInterceptors(LoggingInterceptor, ClassSerializerInterceptor)
@ApiBearerAuth()
@ApiUseTags('journal-lines')
export class JournalLineController {
    logger = new Logger('JournalLineController');

    constructor(private readonly journalLineEntityService: JournalLineService) {}

    @Get('/')
    @Roles(RoleType.USER)
    @ApiResponse({
        status: 200,
        description: 'List all records',
        type: JournalLineDTO,
    })
    async getAll(@Req() req: Request): Promise<JournalLineDTO[]> {
        const pageRequest: PageRequest = new PageRequest(req.query.page, req.query.size, req.query.sort);
        const [results, count] = await this.journalLineEntityService.findAndCount({
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
        type: JournalLineDTO,
    })
    async getOne(@Param('id') id: number): Promise<JournalLineDTO> {
        return await this.journalLineEntityService.findById(id);
    }

    @PostMethod('/')
    @Roles(RoleType.ADMIN)
    @ApiOperation({ title: 'Create journalLineEntity' })
    @ApiResponse({
        status: 201,
        description: 'The record has been successfully created.',
        type: JournalLineDTO,
    })
    @ApiResponse({ status: 403, description: 'Forbidden.' })
    async post(@Req() req: Request, @Body() journalLineEntityDTO: JournalLineDTO): Promise<JournalLineDTO> {
        const created = await this.journalLineEntityService.save(journalLineEntityDTO, req.user?.login);
        HeaderUtil.addEntityCreatedHeaders(req.res, 'JournalLine', created.id);
        return created;
    }

    @Put('/')
    @Roles(RoleType.ADMIN)
    @ApiOperation({ title: 'Update journalLineEntity' })
    @ApiResponse({
        status: 200,
        description: 'The record has been successfully updated.',
        type: JournalLineDTO,
    })
    async put(@Req() req: Request, @Body() journalLineEntityDTO: JournalLineDTO): Promise<JournalLineDTO> {
        HeaderUtil.addEntityCreatedHeaders(req.res, 'JournalLine', journalLineEntityDTO.id);
        return await this.journalLineEntityService.update(journalLineEntityDTO, req.user?.login);
    }

    @Put('/:id')
    @Roles(RoleType.ADMIN)
    @ApiOperation({ title: 'Update journalLineEntity with id' })
    @ApiResponse({
        status: 200,
        description: 'The record has been successfully updated.',
        type: JournalLineDTO,
    })
    async putId(@Req() req: Request, @Body() journalLineEntityDTO: JournalLineDTO): Promise<JournalLineDTO> {
        HeaderUtil.addEntityCreatedHeaders(req.res, 'JournalLine', journalLineEntityDTO.id);
        return await this.journalLineEntityService.update(journalLineEntityDTO, req.user?.login);
    }

    @Delete('/:id')
    @Roles(RoleType.ADMIN)
    @ApiOperation({ title: 'Delete journalLineEntity' })
    @ApiResponse({
        status: 204,
        description: 'The record has been successfully deleted.',
    })
    async deleteById(@Req() req: Request, @Param('id') id: number): Promise<void> {
        HeaderUtil.addEntityDeletedHeaders(req.res, 'JournalLine', id);
        return await this.journalLineEntityService.deleteById(id);
    }
}
