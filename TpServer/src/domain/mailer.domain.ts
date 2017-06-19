import { ConnectionManager } from "typeorm";
import { Container, Service } from "typedi";
import { Repository } from "typeorm";
import { OrmRepository } from "typeorm-typedi-extensions";
import { User } from "../entity/user";
import { Role } from "../entity/role";
import { Transporter, createTransport, SendMailOptions } from "nodemailer";
import { SmtpOptions } from "nodemailer-smtp-transport";
import { TpMailParameters } from "../timepuncher-variables-server";

const cm = Container.get(ConnectionManager);

@Service()
export class MailerDomain {
    transporter: Transporter;

    constructor() {
        let options: SmtpOptions = {
            port: TpMailParameters.port,
            host: TpMailParameters.host,
            auth: {
                user: TpMailParameters.user,
                pass: TpMailParameters.password
            },
            secure: false,
        }
        this.transporter = createTransport(options);
    }

    sendConfirmationMail(token: string) {
        let sendMailOptions: SendMailOptions = {
            from: TpMailParameters.from,
            to: 'hans.tschan@gmail.com',
            subject: 'Bestätigung Kontoeröffnung',
            html: `<p>Das ist ihr Link zum Bestätigen - bitte klicken Sie <a href='http://localhost:3000/api/v1/register/confirm?confirmation=${token}'>hier</a>, um Ihre E-Mail Adresse zu bestätigen.</p>`
        }

        this.transporter.sendMail(sendMailOptions).then((info) => {
            console.log(info.messageId);
        })
    }
}

