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

export interface SetPasswordParams {
    /**
     * Der Passwortresetcode.
     */
    code: string;

    /**
     * Der Benutzername 1 .. 80 Zeichen. Wird für das Anmeldung benötigt.
     */
    username: string;

    /**
     * Das Passwort 1 .. 80 Zeichen. Wird für die Anmeldung benötigt.
     */
    password: string;

}