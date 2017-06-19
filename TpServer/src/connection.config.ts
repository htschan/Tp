import { ConnectionOptions } from "typeorm";
import { TpDatabaseDriverOption } from "./timepuncher-variables-server";

import { Punch } from "./entity/punch";
import { User } from "./entity/user";
import { Role } from "./entity/role";
import { YearPunch } from "./entity/yearpunch";
import { MonthPunch } from "./entity/monthpunch";
import { WeekPunch } from "./entity/weekpunch";
import { DayPunch } from "./entity/daypunch";

export const databaseConfig: ConnectionOptions = {
    driver: TpDatabaseDriverOption,
    entities: [
        Punch,
        User,
        Role,
        YearPunch,
        MonthPunch,
        WeekPunch,
        DayPunch
    ],
    autoSchemaSync: true
};