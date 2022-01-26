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
import { WalletDTO } from '../../service/dto/wallet.dto';
import { WalletService } from '../../service/wallet.service';
import { PageRequest, Page } from '../../domain/base/pagination.entity';
import { AuthGuard, Roles, RolesGuard, RoleType } from '../../security';
import { HeaderUtil } from '../../client/header-util';
import { Request } from '../../client/request';
import { LoggingInterceptor } from '../../client/interceptors/logging.interceptor';

@Controller('api/wallets')
@UseGuards(AuthGuard, RolesGuard)
@UseInterceptors(LoggingInterceptor, ClassSerializerInterceptor)
@ApiBearerAuth()
@ApiUseTags('wallets')
export class WalletController {
    logger = new Logger('WalletController');

    constructor(private readonly walletEntityService: WalletService) {}

    @Get('/')
    @Roles(RoleType.USER)
    @ApiResponse({
        status: 200,
        description: 'List all records',
        type: WalletDTO,
    })
    async getAll(@Req() req: Request): Promise<WalletDTO[]> {
        const pageRequest: PageRequest = new PageRequest(req.query.page, req.query.size, req.query.sort);
        const [results, count] = await this.walletEntityService.findAndCount({
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
        type: WalletDTO,
    })
    async getOne(@Param('id') id: number): Promise<WalletDTO> {
        return await this.walletEntityService.findById(id);
    }

    @PostMethod('/')
    @Roles(RoleType.ADMIN)
    @ApiOperation({ title: 'Create walletEntity' })
    @ApiResponse({
        status: 201,
        description: 'The record has been successfully created.',
        type: WalletDTO,
    })
    @ApiResponse({ status: 403, description: 'Forbidden.' })
    async post(@Req() req: Request, @Body() walletEntityDTO: WalletDTO): Promise<WalletDTO> {
        const created = await this.walletEntityService.save(walletEntityDTO, req.user?.login);
        HeaderUtil.addEntityCreatedHeaders(req.res, 'Wallet', created.id);
        return created;
    }

    @Put('/')
    @Roles(RoleType.ADMIN)
    @ApiOperation({ title: 'Update walletEntity' })
    @ApiResponse({
        status: 200,
        description: 'The record has been successfully updated.',
        type: WalletDTO,
    })
    async put(@Req() req: Request, @Body() walletEntityDTO: WalletDTO): Promise<WalletDTO> {
        HeaderUtil.addEntityCreatedHeaders(req.res, 'Wallet', walletEntityDTO.id);
        return await this.walletEntityService.update(walletEntityDTO, req.user?.login);
    }

    @Put('/:id')
    @Roles(RoleType.ADMIN)
    @ApiOperation({ title: 'Update walletEntity with id' })
    @ApiResponse({
        status: 200,
        description: 'The record has been successfully updated.',
        type: WalletDTO,
    })
    async putId(@Req() req: Request, @Body() walletEntityDTO: WalletDTO): Promise<WalletDTO> {
        HeaderUtil.addEntityCreatedHeaders(req.res, 'Wallet', walletEntityDTO.id);
        return await this.walletEntityService.update(walletEntityDTO, req.user?.login);
    }

    @Delete('/:id')
    @Roles(RoleType.ADMIN)
    @ApiOperation({ title: 'Delete walletEntity' })
    @ApiResponse({
        status: 204,
        description: 'The record has been successfully deleted.',
    })
    async deleteById(@Req() req: Request, @Param('id') id: number): Promise<void> {
        HeaderUtil.addEntityDeletedHeaders(req.res, 'Wallet', id);
        return await this.walletEntityService.deleteById(id);
    }
}
