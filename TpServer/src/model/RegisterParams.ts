/**
 * TimePuncher
 * No description provided (generated by Swagger Codegen https://github.com/swagger-api/swagger-codegen)
 *
 * OpenAPI spec version: 1.0.0
 * Contact: hans.tschan@gmail.com
 *
 * NOTE: This class is auto generated by the swagger code generator program.
 * https://github.com/swagger-api/swagger-codegen.git
 * Do not edit the class manually.
 */

import * as models from './models';

export interface RegisterParams {
    /**
     * Der Vorname, 1 .. 80 Zeichen
     */
    firstname?: string;

    /**
     * Der Name, 1 .. 80 Zeichen
     */
    name?: string;

    /**
     * Die E-Mail Adresse 1 .. 160 Zeichen. Wird benötigt für die Bestätigung der Kontoerstellung.
     */
    email: string;

    /**
     * Der Benutzername 1 .. 80 Zeichen. Wird für die Anmeldung benötigt.
     */
    username: string;

    /**
     * Das Passwort 1 .. 80 Zeichen. Wird für die Anmeldung benötigt.
     */
    password: string;

}