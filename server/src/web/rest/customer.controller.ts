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
    Post,
} from '@nestjs/common';
import { ApiBearerAuth, ApiUseTags, ApiResponse, ApiOperation } from '@nestjs/swagger';
import { CustomerDTO } from '../../service/dto/customer.dto';
import { CustomerService } from '../../service/customer.service';
import { PageRequest, Page } from '../../domain/base/pagination.entity';
import { AuthGuard, Roles, RolesGuard, RoleType } from '../../security';
import { HeaderUtil } from '../../client/header-util';
import { Request } from '../../client/request';
import { LoggingInterceptor } from '../../client/interceptors/logging.interceptor';
import { BvnDTO } from '../../service/dto/bvn.dto';
import { NextOfKinDTO } from '../../service/dto/next-of-kin.dto';

@Controller('api/customers')
@UseGuards(AuthGuard, RolesGuard)
@UseInterceptors(LoggingInterceptor, ClassSerializerInterceptor)
@ApiBearerAuth()
@ApiUseTags('customers')
export class CustomerController {
    logger = new Logger('CustomerController');

    constructor(private readonly customerEntityService: CustomerService) {}

    @Get('/')
    @Roles(RoleType.USER)
    @ApiResponse({
        status: 200,
        description: 'List all records',
        type: CustomerDTO,
    })
    async getAll(@Req() req: Request): Promise<CustomerDTO[]> {
        const pageRequest: PageRequest = new PageRequest(req.query.page, req.query.size, req.query.sort);
        const [results, count] = await this.customerEntityService.findAndCount({
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
        type: CustomerDTO,
    })
    async getOne(@Param('id') id: number): Promise<CustomerDTO> {
        return await this.customerEntityService.findById(id);
    }

    @PostMethod('/')
    @Roles(RoleType.ADMIN)
    @ApiOperation({ title: 'Create customerEntity' })
    @ApiResponse({
        status: 201,
        description: 'The record has been successfully created.',
        type: CustomerDTO,
    })
    @ApiResponse({ status: 403, description: 'Forbidden.' })
    async post(@Req() req: Request, @Body() customerEntityDTO: CustomerDTO): Promise<CustomerDTO> {
        const created = await this.customerEntityService.save(customerEntityDTO, req.user?.login);
        HeaderUtil.addEntityCreatedHeaders(req.res, 'Customer', created.id);
        return created;
    }

    @Put('/')
    @Roles(RoleType.ADMIN)
    @ApiOperation({ title: 'Update customerEntity' })
    @ApiResponse({
        status: 200,
        description: 'The record has been successfully updated.',
        type: CustomerDTO,
    })
    async put(@Req() req: Request, @Body() customerEntityDTO: CustomerDTO): Promise<CustomerDTO> {
        HeaderUtil.addEntityCreatedHeaders(req.res, 'Customer', customerEntityDTO.id);
        return await this.customerEntityService.update(customerEntityDTO, req.user?.login);
    }

    @Put('/:id')
    @Roles(RoleType.ADMIN)
    @ApiOperation({ title: 'Update customerEntity with id' })
    @ApiResponse({
        status: 200,
        description: 'The record has been successfully updated.',
        type: CustomerDTO,
    })
    async putId(@Req() req: Request, @Body() customerEntityDTO: CustomerDTO): Promise<CustomerDTO> {
        HeaderUtil.addEntityCreatedHeaders(req.res, 'Customer', customerEntityDTO.id);
        return await this.customerEntityService.update(customerEntityDTO, req.user?.login);
    }

    @Delete('/:id')
    @Roles(RoleType.ADMIN)
    @ApiOperation({ title: 'Delete customerEntity' })
    @ApiResponse({
        status: 204,
        description: 'The record has been successfully deleted.',
    })
    async deleteById(@Req() req: Request, @Param('id') id: number): Promise<void> {
        HeaderUtil.addEntityDeletedHeaders(req.res, 'Customer', id);
        return await this.customerEntityService.deleteById(id);
    }

    @Post('/:id/bvn/add')
    @Roles(RoleType.USER)
    @ApiResponse({
        status: 200,
        description: 'Add customer\'s BVN to their profile'
    })
    async addBvn(@Param('id') id: number, @Body() payload: BvnDTO): Promise<any> {
        return await this.customerEntityService.addBvn(payload, id);
    }

    @Post('/:id/next_of_kin/add')
    @Roles(RoleType.USER)
    @ApiResponse({
        status: 200,
        description: 'Add customer\'s next of kin to their profile'
    })
    async addNextOfKin(@Param('id') id: number, @Body() payload: NextOfKinDTO): Promise<any> {
        return await this.customerEntityService.addNextOfKin(payload, id);
    }
}
