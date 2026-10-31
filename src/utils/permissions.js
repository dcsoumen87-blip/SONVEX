import { config } from "../config/config.js";

export function isDeveloper(userId) {
    return userId === config.developerID;
}
