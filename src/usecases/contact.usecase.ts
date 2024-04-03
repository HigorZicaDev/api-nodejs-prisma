import { Contact, ContactCreate, ContactRepository } from "../interfaces/contact.interface";
import { UserRepository } from "../interfaces/user.interface";
import { ContactRepositoryPrisma } from "../repositories/contact.repository";
import { UserRepositoryPrisma } from "../repositories/user.repository";

class ContactUseCase {
    private contactRepository: ContactRepository;
    private userRepository: UserRepository;
    constructor(){
        this.contactRepository = new ContactRepositoryPrisma();
        this.userRepository = new UserRepositoryPrisma();
    }

    async create({email, name, phone, userEmail}: ContactCreate){
        const user = await this.userRepository.findByEmail(userEmail);
        if(!user){
            throw new Error(`User ${userEmail}`);
        }

        const verifyIfExistsContact = await this.contactRepository.findByEmailOrPhone(email, phone);
        if(verifyIfExistsContact){
            throw new Error(`Contact already exists`);
        }

        const contact = await this.contactRepository.create({
            email,name,phone,userId: user.id
        })
        return contact;
    }

    async listAllContacts(userEmail: string){
        const user = await this.userRepository.findByEmail(userEmail);
        if(!user){
            throw new Error(`User ${userEmail}`);
        }
        const contacts = await this.contactRepository.findAllContacts(user.id);
        return contacts;
    }

    async updateContact({id, name, email, phone}: Contact){
        const data = await this.contactRepository.updateContact({
            id,
            name,
            email,
            phone
        });

        return data;
    }

    async delete(id: string) {
        const data = await this.contactRepository.delete(id);

        return data;
    }
}

export { ContactUseCase };