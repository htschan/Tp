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

export interface AuthResponse {
    status?: models.OpResult;

    /**
     * Ein Authentifizierungstoken mit dem alle folgenden Aufrufe authentifiziert werden.
     */
    token?: string;

}
