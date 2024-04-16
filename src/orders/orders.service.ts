import { HttpStatus, Inject, Injectable, Logger, OnModuleInit } from '@nestjs/common';

import { PrismaClient } from '@prisma/client';
import {
  ChangeOrderStatusDto,
  CreateOrderDto,
  OrderPaginationDto,
} from './dto';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { PRODUCT_SERVICE } from 'src/config';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class OrdersService extends PrismaClient implements OnModuleInit {
  private readonly logger = new Logger('OrderService');
  constructor(
    @Inject(PRODUCT_SERVICE) private readonly productsClient: ClientProxy,
  ) {
    super();
  }
  async onModuleInit() {
    await this.$connect();
    this.logger.log('DataBase Connected');
  }
  async create(createOrderDto: CreateOrderDto) {

    const ids = [16,17]

    const products = await firstValueFrom(

      this.productsClient.send({ cmd: 'validate_product' }, ids)
    )
    

    return products;
    // return this.order.create({
    //   data: createOrderDto,
    // });
  }

  async findAll(orderPaginationDto: OrderPaginationDto) {
    const totalPages = await this.order.count({
      where: {
        status: orderPaginationDto.status,
      },
    });

    const currentPage = orderPaginationDto.page;
    const perPage = orderPaginationDto.limit;

    return {
      data: await this.order.findMany({
        skip: (currentPage - 1) * perPage,
        take: perPage,
        where: {
          status: orderPaginationDto.status,
        },
      }),
      meta: {
        total: totalPages,
        page: currentPage,
        lastPage: Math.ceil(totalPages / perPage),
      },
    };
  }

  async findOne(id: string) {
    const order = await this.order.findFirst({
      where: { id },
    });

    if (!order) {
      throw new RpcException({
        status: HttpStatus.NOT_FOUND,
        message: `Order with id ${id} not found`,
      });
    }

    return order;
  }

  async changeOrderStatus(changeOrderStatusDto: ChangeOrderStatusDto) {
    const { id, status } = changeOrderStatusDto;

    const order = await this.findOne(id);

    if (order.status === status) {
      return order;
    }

    return this.order.update({
      where: { id },
      data: {
        status,
      },
    });
  }
}
