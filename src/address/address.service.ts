import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { PrismaService } from '../common/prisma.service';
import { Logger, add } from 'winston';
import { ValidationService } from '../common/validation.service';
import { Address, User } from '@prisma/client';
import { AddressResponse, CreateAddressRequest, GetAddressRequest, RemoveAddressRequest, UpdateAddressRequest } from '../model/address.model';
import { AddressValidation } from './address.validation';
import { ContactService } from '../contact/contact.service';

@Injectable()
export class AddressService {
    constructor(
        @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
        private readonly prismaService: PrismaService,
        private readonly validationService: ValidationService,
        private readonly contactService: ContactService
    ) { }

    private toAddressResponse(address: Address): AddressResponse {
        return {
            id: address.id,
            street: address.street,
            city: address.city,
            province: address.province,
            country: address.country,
            postal_code: address.postal_code
        }
    }

    public async checkAddressMustExist(contactId: number, addressId: number) : Promise<Address> {
        const address = await this.prismaService.address.findFirst({
            where: {
                id: addressId,
                contact_id: contactId
            }
        })

        if (!address) {
            throw new HttpException("Address is not found", HttpStatus.NOT_FOUND)
        };
        return address
    }

    async create(user: User, request: CreateAddressRequest): Promise<AddressResponse> {
        this.logger.info(`AddressService.create(${JSON.stringify(user)}, ${JSON.stringify(request)})`)

        const createRequest: CreateAddressRequest = this.validationService.validate(
            AddressValidation.CREATE,
            request
        );

        await this.contactService.CheckContactMustExists(
            user.username,
            request.contact_id
        );

        const address = await this.prismaService.address.create({
            data: createRequest
        })

        return this.toAddressResponse(address);
    }

    async get(user: User, request: GetAddressRequest): Promise<AddressResponse> {
        const getRequest: GetAddressRequest = this.validationService.validate(
            AddressValidation.GET,
            request
        );

        await this.contactService.CheckContactMustExists(
            user.username,
            getRequest.contact_id
        );

        const address = await this.checkAddressMustExist(
            getRequest.contact_id,
            getRequest.address_id
        )

        return this.toAddressResponse(address);
    }


    async update(user: User, request: UpdateAddressRequest) : Promise<AddressResponse> {
        const updateRequest : UpdateAddressRequest = this.validationService.validate(
            AddressValidation.UPDATE,
            request
        );

        await this.contactService.CheckContactMustExists(
            user.username,
            updateRequest.contact_id
        );

        let address = await this.checkAddressMustExist(
            updateRequest.contact_id,
            updateRequest.id
        );

        address = await this.prismaService.address.update({
            where: {
                id: address.id,
                contact_id: address.contact_id
            },
            data: updateRequest
        })

        return this.toAddressResponse(address);
    }

    async remove(user: User, request: RemoveAddressRequest): Promise<AddressResponse> {
        const removeRequest: RemoveAddressRequest = this.validationService.validate(
            AddressValidation.REMOVE,
            request
        );

        await this.contactService.CheckContactMustExists(user.username, removeRequest.contact_id);

        await this.checkAddressMustExist(removeRequest.contact_id, removeRequest.address_id)

        const address = await this.prismaService.address.delete({
            where: {
                id: removeRequest.address_id,
                contact_id: removeRequest.contact_id
            }
        });

        return this.toAddressResponse(address);
    }
}
