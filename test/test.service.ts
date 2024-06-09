import { Injectable } from "@nestjs/common";
import { PrismaService } from "../src/common/prisma.service";
import * as bcrypt from 'bcrypt';
import { Address, Contact } from "@prisma/client";

@Injectable()
export class TestService {
    constructor(private readonly prismaService: PrismaService) { }

    async deleteAll(): Promise<void> {
        await this.deleteAddressess();
        await this.deleteContact();
        await this.deleteUser();
    }

    async deleteUser() {
        await this.prismaService.user.deleteMany({
            where: {
                username: 'test'
            }
        })
    }

    async deleteContact() {
        await this.prismaService.contact.deleteMany({
            where: {
                username: 'test'
            }
        })
    }

    async deleteAddressess() {
        await this.prismaService.address.deleteMany({
            where: {
                contact: {
                    username: 'test'
                }
            }
        })
    }

    async createUser() {
        await this.prismaService.user.create({
            data: {
                username: 'test',
                name: 'test',
                password: await bcrypt.hash('test', 10),
                token: 'test',
            }
        })
    }

    async getContact(): Promise<Contact> {
        return this.prismaService.contact.findFirst({
            where: {
                username: 'test'
            },
        })
    }

    async createContact() {
        await this.prismaService.contact.create({
            data: {
                first_name: 'test',
                last_name: 'test',
                email: 'test@example.com',
                phone: '9999',
                username: 'test'
            }
        })
    }

    async createAddressess() {
        const contact = await this.getContact();
        await this.prismaService.address.create({
            data: {
                contact_id: contact.id,
                street: 'bekasi',
                city: 'bekasi',
                province: 'bekasi',
                country: 'bekasi',
                postal_code: '17134',
            }
        })
    }

    async getAdrress(): Promise<Address> {
        return this.prismaService.address.findFirst({
            where: {
                contact: {
                    username: 'test'
                }
            }
        })
    }
}